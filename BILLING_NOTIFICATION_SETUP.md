# Billing Notification System Setup

## Overview
This document describes the automated email notification system for billing events using SendGrid.

## Edge Function: billing-notifications

### Purpose
Sends automated emails to advertisers for various billing events.

### Supported Event Types

1. **payment_success** - Payment successfully processed
2. **payment_failed** - Payment failed
3. **invoice_generated** - New invoice created
4. **subscription_renewal** - Subscription about to renew
5. **payment_method_expiring** - Payment method expiring soon

### Usage Example

```javascript
const { data, error } = await supabase.functions.invoke('billing-notifications', {
  body: {
    eventType: 'payment_success',
    advertiserEmail: 'advertiser@example.com',
    advertiserName: 'John Doe',
    data: {
      invoiceNumber: 'INV-001',
      amount: '299.00',
      paymentDate: '2025-01-15',
      paymentMethod: 'Visa ending in 4242',
      invoiceUrl: 'https://example.com/invoices/001'
    }
  }
});
```

### Event Data Requirements

#### payment_success
- invoiceNumber
- amount
- paymentDate
- paymentMethod
- invoiceUrl

#### payment_failed
- amount
- failureReason
- updatePaymentUrl

#### invoice_generated
- invoiceNumber
- amount
- dueDate
- invoiceUrl
- paymentUrl

#### subscription_renewal
- renewalDate
- amount
- paymentMethod
- manageSubscriptionUrl

#### payment_method_expiring
- last4
- expiryDate
- updatePaymentUrl

## Notification Preferences

Advertisers can manage their notification preferences in their profile:
- Navigate to Profile > Notifications tab
- Toggle each notification type on/off
- Preferences are stored in user metadata

## Integration Points

### Stripe Webhooks
Integrate with Stripe webhook handler to trigger notifications:

```javascript
// In stripe webhook handler
if (event.type === 'payment_intent.succeeded') {
  await supabase.functions.invoke('billing-notifications', {
    body: {
      eventType: 'payment_success',
      advertiserEmail: customer.email,
      advertiserName: customer.name,
      data: { /* payment data */ }
    }
  });
}
```

### Scheduled Tasks
Set up cron jobs for:
- Payment method expiration checks (monthly)
- Subscription renewal reminders (7 days before)

## Testing

Test the notification system:
```javascript
await supabase.functions.invoke('billing-notifications', {
  body: {
    eventType: 'payment_success',
    advertiserEmail: 'test@example.com',
    advertiserName: 'Test User',
    data: {
      invoiceNumber: 'TEST-001',
      amount: '99.00',
      paymentDate: new Date().toLocaleDateString(),
      paymentMethod: 'Test Card',
      invoiceUrl: 'https://example.com/test'
    }
  }
});
```

## Environment Variables
- SENDGRID_API_KEY: Already configured in Supabase

## Future Enhancements
- Add SMS notifications
- Support for multiple languages
- Custom email templates per advertiser
- Notification delivery tracking
