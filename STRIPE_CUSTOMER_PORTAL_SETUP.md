# Stripe Customer Portal Integration

## Overview
The Stripe Customer Portal allows users to manage their subscriptions directly through Stripe's secure hosted interface. This integration provides a seamless billing experience for NAREIS members.

## Features Available in Portal
- **Update Payment Methods** - Add, remove, or change credit/debit cards
- **View & Download Invoices** - Access complete payment history with PDF downloads
- **Modify Subscription** - Upgrade, downgrade, or cancel membership plans
- **Update Billing Information** - Change billing address and contact details

## Frontend Components

### 1. BillingPortalButton (`src/components/stripe/BillingPortalButton.tsx`)
A reusable button component that opens the Stripe Customer Portal.

```tsx
import BillingPortalButton from '@/components/stripe/BillingPortalButton';

<BillingPortalButton 
  stripeCustomerId={customerId}
  variant="default"
  className="w-full"
/>
```

### 2. BillingPortalCard (`src/components/stripe/BillingPortalCard.tsx`)
A dashboard card with billing features overview and portal access.

### 3. Billing Page (`src/pages/Billing.tsx`)
Dedicated billing management page at `/billing` with:
- Stripe portal access
- Current subscription status
- Payment history
- Quick action buttons

### 4. SubscriptionManagement (`src/components/stripe/SubscriptionManagement.tsx`)
Full subscription management with upgrade/downgrade options.

## Access Points
Users can access billing management from:
1. **Dashboard** - Quick Access "Billing" link
2. **Profile** - Subscription tab
3. **Direct URL** - `/billing`

## Edge Function: create-portal-session

Deploy this function via Supabase Dashboard > Edge Functions:

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
    if (!stripeSecretKey) throw new Error('Stripe secret key not configured');

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { customerId, returnUrl } = await req.json();
    if (!customerId) throw new Error('Customer ID is required');
    if (!returnUrl) throw new Error('Return URL is required');

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return new Response(
      JSON.stringify({ success: true, url: session.url }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
    );
  }
});
```

## Configure Stripe Portal

1. Go to **Stripe Dashboard** > **Settings** > **Billing** > **Customer Portal**
2. Enable the following features:
   - Update payment methods
   - View invoice history
   - Cancel subscriptions
   - Update subscriptions (if offering plan changes)
3. Configure branding (logo, colors)
4. Set default return URL: `https://yourdomain.com/billing`

## Database Requirements

Ensure `stripe_customer_id` column exists in customers table:

```sql
ALTER TABLE customers ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
```

## Environment Variables

Set in Supabase Edge Function secrets:
- `STRIPE_SECRET_KEY` - Your Stripe secret key (sk_live_... or sk_test_...)

## Testing

1. Create a test customer in Stripe
2. Link the customer ID to a user in the `customers` table
3. Navigate to `/billing` and click "Open Stripe Billing Portal"
4. Verify redirect to Stripe's hosted portal
5. Test payment method updates and invoice viewing

## Security Notes
- Portal sessions are short-lived (typically 5 minutes)
- Customer ID is validated server-side
- All sensitive operations happen on Stripe's secure infrastructure
