# Stripe Checkout Flow Testing Guide

## Quick Test via Browser Console

Open browser DevTools and run this test to verify the edge function:

```javascript
// Test create-checkout-session edge function
const testCheckout = async () => {
  const response = await fetch('https://puvvhscxffpmemufkxaq.supabase.co/functions/v1/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_ANON_KEY'
    },
    body: JSON.stringify({
      priceId: 'price_foundation_yearly',
      planName: 'Foundation Member',
      amount: 495,
      isRecurring: true,
      userId: 'test-user-123',
      successUrl: window.location.origin + '/dashboard?payment=success',
      cancelUrl: window.location.origin + '/onboarding?payment=cancel'
    })
  });
  
  const data = await response.json();
  console.log('Response:', data);
  
  if (data.url) {
    console.log('✅ SUCCESS: Checkout URL generated');
    console.log('URL:', data.url);
  } else {
    console.log('❌ ERROR:', data.error);
  }
};

testCheckout();
```

## Test Page

Navigate to `/stripe-test` (admin only) to test all membership tiers.

## Expected Response

```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_..."
}
```

## Complete Flow Test

1. **Create Checkout Session**
   - Go to `/stripe-test`
   - Click "Test" on any tier
   - Verify green checkmark appears
   - Click "Open Checkout" to view Stripe page

2. **Complete Payment**
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry, any CVC
   - Complete payment

3. **Verify Webhook**
   - Check Supabase logs for webhook execution
   - Verify customer record updated with:
     - `stripe_customer_id`
     - `stripe_subscription_id`
     - `subscription_status = 'active'`
     - `membership_tier` matches plan

## Troubleshooting

| Error | Solution |
|-------|----------|
| "STRIPE_SECRET_KEY not configured" | Add secret in Supabase Edge Function settings |
| "Function not found" | Deploy edge function via Supabase Dashboard |
| CORS error | Verify corsHeaders in edge function |
| No URL returned | Check Stripe API response in logs |

## Test Cards

| Card | Result |
|------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0341 | Requires 3D Secure |
| 4000 0000 0000 9995 | Declined |
