# Stripe Webhook Edge Function Setup

The Supabase project is temporarily unavailable for automated deployment. Follow these steps to manually deploy the webhook.

## Step 1: Add Stripe Columns to Customers Table

Run this SQL in Supabase SQL Editor:

```sql
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_customers_stripe_customer_id ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_subscription_id ON customers(stripe_subscription_id);
```

## Step 2: Deploy the stripe-webhook Edge Function

1. Go to Supabase Dashboard → Edge Functions
2. Click "Create a new function"
3. Name it: `stripe-webhook`
4. Copy the code from `STRIPE_WEBHOOK_FUNCTION_CODE.md` and paste it

## Step 3: Configure Stripe Webhook in Stripe Dashboard

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://puvvhscxffpmemufkxaq.supabase.co/functions/v1/stripe-webhook`
4. Select event: `checkout.session.completed`
5. Copy the "Signing secret" and add to Supabase secrets as `STRIPE_WEBHOOK_SECRET`

## What the Webhook Does

After successful Stripe checkout, it:
1. Listens for `checkout.session.completed` events
2. Updates customer record with `stripe_customer_id` and `stripe_subscription_id`
3. Sets `subscription_status` to 'active'
4. Sets `membership_tier` based on the plan purchased


1. Complete a test checkout using card: `4242 4242 4242 4242`
2. Check Supabase logs for webhook events
3. Verify customer record is updated with `stripe_customer_id` and `subscription_status = 'active'`
