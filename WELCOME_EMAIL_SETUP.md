# Welcome Email System Setup

## Overview

This system automatically sends welcome emails to newly approved members. When auto-approval is enabled, members receive a welcome email immediately after successful payment.

## Components

### 1. Email Templates (`src/lib/emailTemplates.ts`)

The `welcomeEmail` template includes:
- Personalized greeting with member name
- Membership tier confirmation
- Next steps checklist
- Benefits overview
- Direct link to member dashboard

### 2. Email Service (`src/lib/emailService.ts`)

New method: `sendWelcomeEmail(email, name, tier)`

### 3. Send Email Edge Function

Deploy this function to handle email sending via SendGrid:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from } = await req.json();
    const sendgridKey = Deno.env.get('SENDGRID_API_KEY');

    if (!sendgridKey) throw new Error('SendGrid API key not configured');
    if (!to || !subject || !html) throw new Error('Missing required fields');

    const recipients = Array.isArray(to) 
      ? to.map(email => ({ email }))
      : [{ email: to }];

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: recipients }],
        from: { email: from || 'noreply@nareis.org', name: 'NAREIS' },
        subject,
        content: [{ type: 'text/html', value: html }]
      })
    });

    if (!response.ok) throw new Error(`SendGrid error: ${response.status}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
```

## Stripe Webhook with Welcome Email

Update the stripe-webhook function to send welcome emails:

```typescript
// Add to checkout.session.completed handler
if (autoApprove && sendWelcomeEmailEnabled) {
  // Get customer details
  const customers = await supabaseRequest(
    `customers?email=eq.${encodeURIComponent(email)}&select=first_name,last_name,membership_tier`,
    'GET'
  );
  
  if (customers?.[0]) {
    const customer = customers[0];
    const name = `${customer.first_name} ${customer.last_name}`;
    
    // Send welcome email via edge function
    await fetch(`${supabaseUrl}/functions/v1/send-welcome-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        email,
        name,
        tier: customer.membership_tier || 'Foundation'
      })
    });
  }
}
```

## Admin Settings

In Admin Panel → Settings:
- **Auto-Approve After Payment**: Enable automatic approval
- **Send Welcome Email**: Enable welcome emails on approval

## Flow

1. User completes Stripe payment
2. Webhook receives `checkout.session.completed`
3. Check admin_settings for auto_approval
4. If enabled: Set approval_status = 'approved'
5. Check admin_settings for send_welcome_email
6. If enabled: Send welcome email via SendGrid
7. User receives email with dashboard link

## Testing

1. Enable both auto-approval and welcome email in Admin Settings
2. Create test user and complete payment
3. Check email inbox for welcome message
4. Verify user can access member dashboard
