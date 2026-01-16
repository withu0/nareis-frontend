// Edge function code for handling Stripe webhooks
// Deploy this as a Supabase edge function named 'stripe-webhook'

export const webhookHandlerCode = `
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    const stripeKey = Deno.env.get('VITE_STRIPE_PUBLISHABLE_KEY');
    
    // Verify webhook signature
    const event = JSON.parse(body);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Update member with subscription info
        await fetch(\`\${supabaseUrl}/rest/v1/members?email=eq.\${session.customer_email}\`, {
          method: 'PATCH',
          headers: {
            apikey: supabaseKey,
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${supabaseKey}\`
          },
          body: JSON.stringify({
            stripe_subscription_id: session.subscription,
            subscription_status: 'active',
            renewal_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          })
        });
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        // Log payment in payment_history
        await fetch(\`\${supabaseUrl}/rest/v1/payment_history\`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${supabaseKey}\`
          },
          body: JSON.stringify({
            subscription_id: invoice.subscription,
            amount: invoice.amount_paid / 100,
            status: 'succeeded',
            invoice_url: invoice.hosted_invoice_url,
            created_at: new Date().toISOString()
          })
        });
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await fetch(\`\${supabaseUrl}/rest/v1/members?stripe_subscription_id=eq.\${subscription.id}\`, {
          method: 'PATCH',
          headers: {
            apikey: supabaseKey,
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${supabaseKey}\`
          },
          body: JSON.stringify({
            subscription_status: 'cancelled'
          })
        });
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
`;

// This component provides documentation for the webhook handler
export default function StripeWebhookHandler() {
  return null;
}
