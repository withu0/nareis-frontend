# Create Checkout Session Edge Function

Deploy this edge function manually via Supabase Dashboard.

## Steps to Deploy

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click **New Function**
3. Name it: `create-checkout-session`
4. Paste the code below and deploy

## Edge Function Code

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
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }

    const { priceId, planName, amount, isRecurring, userId, successUrl, cancelUrl } = await req.json();

    const sessionParams = new URLSearchParams();
    sessionParams.append('mode', isRecurring ? 'subscription' : 'payment');
    sessionParams.append('success_url', successUrl || 'https://nareis.org/dashboard?payment=success');
    sessionParams.append('cancel_url', cancelUrl || 'https://nareis.org/onboarding?payment=cancelled');
    sessionParams.append('line_items[0][price_data][currency]', 'usd');
    sessionParams.append('line_items[0][price_data][product_data][name]', planName || 'NAREIS Membership');
    sessionParams.append('line_items[0][price_data][unit_amount]', ((amount || 495) * 100).toString());
    if (isRecurring) {
      sessionParams.append('line_items[0][price_data][recurring][interval]', 'year');
    }
    sessionParams.append('line_items[0][quantity]', '1');
    sessionParams.append('metadata[priceId]', priceId || '');
    sessionParams.append('metadata[userId]', userId || '');
    sessionParams.append('metadata[planName]', planName || '');

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: sessionParams.toString(),
    });

    const session = await response.json();

    if (session.error) {
      throw new Error(session.error.message);
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
    );
  }
});
```

## Verify STRIPE_SECRET_KEY

Ensure `STRIPE_SECRET_KEY` is set in Edge Function secrets.

## Parameters from Frontend

The PaymentStep sends:
- `priceId`: Price identifier (e.g., 'price_foundation_yearly')
- `planName`: Display name (e.g., 'Foundation Member')
- `amount`: Price in dollars (e.g., 495)
- `isRecurring`: Boolean for subscription vs one-time
- `userId`: User's Supabase auth ID
- `successUrl`: Redirect after success
- `cancelUrl`: Redirect on cancel
