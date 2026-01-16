# Stripe Payment Integration Guide

## Overview
This application includes comprehensive Stripe payment processing for membership subscriptions with support for:
- Recurring annual subscriptions
- One-time payments
- Payment history tracking
- Automated invoice generation
- Subscription management (upgrade/downgrade/cancel)
- Webhook handling for payment events

## Components Created

### 1. SubscriptionManagement Component
**Location:** `src/components/stripe/SubscriptionManagement.tsx`

Features:
- View current subscription status and tier
- See renewal dates
- Upgrade to higher tiers
- Cancel subscriptions
- Real-time status updates

### 2. PaymentHistory Component
**Location:** `src/components/stripe/PaymentHistory.tsx`

Features:
- Display all payment transactions
- Download invoices
- Filter by date range
- Export payment history

### 3. StripeCheckout Component
**Location:** `src/components/stripe/StripeCheckout.tsx`

Features:
- Process membership payments
- Handle one-time and recurring payments
- Redirect to Stripe checkout
- Success/failure handling

## Edge Functions Required

### 1. manage-subscription
Handles subscription upgrades, downgrades, and cancellations.

**Deploy with:**
```bash
supabase functions deploy manage-subscription
```

### 2. stripe-webhook
Processes Stripe webhook events for payment confirmations and subscription updates.

**Deploy with:**
```bash
supabase functions deploy stripe-webhook
```

**Webhook URL:** `https://[YOUR-PROJECT].supabase.co/functions/v1/stripe-webhook`

Configure this URL in your Stripe Dashboard under Developers > Webhooks.

## Database Schema

Required tables and columns:

```sql
-- Add to members table
ALTER TABLE members ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE members ADD COLUMN subscription_status TEXT DEFAULT 'inactive';
ALTER TABLE members ADD COLUMN renewal_date TIMESTAMP;

-- Create payment_history table
CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id),
  subscription_id TEXT,
  amount DECIMAL(10,2),
  status TEXT,
  invoice_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Stripe Configuration

### 1. Create Products and Prices
In your Stripe Dashboard, create three products:
- **Basic Membership** - $99/year (price_basic_yearly)
- **Professional Membership** - $299/year (price_pro_yearly)
- **Premium Membership** - $599/year (price_premium_yearly)

### 2. Configure Webhooks
Add these events to your webhook:
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.deleted`
- `customer.subscription.updated`

### 3. Environment Variables
Ensure these are set in Supabase:
- `VITE_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_SECRET_KEY` - Your Stripe secret key (for edge functions)

## Usage

### In Profile Page
The subscription management is integrated into the Profile page with two new tabs:
- **Subscription** - Manage membership tier and view status
- **Payments** - View payment history and download invoices

### User Flow
1. User signs up and selects membership tier
2. Redirected to Stripe checkout
3. After payment, webhook updates member status
4. User can view subscription in profile
5. User can upgrade/downgrade or cancel anytime

## Testing

### Test Mode
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Webhook Testing
Use Stripe CLI to forward webhooks locally:
```bash
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```

## Security Notes
- All Stripe API calls are made server-side via edge functions
- Never expose Stripe secret keys in frontend code
- Webhook signatures are verified to prevent tampering
- Row Level Security (RLS) protects payment data

## Next Steps
1. Deploy edge functions when Supabase service is active
2. Run database migrations to add required columns
3. Configure Stripe products and webhook endpoints
4. Test payment flow end-to-end
5. Monitor webhook events in Stripe Dashboard
