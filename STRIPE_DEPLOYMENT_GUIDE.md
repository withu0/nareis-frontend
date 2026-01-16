# Stripe Edge Functions Deployment Guide

## Prerequisites
- Supabase project must be ACTIVE
- Stripe account with Secret Key configured in Supabase
- STRIPE_WEBHOOK_SECRET environment variable set

## Step 1: Deploy Edge Functions

Once Supabase is active, deploy these functions:

### stripe-webhook Function
```typescript
// Handles: checkout.session.completed, subscription updates, invoice events
// Purpose: Sync payment status with database, track payment history
```

### manage-subscription Function
```typescript
// Handles: upgrade, downgrade, cancel, reactivate
// Purpose: Manage subscription lifecycle
```

## Step 2: Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter webhook URL:
   ```
   https://[YOUR-PROJECT-ID].supabase.co/functions/v1/stripe-webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Copy the webhook signing secret
6. Add to Supabase secrets:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Step 3: Test Payment Flow

### Test Checkout
1. Sign up for membership
2. Use test card: 4242 4242 4242 4242
3. Verify member record updated with stripe_customer_id
4. Check payment_history table for record

### Test Subscription Upgrade
1. Go to Profile → Subscription Management
2. Click "Upgrade Plan"
3. Verify prorated charge created
4. Check membership_tier updated

### Test Subscription Downgrade
1. Click "Downgrade Plan"
2. Verify change scheduled for next billing period
3. Check subscription status

### Test Cancellation
1. Click "Cancel Subscription"
2. Verify cancel_at_period_end = true
3. Check subscription_status = 'canceling'

### Test Reactivation
1. Click "Reactivate Subscription"
2. Verify cancel_at_period_end = false
3. Check subscription_status = 'active'

## Step 4: Verify Invoice Generation

1. Trigger payment in Stripe Dashboard
2. Check invoice.payment_succeeded webhook received
3. Verify payment_history record created
4. Check invoice_url populated

## Monitoring

- View webhook logs in Stripe Dashboard
- Check Supabase edge function logs
- Monitor payment_history table for discrepancies

## Troubleshooting

**Webhook not receiving events:**
- Verify URL is correct
- Check CORS headers in function
- Ensure webhook secret is set

**Signature verification failing:**
- Confirm STRIPE_WEBHOOK_SECRET matches Stripe
- Check webhook endpoint is using raw body

**Database not updating:**
- Verify SUPABASE_SERVICE_ROLE_KEY is set
- Check RLS policies on members table
- Review edge function logs
