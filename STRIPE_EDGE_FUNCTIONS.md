# Stripe Edge Functions - Complete Guide

## Overview

Two edge functions handle the Stripe payment flow:
1. **create-checkout-session** - Creates Stripe checkout sessions
2. **stripe-webhook** - Processes payment confirmations

## 1. Create Checkout Session

### Deploy via Supabase Dashboard

1. Go to **Edge Functions** → **New Function**
2. Name: `create-checkout-session`
3. Paste code and deploy

### Function Code

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
    if (!stripeSecretKey) throw new Error('STRIPE_SECRET_KEY not configured');

    const { priceId, planName, amount, isRecurring, userId, successUrl, cancelUrl } = await req.json();

    const params = new URLSearchParams();
    params.append('mode', isRecurring ? 'subscription' : 'payment');
    params.append('success_url', successUrl || 'https://nareis.org/dashboard?payment=success');
    params.append('cancel_url', cancelUrl || 'https://nareis.org/onboarding?payment=cancelled');
    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][product_data][name]', planName || 'NAREIS Membership');
    params.append('line_items[0][price_data][unit_amount]', ((amount || 495) * 100).toString());
    if (isRecurring) params.append('line_items[0][price_data][recurring][interval]', 'year');
    params.append('line_items[0][quantity]', '1');
    params.append('metadata[priceId]', priceId || '');
    params.append('metadata[userId]', userId || '');
    params.append('metadata[planName]', planName || '');

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await response.json();
    if (session.error) throw new Error(session.error.message);

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

### Required Secrets

- `STRIPE_SECRET_KEY` - Your Stripe secret key (sk_test_... or sk_live_...)

## 2. Stripe Webhook

See `STRIPE_WEBHOOK_FUNCTION_CODE.md` for complete webhook code.

### Required Secrets

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Testing

1. Navigate to `/stripe-test` (admin only)
2. Click "Test" on any membership tier
3. Verify checkout URL is generated
4. Click "Open Checkout" to test payment flow
5. Use test card: `4242 4242 4242 4242`

## Membership Tiers

| Tier | Price | Price ID | Recurring |
|------|-------|----------|-----------|
| Foundation | $495 | price_foundation_yearly | Yes |
| Growth | $995 | price_growth_yearly | Yes |
| Stakeholder | $1,495 | price_stakeholder_yearly | Yes |
| Professional | $1,995 | price_professional_yearly | Yes |
| Enterprise | $3,995 | price_enterprise_yearly | Yes |
| Founding | $5,995 | price_founding_lifetime | No |
