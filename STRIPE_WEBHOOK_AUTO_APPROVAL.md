# Stripe Webhook with Auto-Approval & Welcome Email

## Overview

When auto-approval is enabled, new members are automatically approved after payment and receive a welcome email with login details and next steps.

## Admin Settings

Navigate to `/admin` → Settings tab:

- **Auto-Approve After Payment**: Automatically approve members when payment succeeds
- **Require Email Verification**: Require email verification before approval
- **Send Welcome Email**: Send welcome emails to newly approved members

## Stripe Webhook Edge Function

Deploy this edge function to handle Stripe webhooks with auto-approval and welcome emails:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const event = JSON.parse(body);
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sendgridKey = Deno.env.get('SENDGRID_API_KEY');

    const supabaseRequest = async (endpoint: string, method: string, body?: any) => {
      const response = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
        method,
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': method === 'GET' ? 'return=representation' : 'return=minimal'
        },
        body: body ? JSON.stringify(body) : undefined
      });
      if (method === 'GET') return response.json();
      return response;
    };

    const getAdminSetting = async (key: string): Promise<any> => {
      try {
        const settings = await supabaseRequest(
          `admin_settings?setting_key=eq.${key}&select=setting_value`, 
          'GET'
        );
        return settings?.[0]?.setting_value;
      } catch (e) {
        return null;
      }
    };

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = session.customer_email || session.customer_details?.email;
      
      const autoApprovalSetting = await getAdminSetting('auto_approval');
      const autoApprove = autoApprovalSetting?.enabled === true;
      const sendWelcomeEmail = autoApprovalSetting?.send_welcome_email === true;
      
      // Update customer record
      await supabaseRequest(`customers?email=eq.${encodeURIComponent(email)}`, 'PATCH', {
        stripe_subscription_id: session.subscription,
        stripe_customer_id: session.customer,
        subscription_status: 'active',
        approval_status: autoApprove ? 'approved' : 'pending',
        approved_at: autoApprove ? new Date().toISOString() : null
      });

      // Send welcome email if auto-approved and email enabled
      if (autoApprove && sendWelcomeEmail && sendgridKey) {
        const customers = await supabaseRequest(
          `customers?email=eq.${encodeURIComponent(email)}&select=first_name,last_name,membership_tier`,
          'GET'
        );
        
        if (customers?.[0]) {
          const c = customers[0];
          const name = `${c.first_name} ${c.last_name}`;
          const tier = c.membership_tier || 'Foundation';
          
          await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sendgridKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email }] }],
              from: { email: 'noreply@nareis.org', name: 'NAREIS' },
              subject: 'Welcome to NAREIS - Your Membership is Active!',
              content: [{ type: 'text/html', value: generateWelcomeEmail(name, tier) }]
            })
          });
          console.log('Welcome email sent to:', email);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

function generateWelcomeEmail(name: string, tier: string): string {
  return `<!DOCTYPE html><html><head><style>
    body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
    .header{background:linear-gradient(135deg,#2563eb,#7c3aed);color:white;padding:30px;text-align:center;border-radius:8px 8px 0 0}
    .content{padding:30px;background:#f9fafb}.highlight{background:#e0f2fe;padding:20px;border-radius:8px;margin:20px 0}
    .button{display:inline-block;padding:14px 28px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;margin:20px 0}
    .benefits{background:white;padding:20px;border-radius:8px;margin:20px 0}
    .footer{padding:20px;text-align:center;color:#666;font-size:12px;background:#f3f4f6;border-radius:0 0 8px 8px}
  </style></head><body>
    <div class="header"><h1>Welcome to NAREIS!</h1><p>Your membership is now active</p></div>
    <div class="content">
      <p>Dear ${name},</p>
      <p>Congratulations! Your <strong>${tier}</strong> membership has been approved.</p>
      <div class="highlight">
        <h3>Your Next Steps:</h3>
        <ol>
          <li>Log in to your member dashboard</li>
          <li>Complete your profile</li>
          <li>Explore member resources</li>
          <li>Join upcoming events</li>
        </ol>
      </div>
      <a href="https://nareis.org/dashboard" class="button">Access Your Dashboard</a>
      <div class="benefits">
        <h3>Your Benefits Include:</h3>
        <ul>
          <li>Exclusive member resources</li>
          <li>Networking events</li>
          <li>Industry advocacy updates</li>
          <li>Professional development</li>
        </ul>
      </div>
      <p>Welcome to the community!</p>
      <p>The NAREIS Team</p>
    </div>
    <div class="footer"><p>© 2025 NAREIS.org</p></div>
  </body></html>`;
}
```

## Flow

1. User signs up and completes onboarding
2. User pays via Stripe Checkout
3. Stripe sends `checkout.session.completed` webhook
4. Webhook checks `admin_settings` for `auto_approval`
5. If auto-approval enabled: Set `approval_status` = 'approved'
6. If welcome email enabled: Send email via SendGrid
7. User receives welcome email with dashboard access

## Testing

1. Enable auto-approval and welcome email in Admin Settings
2. Create test user and complete payment with test card
3. Verify user is approved and receives welcome email
4. Confirm user can access member dashboard
