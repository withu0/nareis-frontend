# Featured Member Expiration Scheduler Setup

This guide explains how to set up the automated featured member expiration checking system.

## Overview

The system tracks featured member placements and:
1. Verifies payment of $300 fee for 30-day placement
2. Monitors active 30-day periods
3. Sends 5-day expiration reminders with renewal links
4. Automatically expires listings when the period ends

## Edge Function Code

Create a new edge function named `featured-member-expiration` with the following code:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const now = new Date();
    
    // Get all active featured memberships with completed payments
    const { data: memberships, error: fetchError } = await supabase
      .from('featured_memberships')
      .select('*')
      .eq('status', 'active')
      .eq('payment_status', 'completed');
    
    if (fetchError) {
      throw new Error(`Failed to fetch memberships: ${fetchError.message}`);
    }
    
    const results = {
      reminders_sent: 0,
      expired: 0,
      errors: [] as string[]
    };
    
    for (const membership of memberships || []) {
      const endDate = new Date(membership.end_date);
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Check if expired
      if (endDate < now) {
        // Mark as expired
        const { error: expireError } = await supabase
          .from('featured_memberships')
          .update({
            status: 'expired',
            auto_expired: true,
            updated_at: now.toISOString()
          })
          .eq('id', membership.id);
        
        if (expireError) {
          results.errors.push(`Failed to expire ${membership.company_name}`);
          continue;
        }
        
        // Send expiration email
        if (sendgridApiKey && membership.member_email) {
          await sendExpiredEmail(sendgridApiKey, membership);
        }
        
        results.expired++;
      }
      // Check if needs 5-day reminder
      else if (daysRemaining <= 5 && daysRemaining > 0) {
        const lastReminder = membership.reminder_sent_at ? new Date(membership.reminder_sent_at) : null;
        const daysSinceReminder = lastReminder 
          ? Math.ceil((now.getTime() - lastReminder.getTime()) / (1000 * 60 * 60 * 24))
          : Infinity;
        
        // Only send reminder if no reminder sent in last 3 days
        if (daysSinceReminder >= 3) {
          const renewalToken = crypto.randomUUID();
          
          // Update membership with reminder info
          const { error: updateError } = await supabase
            .from('featured_memberships')
            .update({
              reminder_sent_at: now.toISOString(),
              reminder_count: (membership.reminder_count || 0) + 1,
              renewal_token: renewalToken,
              updated_at: now.toISOString()
            })
            .eq('id', membership.id);
          
          if (updateError) {
            results.errors.push(`Failed to update reminder for ${membership.company_name}`);
            continue;
          }
          
          // Send reminder email
          if (sendgridApiKey && membership.member_email) {
            const renewalLink = `https://nareis.org/renew-featured?token=${renewalToken}&id=${membership.id}`;
            await sendReminderEmail(sendgridApiKey, membership, daysRemaining, endDate, renewalLink);
            results.reminders_sent++;
          }
        }
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      results,
      timestamp: now.toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function sendReminderEmail(apiKey: string, membership: any, daysRemaining: number, endDate: Date, renewalLink: string) {
  const expirationDateStr = endDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const html = `<!DOCTYPE html><html><body style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px">
    <div style="background:linear-gradient(135deg,#f59e0b,#d97706);color:white;padding:30px;text-align:center;border-radius:8px 8px 0 0">
      <h1>Featured Membership Expiring Soon</h1>
    </div>
    <div style="padding:30px;background:#f9fafb">
      <p>Dear ${membership.member_name || 'Member'},</p>
      <div style="background:#fef3c7;border:2px solid #f59e0b;padding:20px;border-radius:8px;margin:20px 0;text-align:center">
        <h3 style="color:#d97706;margin:0 0 10px 0">Your Featured Membership Expires in ${daysRemaining} Days!</h3>
        <p style="margin:0">Expiration Date: <strong>${expirationDateStr}</strong></p>
      </div>
      <p>Your featured placement for <strong>${membership.company_name}</strong> on NAREIS.org is about to expire.</p>
      <div style="background:#dcfce7;border:2px solid #22c55e;padding:15px;border-radius:8px;text-align:center;margin:20px 0">
        <p style="margin:0;font-size:18px;font-weight:bold">Renew for only $300</p>
        <p style="margin:5px 0 0 0;font-size:14px">Another 30 days of premium visibility</p>
      </div>
      <div style="text-align:center">
        <a href="${renewalLink}" style="display:inline-block;padding:16px 32px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;font-weight:bold">Renew Now - $300</a>
      </div>
      <p>Best regards,<br>The NAREIS Team</p>
    </div>
  </body></html>`;
  
  await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: membership.member_email }] }],
      from: { email: 'noreply@nareis.org', name: 'NAREIS' },
      subject: `Action Required: Your Featured Membership Expires in ${daysRemaining} Days`,
      content: [{ type: 'text/html', value: html }]
    })
  });
}

