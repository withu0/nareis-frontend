# Stripe Integration Setup Guide

## Current Status
Your Supabase project appears to be **paused/inactive**. Once reactivated, I can deploy the Stripe edge functions.

## Required Edge Functions

### 1. create-checkout-session
Creates Stripe checkout sessions for membership payments.

### 2. stripe-webhook  
Handles Stripe webhook events (payment success, subscription updates).

### 3. manage-subscription
Handles subscription upgrades, downgrades, and cancellations.

## Setup Steps

### Step 1: Reactivate Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. If paused, click "Restore project"
4. Wait for project to become active

### Step 2: Add Stripe Columns to Customers Table
Run this SQL in Supabase SQL Editor:
```sql
ALTER TABLE customers ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_customers_stripe_customer_id ON customers(stripe_customer_id);
```

### Step 3: Deploy Edge Functions
Once Supabase is active, ask me to "deploy the Stripe edge functions" and I'll create them.

### Step 4: Configure Stripe Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://puvvhscxffpmemufkxaq.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret
5. Add to Supabase secrets as `STRIPE_WEBHOOK_SECRET`

### Step 5: Test Payment Flow
1. Sign up for new account
2. Complete onboarding steps 1-5
3. On payment step, use test card: `4242 4242 4242 4242`
4. Verify redirect to success page
5. Check customer record updated with Stripe IDs

## Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Auth: `4000 0025 0000 3155`

## Environment Variables Required
- `STRIPE_SECRET_KEY` ✅ (already set)
- `STRIPE_WEBHOOK_SECRET` ✅ (already set)
- `VITE_STRIPE_PUBLISHABLE_KEY` ✅ (already set)
