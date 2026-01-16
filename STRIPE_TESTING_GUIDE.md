# Stripe Payment Flow Testing Guide

## Test Cards

Use these test cards in Stripe test mode:

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0341 | Requires authentication (3D Secure) |
| 4000 0000 0000 9995 | Payment declined |
| 4000 0025 0000 3155 | Requires authentication + declined |

Use any future expiry date, any 3-digit CVC, and any ZIP code.

## Test Scenarios

### 1. New Member Signup & Payment
1. Navigate to signup page
2. Fill in member details
3. Select membership tier (Basic/Professional/Premium)
4. Enter test card: 4242 4242 4242 4242
5. Complete payment

**Expected Results:**
- Redirected to success page
- Member record created in database
- `stripe_customer_id` populated
- `subscription_status` = 'active'
- `membership_tier` matches selection
- Payment history record created

### 2. Subscription Upgrade
1. Login as existing member
2. Go to Profile → Subscription Management
3. Click "Upgrade" on higher tier
4. Confirm upgrade

**Expected Results:**
- Prorated charge created in Stripe
- `membership_tier` updated immediately
- `subscription_status` remains 'active'
- Payment history shows prorated amount
- Webhook logs show `customer.subscription.updated`

### 3. Subscription Downgrade
1. Go to Subscription Management
2. Click "Downgrade" on lower tier
3. Confirm downgrade

**Expected Results:**
- No immediate charge
- Change scheduled for next billing period
- Alert shows "Changes take effect on [date]"
- Current tier remains until renewal
- Webhook shows scheduled change

### 4. Subscription Cancellation
1. Go to Subscription Management
2. Click "Cancel Subscription"
3. Confirm cancellation

**Expected Results:**
- `subscription_status` = 'canceling'
- `cancel_at_period_end` = true
- Access continues until renewal date
- Alert shows end date
- "Reactivate" button appears

### 5. Subscription Reactivation
1. After canceling, click "Reactivate Subscription"
2. Confirm reactivation

**Expected Results:**
- `subscription_status` = 'active'
- `cancel_at_period_end` = false
- Alert disappears
- Full access restored

### 6. Failed Payment
1. Use card: 4000 0000 0000 9995
2. Attempt payment

**Expected Results:**
- Payment fails
- Error message displayed
- No member record created
- Payment history shows 'failed' status
- Webhook logs `invoice.payment_failed`

### 7. Invoice Generation
1. Trigger payment (signup or renewal)
2. Check Stripe Dashboard → Invoices
3. Verify invoice created

**Expected Results:**
- Invoice generated in Stripe
- `invoice_url` saved to payment_history
- Invoice includes correct amount and items
- PDF downloadable from Stripe

### 8. Webhook Event Processing
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. View recent events

**Expected Results:**
- All events show 200 response
- No errors in logs
- Database updates match webhook events

## Verification Checklist

### Database Checks
- [ ] `members.stripe_customer_id` populated
- [ ] `members.subscription_id` populated
- [ ] `members.subscription_status` correct
- [ ] `members.membership_tier` matches payment
- [ ] `members.current_period_end` set correctly
- [ ] `payment_history` records created
- [ ] `payment_history.invoice_url` accessible

### Stripe Dashboard Checks
- [ ] Customer created
- [ ] Subscription active
- [ ] Invoices generated
- [ ] Webhook events successful (200 response)
- [ ] No errors in webhook logs

### User Experience Checks
- [ ] Success messages displayed
- [ ] Error messages clear and helpful
- [ ] Loading states shown during processing
- [ ] Redirects work correctly
- [ ] Email confirmations sent (if configured)

## Common Issues

**Webhook not receiving events:**
- Verify webhook URL is correct
- Check STRIPE_WEBHOOK_SECRET is set
- Ensure Supabase edge function is deployed

**Database not updating:**
- Check RLS policies allow service role access
- Verify SUPABASE_SERVICE_ROLE_KEY is set
- Review edge function logs for errors

**Payment failing:**
- Confirm STRIPE_SECRET_KEY is correct
- Check if using test mode keys in test environment
- Verify card details are valid test cards

**Signature verification failing:**
- Ensure using raw request body
- Confirm webhook secret matches Stripe
- Check CORS headers allow stripe-signature header
