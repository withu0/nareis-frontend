# Featured Membership Expiration Scheduler Setup

This document provides complete instructions for setting up the automated featured membership expiration scheduler that runs daily to:

1. **Check for expiring memberships** (within 5 days)
2. **Send renewal reminder emails** with unique tokens
3. **Auto-expire memberships** that have passed their end date
4. **Send expiration notification emails** to affected members

## Table of Contents

1. [Database Setup](#database-setup)
2. [Edge Function Code](#edge-function-code)
3. [Deployment Instructions](#deployment-instructions)
4. [Scheduler Configuration](#scheduler-configuration)
5. [Manual Testing](#manual-testing)
6. [Monitoring & Logs](#monitoring--logs)

---

## Database Setup

First, ensure the required columns exist in the `featured_memberships` table:

```sql
-- Run this migration if not already applied
ALTER TABLE featured_memberships 
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS auto_expired BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS renewal_token TEXT,
ADD COLUMN IF NOT EXISTS member_email TEXT,
ADD COLUMN IF NOT EXISTS member_name TEXT;

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_featured_memberships_reminder ON featured_memberships(reminder_sent_at);
CREATE INDEX IF NOT EXISTS idx_featured_memberships_auto_expired ON featured_memberships(auto_expired);
CREATE INDEX IF NOT EXISTS idx_featured_memberships_end_date ON featured_memberships(end_date);
CREATE INDEX IF NOT EXISTS idx_featured_memberships_status ON featured_memberships(status);
```

---

## Edge Function Code

Create a new edge function named `featured-expiration-scheduler`:

### File: `supabase/functions/featured-expiration-scheduler/index.ts`

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Generate unique renewal token
function generateRenewalToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Renewal reminder email template
function getRenewalReminderEmail(
  name: string, 
  companyName: string, 
  daysRemaining: number, 
  expirationDate: string, 
  renewalLink: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background: #f9fafb; }
          .warning-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .warning-box h3 { color: #d97706; margin: 0 0 10px 0; }
          .details-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .button { display: inline-block; padding: 16px 32px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; font-size: 16px; }
          .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .benefits li { margin: 10px 0; }
          .price-box { background: #dcfce7; border: 2px solid #22c55e; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; background: #f3f4f6; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Featured Membership Expiring Soon</h1>
          <p>Action Required</p>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          
          <div class="warning-box">
            <h3>Your Featured Membership Expires in ${daysRemaining} Day${daysRemaining !== 1 ? 's' : ''}!</h3>
            <p style="margin:0;font-size:14px">Expiration Date: <strong>${expirationDate}</strong></p>
          </div>
          
          <p>Your featured placement for <strong>${companyName}</strong> on NAREIS.org is about to expire. Don't lose your premium visibility!</p>
          
          <div class="details-box">
            <h4 style="margin-top:0">Current Placement Details:</h4>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Expires:</strong> ${expirationDate}</p>
            <p><strong>Days Remaining:</strong> ${daysRemaining}</p>
          </div>
          
          <div class="benefits">
            <h4>Continue Enjoying These Benefits:</h4>
            <ul>
              <li>Prominent logo placement on the NAREIS homepage</li>
              <li>Direct link to your website for increased traffic</li>
              <li>Enhanced visibility in the member directory</li>
              <li>Priority placement in search results</li>
            </ul>
          </div>
          
          <div class="price-box">
            <p style="margin:0;font-size:18px;font-weight:bold">Renew for only $300</p>
            <p style="margin:5px 0 0 0;font-size:14px">Another 30 days of premium visibility</p>
          </div>
          
          <div style="text-align:center">
            <a href="${renewalLink}" class="button">Renew Now - $300</a>
          </div>
          
          <p style="font-size:14px;color:#666">If you do not renew by ${expirationDate}, your listing will be automatically removed from the featured section.</p>
          
          <p>Thank you for being a valued NAREIS member!</p>
          <p>Best regards,<br>The NAREIS Team</p>
        </div>
        <div class="footer">
          <p>© 2025 NAREIS.org. All rights reserved.</p>
          <p><a href="https://nareis.org/contact">Contact Support</a> | <a href="https://nareis.org/privacy">Privacy Policy</a></p>
        </div>
      </body>
    </html>`;
}

// Expired membership email template
function getExpiredEmail(name: string, companyName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6b7280; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background: #f9fafb; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6b7280; }
          .button { display: inline-block; padding: 16px 32px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; background: #f3f4f6; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Featured Membership Expired</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          
          <p>Your featured membership placement for <strong>${companyName}</strong> on NAREIS.org has expired and your listing has been removed from the featured section.</p>
          
          <div class="info-box">
            <h4 style="margin-top:0">What This Means:</h4>
            <ul>
              <li>Your company logo is no longer displayed in the Featured Members section</li>
              <li>Your enhanced directory visibility has been reset</li>
              <li>Your priority search placement has ended</li>
            </ul>
          </div>
          
          <p>Want to regain your premium visibility? You can purchase a new featured membership placement at any time.</p>
          
          <div style="text-align:center">
            <a href="https://nareis.org/?featured=true" class="button">Get Featured Again - $300</a>
          </div>
          
          <p>If you have any questions about your membership, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>The NAREIS Team</p>
        </div>
        <div class="footer">
          <p>© 2025 NAREIS.org. All rights reserved.</p>
          <p><a href="https://nareis.org/contact">Contact Support</a> | <a href="https://nareis.org/privacy">Privacy Policy</a></p>
        </div>
      </body>
    </html>`;
}

// Send email via SendGrid
async function sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
  const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
  
  if (!sendgridApiKey) {
    console.error('SendGrid API key not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: 'noreply@nareis.org', name: 'NAREIS' },
        subject: subject,
        content: [{ type: 'text/html', value: htmlContent }]
      })
    });

    if (response.ok || response.status === 202) {
      console.log(`Email sent successfully to ${to}`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`Failed to send email: ${response.status} - ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const results = {
      remindersChecked: 0,
      remindersSent: 0,
      expiredChecked: 0,
      expiredProcessed: 0,
      errors: [] as string[]
    };

    console.log('=== Featured Membership Expiration Check ===');
    console.log(`Current time: ${now.toISOString()}`);
    console.log(`Checking for memberships expiring before: ${fiveDaysFromNow.toISOString()}`);

    // ========================================
    // STEP 1: Send renewal reminders for memberships expiring within 5 days
    // ========================================
    
    console.log('\n--- Step 1: Checking for expiring memberships ---');
    
    const { data: expiringMemberships, error: expiringError } = await supabase
      .from('featured_memberships')
      .select('*')
      .eq('status', 'active')
      .eq('payment_status', 'completed')
      .lte('end_date', fiveDaysFromNow.toISOString())
      .gt('end_date', now.toISOString());

    if (expiringError) {
      console.error('Error fetching expiring memberships:', expiringError);
      results.errors.push(`Fetch expiring error: ${expiringError.message}`);
    } else if (expiringMemberships && expiringMemberships.length > 0) {
      console.log(`Found ${expiringMemberships.length} memberships expiring soon`);
      
      for (const membership of expiringMemberships) {
        // Skip if reminder was sent in the last 24 hours
        if (membership.reminder_sent_at && new Date(membership.reminder_sent_at) > oneDayAgo) {
          console.log(`Skipping ${membership.company_name} - reminder already sent recently`);
          continue;
        }
        
        results.remindersChecked++;

        try {
          // Calculate days remaining
          const endDate = new Date(membership.end_date);
          const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          // Generate or use existing renewal token
          let renewalToken = membership.renewal_token;
          if (!renewalToken) {
            renewalToken = generateRenewalToken();
          }

          // Get member email
          let memberEmail = membership.member_email;
          let memberName = membership.member_name || membership.company_name;

          if (!memberEmail) {
            // Try to get from auth.users
            const { data: authUser } = await supabase.auth.admin.getUserById(membership.user_id);
            if (authUser?.user?.email) {
              memberEmail = authUser.user.email;
            }
          }

          if (!memberEmail) {
            console.error(`No email found for membership ${membership.id}`);
            results.errors.push(`No email for membership ${membership.id}`);
            continue;
          }

          // Format expiration date
          const expirationDate = endDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          // Build renewal link
          const renewalLink = `https://nareis.org/renew-featured?token=${renewalToken}&id=${membership.id}`;

          // Send reminder email
          const emailHtml = getRenewalReminderEmail(
            memberName,
            membership.company_name,
            daysRemaining,
            expirationDate,
            renewalLink
          );

          const emailSent = await sendEmail(
            memberEmail,
            `Action Required: Your NAREIS Featured Membership Expires in ${daysRemaining} Day${daysRemaining !== 1 ? 's' : ''}`,
            emailHtml
          );

          if (emailSent) {
            // Update membership with reminder info
            const { error: updateError } = await supabase
              .from('featured_memberships')
              .update({
                reminder_sent_at: now.toISOString(),
                reminder_count: (membership.reminder_count || 0) + 1,
                renewal_token: renewalToken,
                member_email: memberEmail,
                member_name: memberName
              })
              .eq('id', membership.id);

            if (updateError) {
              console.error(`Error updating membership ${membership.id}:`, updateError);
              results.errors.push(`Update error for ${membership.id}: ${updateError.message}`);
            } else {
              results.remindersSent++;
              console.log(`✓ Reminder sent to ${memberEmail} for ${membership.company_name} (${daysRemaining} days remaining)`);
            }
          } else {
            results.errors.push(`Failed to send email to ${memberEmail}`);
          }
        } catch (err) {
          console.error(`Error processing membership ${membership.id}:`, err);
          results.errors.push(`Processing error for ${membership.id}: ${err.message}`);
        }
      }
    } else {
      console.log('No memberships expiring within 5 days that need reminders');
    }

    // ========================================
    // STEP 2: Auto-expire memberships that have passed their end date
    // ========================================
    
    console.log('\n--- Step 2: Checking for expired memberships ---');
    
    const { data: expiredMemberships, error: expiredError } = await supabase
      .from('featured_memberships')
      .select('*')
      .eq('status', 'active')
      .eq('payment_status', 'completed')
      .lt('end_date', now.toISOString())
      .or('auto_expired.is.null,auto_expired.eq.false');

    if (expiredError) {
      console.error('Error fetching expired memberships:', expiredError);
      results.errors.push(`Fetch expired error: ${expiredError.message}`);
    } else if (expiredMemberships && expiredMemberships.length > 0) {
      console.log(`Found ${expiredMemberships.length} memberships to expire`);
      results.expiredChecked = expiredMemberships.length;

      for (const membership of expiredMemberships) {
        try {
          // Get member email
          let memberEmail = membership.member_email;
          let memberName = membership.member_name || membership.company_name;

          if (!memberEmail) {
            const { data: authUser } = await supabase.auth.admin.getUserById(membership.user_id);
            if (authUser?.user?.email) {
              memberEmail = authUser.user.email;
            }
          }

          // Update membership status to expired
          const { error: updateError } = await supabase
            .from('featured_memberships')
            .update({
              status: 'expired',
              auto_expired: true,
              updated_at: now.toISOString()
            })
            .eq('id', membership.id);

          if (updateError) {
            console.error(`Error expiring membership ${membership.id}:`, updateError);
            results.errors.push(`Expire error for ${membership.id}: ${updateError.message}`);
          } else {
            results.expiredProcessed++;
            console.log(`✓ Membership expired: ${membership.company_name}`);

            // Send expiration notification email
            if (memberEmail) {
              const emailHtml = getExpiredEmail(memberName, membership.company_name);
              await sendEmail(
                memberEmail,
                'Your NAREIS Featured Membership Has Expired',
                emailHtml
              );
            }
          }
        } catch (err) {
          console.error(`Error expiring membership ${membership.id}:`, err);
          results.errors.push(`Expiration error for ${membership.id}: ${err.message}`);
        }
      }
    } else {
      console.log('No memberships to expire');
    }

    // ========================================
    // Summary
    // ========================================
    
    console.log('\n=== Expiration Check Complete ===');
    console.log(`Reminders checked: ${results.remindersChecked}`);
    console.log(`Reminders sent: ${results.remindersSent}`);
    console.log(`Expired checked: ${results.expiredChecked}`);
    console.log(`Expired processed: ${results.expiredProcessed}`);
    if (results.errors.length > 0) {
      console.log(`Errors: ${results.errors.length}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Featured membership expiration check completed',
        timestamp: now.toISOString(),
        results
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );

  } catch (error) {
    console.error('Fatal error in expiration scheduler:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});
```

---

## Deployment Instructions

### Step 1: Create the Edge Function

```bash
# Navigate to your project directory
cd your-project

# Create the function directory
mkdir -p supabase/functions/featured-expiration-scheduler

# Create the index.ts file with the code above
# Then deploy:
supabase functions deploy featured-expiration-scheduler --no-verify-jwt
```

### Step 2: Set Required Secrets

```bash
# Set SendGrid API key for sending emails
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key
```

### Step 3: Test the Function

```bash
# Invoke manually to test
curl -X POST https://your-project.supabase.co/functions/v1/featured-expiration-scheduler \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

---

## Scheduler Configuration

### Option 1: Using pg_cron (Recommended)

Enable pg_cron in your Supabase project and create a scheduled job:

```sql
-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to call the edge function
CREATE OR REPLACE FUNCTION call_featured_expiration_scheduler()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  response json;
BEGIN
  SELECT content::json INTO response
  FROM http_post(
    'https://your-project.supabase.co/functions/v1/featured-expiration-scheduler',
    '{}',
    'application/json'
  );
  
  RAISE NOTICE 'Expiration scheduler response: %', response;
END;
$$;

-- Schedule to run daily at 9:00 AM UTC
SELECT cron.schedule(
  'featured-expiration-check',
  '0 9 * * *',
  $$SELECT call_featured_expiration_scheduler()$$
);

-- To view scheduled jobs:
SELECT * FROM cron.job;

-- To remove the schedule:
-- SELECT cron.unschedule('featured-expiration-check');
```

### Option 2: Using External Scheduler (Cron Job)

Set up an external cron job to call the function:

```bash
# Add to crontab (runs daily at 9:00 AM)
0 9 * * * curl -X POST https://your-project.supabase.co/functions/v1/featured-expiration-scheduler -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" -H "Content-Type: application/json"
```

### Option 3: Using GitHub Actions

Create `.github/workflows/featured-expiration.yml`:

```yaml
name: Featured Membership Expiration Check

on:
  schedule:
    # Run daily at 9:00 AM UTC
    - cron: '0 9 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  check-expirations:
    runs-on: ubuntu-latest
    steps:
      - name: Call Expiration Scheduler
        run: |
          curl -X POST ${{ secrets.SUPABASE_URL }}/functions/v1/featured-expiration-scheduler \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json"
```

---

## Manual Testing

### From the Admin Panel

The admin panel includes a "Run Expiration Check" button that triggers the scheduler manually.

### Using cURL

```bash
# Test the function
curl -X POST https://your-project.supabase.co/functions/v1/featured-expiration-scheduler \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
```

### Expected Response

```json
{
  "success": true,
  "message": "Featured membership expiration check completed",
  "timestamp": "2025-01-15T09:00:00.000Z",
  "results": {
    "remindersChecked": 3,
    "remindersSent": 2,
    "expiredChecked": 1,
    "expiredProcessed": 1,
    "errors": []
  }
}
```

---

## Monitoring & Logs

### View Function Logs

```bash
# View recent logs
supabase functions logs featured-expiration-scheduler --tail
```

### Database Queries for Monitoring

```sql
-- Check memberships expiring soon
SELECT 
  company_name,
  end_date,
  EXTRACT(DAY FROM (end_date - NOW())) as days_remaining,
  reminder_sent_at,
  reminder_count
FROM featured_memberships
WHERE status = 'active'
  AND payment_status = 'completed'
  AND end_date > NOW()
  AND end_date < NOW() + INTERVAL '5 days'
ORDER BY end_date;

-- Check recently expired memberships
SELECT 
  company_name,
  end_date,
  auto_expired,
  updated_at
FROM featured_memberships
WHERE status = 'expired'
  AND auto_expired = true
ORDER BY updated_at DESC
LIMIT 10;

-- Check reminder history
SELECT 
  company_name,
  reminder_sent_at,
  reminder_count,
  member_email
FROM featured_memberships
WHERE reminder_sent_at IS NOT NULL
ORDER BY reminder_sent_at DESC
LIMIT 20;
```

---

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Verify SendGrid API key is set correctly
   - Check SendGrid sender verification
   - Review function logs for errors

2. **Memberships not expiring**
   - Check that `status = 'active'` and `payment_status = 'completed'`
   - Verify `end_date` is in the past
   - Ensure `auto_expired` is not already `true`

3. **Duplicate reminders**
   - The function checks `reminder_sent_at` to prevent duplicates within 24 hours
   - Verify the column exists and is being updated

4. **Function timeout**
   - For large numbers of memberships, consider batching
   - Increase function timeout in Supabase dashboard

### Debug Mode

Add this to the function for verbose logging:

```typescript
const DEBUG = true;

if (DEBUG) {
  console.log('Membership data:', JSON.stringify(membership, null, 2));
}
```

---

## Security Considerations

1. **Service Role Key**: The function uses the service role key to bypass RLS for admin operations
2. **Email Validation**: Ensure email addresses are validated before sending
3. **Token Security**: Renewal tokens are unique 32-character strings
4. **Rate Limiting**: Consider adding rate limiting for email sending

---

## Support

For issues or questions:
- Check the function logs in Supabase Dashboard
- Review the admin panel's Featured Tracking page
- Contact support at support@nareis.org
