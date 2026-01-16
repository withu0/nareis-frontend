# Signup Flow Setup Guide

## Complete Stripe Webhook with Auto-Approval & Welcome Email

Deploy this edge function to handle Stripe webhooks with auto-approval:

```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()
  
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, Deno.env.get('STRIPE_WEBHOOK_SECRET')!)
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const tier = session.metadata?.tier || 'foundation'
    
    // Check auto-approval setting
    const { data: settings } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'auto_approval')
      .single()
    
    const autoApprove = settings?.setting_value?.enabled ?? false
    const sendWelcome = settings?.setting_value?.send_welcome_email ?? true
    
    // Update customer
    const updateData: any = {
      subscription_status: 'active',
      stripe_customer_id: session.customer,
      membership_tier: tier
    }
    
    if (autoApprove) {
      updateData.approval_status = 'approved'
    }
    
    await supabase.from('customers').update(updateData).eq('id', userId)
    
    // Send welcome email if auto-approved
    if (autoApprove && sendWelcome) {
      const { data: customer } = await supabase
        .from('customers')
        .select('email, full_name')
        .eq('id', userId)
        .single()
      
      if (customer) {
        await supabase.functions.invoke('send-email', {
          body: {
            to: customer.email,
            subject: 'Welcome to NAREIS - Your Membership is Active!',
            template: 'welcome',
            data: { name: customer.full_name, tier }
          }
        })
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
```

## Test the Flow

1. Navigate to `/signup-flow-test` (admin only)
2. Follow the step-by-step verification
3. Use test card: `4242 4242 4242 4242`

## Verify Database

```sql
SELECT * FROM customers WHERE email LIKE 'test%' ORDER BY created_at DESC;
SELECT * FROM admin_settings WHERE setting_key = 'auto_approval';
```