async function sendExpiredEmail(apiKey: string, membership: any) {
  const html = `<!DOCTYPE html><html><body style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px">
    <div style="background:#6b7280;color:white;padding:30px;text-align:center;border-radius:8px 8px 0 0">
      <h1>Featured Membership Expired</h1>
    </div>
    <div style="padding:30px;background:#f9fafb">
      <p>Dear ${membership.member_name || 'Member'},</p>
      <p>Your featured membership placement for <strong>${membership.company_name}</strong> has expired and your listing has been removed from the featured section.</p>
      <div style="text-align:center">
        <a href="https://nareis.org/?featured=true" style="display:inline-block;padding:16px 32px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;font-weight:bold">Get Featured Again - $300</a>
      </div>
      <p>Best regards,<br>The NAREIS Team</p>
    </div>
  </body></html>`;
  
  await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: membership.member_email }] }],
      from: { email: 'noreply@nareis.org', name: 'NAREIS' },
      subject: 'Your NAREIS Featured Membership Has Expired',
      content: [{ type: 'text/html', value: html }]
    })
  });
}
```

## Database Migration

Run this migration to add the required tracking columns:

```sql
-- Add columns for tracking renewal reminders and auto-expiration
ALTER TABLE featured_memberships 
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS auto_expired BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS renewal_token TEXT,
ADD COLUMN IF NOT EXISTS member_email TEXT,
ADD COLUMN IF NOT EXISTS member_name TEXT;

-- Create indexes for efficient expiration queries
CREATE INDEX IF NOT EXISTS idx_featured_memberships_reminder ON featured_memberships(reminder_sent_at);
CREATE INDEX IF NOT EXISTS idx_featured_memberships_auto_expired ON featured_memberships(auto_expired);
```

## Setting Up Automated Scheduling

### Option 1: Supabase pg_cron (Recommended)

Enable pg_cron extension and create a scheduled job:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the expiration check to run daily at 9 AM UTC
SELECT cron.schedule(
  'featured-member-expiration-check',
  '0 9 * * *',  -- Daily at 9:00 AM UTC
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/featured-member-expiration',
    headers := '{"Authorization": "Bearer your-anon-key"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
```

### Option 2: External Cron Service

Use a service like:
- **Cron-job.org** (free)
- **EasyCron**
- **AWS EventBridge**
- **GitHub Actions scheduled workflow**

Configure it to call:
```
POST https://your-project.supabase.co/functions/v1/featured-member-expiration
Headers: Authorization: Bearer your-anon-key
```

### Option 3: Manual Trigger

Admins can manually trigger the check from the Featured Member Tracking page by clicking the "Run Expiration Check" button.

## Admin Dashboard Features

The Featured Member Tracking page (`/admin/featured-member-tracking`) provides:

1. **Overview Stats**
   - Total revenue from featured placements
   - Active placements count
   - Expiring soon (within 5 days)
   - Pending approvals

2. **Payment Verification**
   - Confirms $300 fee has been paid
   - Shows payment status for each listing
   - Tracks total revenue collected

3. **Expiration Tracking**
   - Start and end dates for each placement
   - Days remaining with visual progress bar
   - Color-coded status indicators:
     - Green: Healthy (>10 days)
     - Yellow: Warning (5-10 days)
     - Red: Critical (<5 days)
     - Gray: Expired

4. **Reminder Management**
   - Send manual renewal reminders
   - Track reminder history
   - View last reminder date

5. **Actions**
   - Approve/reject pending applications
   - Extend memberships manually
   - View detailed membership information
   - Run expiration check on demand

## Renewal Flow

1. Member receives 5-day reminder email
2. Email contains unique renewal link with token
3. Member clicks link → redirected to renewal page
4. Member completes $300 payment via Stripe
5. System extends end_date by 30 days
6. Confirmation email sent to member

## Testing

1. Create a test featured membership with end_date set to 3 days from now
2. Run the expiration check manually
3. Verify reminder email is sent
4. Check that reminder_sent_at and reminder_count are updated
5. Set end_date to yesterday and run check again
6. Verify status changes to 'expired' and expiration email is sent
