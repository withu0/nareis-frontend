# Stripe Webhook Edge Function Code

Copy this code when creating the `stripe-webhook` edge function in Supabase Dashboard:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature'
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const priceToTier: Record<string, string> = {
  'price_foundation_yearly': 'foundation',
  'price_growth_yearly': 'growth',
  'price_stakeholder_yearly': 'stakeholder',
  'price_professional_yearly': 'professional',
  'price_enterprise_yearly': 'enterprise',
  'price_founding_lifetime': 'founding'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    console.error('Missing signature or webhook secret');
    return new Response(JSON.stringify({ error: 'Missing signature' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    console.log('Received Stripe event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const userId = session.metadata?.userId;
      const customerEmail = session.customer_email || session.customer_details?.email;
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;
      let membershipTier = session.metadata?.membershipTier || 'foundation';

      if (stripeSubscriptionId) {
        try {
          const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          const priceId = sub.items.data[0]?.price.id;
          if (priceId && priceToTier[priceId]) membershipTier = priceToTier[priceId];
        } catch (e) { console.log('Could not retrieve subscription'); }
      }

      const updateData = {
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        subscription_status: 'active',
        membership_tier: membershipTier,
        membership_status: 'active',
        updated_at: new Date().toISOString()
      };

      let result;
      if (userId) {
        result = await supabase.from('customers').update(updateData).eq('auth_id', userId);
      } else if (customerEmail) {
        result = await supabase.from('customers').update(updateData).eq('email', customerEmail);
      }

      if (result?.error) console.error('DB error:', result.error);
      else console.log('Customer updated successfully');
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```
