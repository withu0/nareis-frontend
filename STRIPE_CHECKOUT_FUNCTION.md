# Create Checkout Session Edge Function

## The Problem
The `create-checkout-session` edge function is **missing** from your Supabase project. This is why the payment step skips directly to the member benefits page.

## Solution: Deploy the Edge Function Manually

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project (puvvhscxffpmemufkxaq)
3. Go to **Edge Functions** in the left sidebar
4. Click **New Function**
5. Name it: `create-checkout-session`

### Step 2: Paste This Code

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Stripe not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { priceId, planName, amount, isRecurring, userId, successUrl, cancelUrl } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: isRecurring ? 'subscription' : 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId: userId || '', planName: planName || '' },
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: planName || 'NAREI Membership' },
          unit_amount: Math.round(amount * 100),
          ...(isRecurring ? { recurring: { interval: 'year' } } : {})
        },
        quantity: 1
      }]
    });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
```

### Step 3: Deploy and Test
1. Click **Deploy**
2. Go back to your app and try the signup flow again
3. The payment button should now redirect to Stripe Checkout

## Verify STRIPE_SECRET_KEY is Set
In Supabase Dashboard:
1. Go to **Project Settings** → **Edge Functions**
2. Check that `STRIPE_SECRET_KEY` is in the secrets list
3. If not, add it with your Stripe secret key (starts with `sk_test_` or `sk_live_`)
