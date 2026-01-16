# Featured Member Renewal System Setup

This document explains how to set up the featured member renewal payment system, which allows members to renew their $300 featured placement for another 30 days.

## Overview

The renewal system consists of:
1. **Renewal Page** (`/renew-featured`) - Public page where members can pay for renewal
2. **Stripe Checkout Edge Function** - Handles payment processing
3. **Webhook Handler** - Processes successful payments and extends memberships
4. **Email Notifications** - Sends reminders and confirmations

## Database Setup

Run the following SQL to add required columns:

```sql
-- Add stripe_checkout_session_id column for tracking renewal checkout sessions
ALTER TABLE featured_memberships 
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT;

-- Create index for efficient lookup
CREATE INDEX IF NOT EXISTS idx_featured_memberships_checkout_session 
ON featured_memberships(stripe_checkout_session_id);

-- Ensure renewal_token column exists (from previous migration)
ALTER TABLE featured_memberships 
ADD COLUMN IF NOT EXISTS renewal_token TEXT;
```

## Edge Function: featured-renewal-checkout

Create this edge function to handle Stripe checkout session creation:

```typescript
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const { 
      membershipId, 
      companyName, 
      memberEmail, 
      memberName,
      renewalToken,
      successUrl, 
      cancelUrl 
    } = await req.json();

    if (!membershipId || !successUrl || !cancelUrl) {
      throw new Error("Missing required parameters");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the membership exists
    const { data: membership, error: fetchError } = await supabase
      .from('featured_memberships')
      .select('*')
      .eq('id', membershipId)
      .single();

    if (fetchError || !membership) {
      throw new Error("Membership not found");
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Featured Member Renewal',
              description: `30-day featured placement renewal for ${companyName || 'your company'}`,
              metadata: {
                membership_id: membershipId,
                type: 'featured_renewal'
              }
            },
            unit_amount: 30000, // $300.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: memberEmail || undefined,
      metadata: {
        membership_id: membershipId,
        company_name: companyName || '',
        member_name: memberName || '',
        renewal_token: renewalToken || '',
        type: 'featured_renewal'
      },
      payment_intent_data: {
        metadata: {
          membership_id: membershipId,
          type: 'featured_renewal'
        }
      }
    });

    // Update membership with pending payment info
    await supabase
      .from('featured_memberships')
      .update({
        stripe_checkout_session_id: session.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', membershipId);

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create checkout session' 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
```

## Webhook Handler: featured-renewal-webhook

Add this handler to your existing Stripe webhook or create a new one:

```typescript
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    const stripe = new Stripe(stripeSecretKey!, {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(JSON.stringify({ error: "Invalid signature" }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Check if this is a featured renewal
      if (session.metadata?.type === 'featured_renewal') {
        const membershipId = session.metadata.membership_id;
        
        // Get current membership
        const { data: membership, error: fetchError } = await supabase
          .from('featured_memberships')
          .select('*')
          .eq('id', membershipId)
          .single();

        if (fetchError || !membership) {
          console.error("Membership not found:", membershipId);
          return new Response(JSON.stringify({ error: "Membership not found" }), { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Calculate new end date (add 30 days from current end date or now)
        const currentEnd = membership.end_date 
          ? new Date(membership.end_date) 
          : new Date();
        const now = new Date();
        
        // If already expired, start from now; otherwise extend from current end
        const startFrom = currentEnd < now ? now : currentEnd;
        const newEndDate = new Date(startFrom);
        newEndDate.setDate(newEndDate.getDate() + 30);

        // Update membership
        const { error: updateError } = await supabase
          .from('featured_memberships')
          .update({
            status: 'active',
            payment_status: 'completed',
            end_date: newEndDate.toISOString(),
            stripe_payment_intent_id: session.payment_intent,
            renewal_token: null, // Clear the token after use
            reminder_sent_at: null, // Reset reminder
            reminder_count: 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', membershipId);

        if (updateError) {
          console.error("Failed to update membership:", updateError);
          return new Response(JSON.stringify({ error: "Failed to update membership" }), { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // TODO: Send confirmation email
        console.log(`Featured membership ${membershipId} renewed until ${newEndDate.toISOString()}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

## Stripe Dashboard Setup

1. **Create Webhook Endpoint**:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-project.supabase.co/functions/v1/featured-renewal-webhook`
   - Select events: `checkout.session.completed`
   - Copy the webhook signing secret to your Supabase secrets

2. **Environment Variables Required**:
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
   - `SUPABASE_URL` - Auto-provided
   - `SUPABASE_SERVICE_ROLE_KEY` - Auto-provided

## How the Renewal Flow Works

1. **Admin sends renewal reminder** (5 days before expiration):
   - System generates a unique `renewal_token`
   - Email is sent with link: `/renew-featured?token=xxx&id=membership_id`

2. **Member clicks renewal link**:
   - Page validates the token and membership ID
   - Displays current placement details and expiration status
   - Shows $300 payment button

3. **Member clicks "Pay & Renew Now"**:
   - Frontend calls `featured-renewal-checkout` edge function
   - Function creates Stripe Checkout session
   - Member is redirected to Stripe payment page

4. **Payment completed**:
   - Stripe sends webhook to `featured-renewal-webhook`
   - Webhook extends membership by 30 days
   - Member is redirected to success page
   - Confirmation email is sent

5. **Membership extended**:
   - `end_date` extended by 30 days
   - `status` set to 'active'
   - `payment_status` set to 'completed'
   - `renewal_token` cleared
   - `reminder_count` reset

## Testing

1. Use Stripe test mode with test card: `4242 4242 4242 4242`
2. Create a test featured membership in the database
3. Generate a renewal token manually or via admin panel
4. Visit `/renew-featured?token=your-token&id=membership-id`
5. Complete the test payment
6. Verify the membership was extended

## Email Templates

The system uses these email templates (in `src/lib/emailTemplates.ts`):
- `featuredMemberRenewalReminder` - Sent 5 days before expiration
- `featuredMemberRenewalConfirmation` - Sent after successful renewal
- `featuredMemberExpired` - Sent when placement expires without renewal

## Troubleshooting

**Payment not processing:**
- Check Stripe Dashboard for failed payments
- Verify webhook is receiving events
- Check edge function logs

**Membership not extending:**
- Verify webhook signature is correct
- Check that `type: 'featured_renewal'` is in metadata
- Review Supabase function logs

**Invalid renewal link:**
- Token may have been used already
- Token may have been regenerated
- Membership ID may be incorrect
