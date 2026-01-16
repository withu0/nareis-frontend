-- Migration: Featured Membership Expiration Tracking
-- This migration ensures all required columns exist for the expiration scheduler

-- Add columns for tracking renewal reminders and auto-expiration (if not already added)
ALTER TABLE featured_memberships 
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS auto_expired BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS renewal_token TEXT,
ADD COLUMN IF NOT EXISTS member_email TEXT,
ADD COLUMN IF NOT EXISTS member_name TEXT,
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT,
ADD COLUMN IF NOT EXISTS last_reminder_type TEXT;

-- Create indexes for efficient expiration queries
CREATE INDEX IF NOT EXISTS idx_featured_memberships_reminder_sent ON featured_memberships(reminder_sent_at);
CREATE INDEX IF NOT EXISTS idx_featured_memberships_auto_expired ON featured_memberships(auto_expired);
CREATE INDEX IF NOT EXISTS idx_featured_memberships_renewal_token ON featured_memberships(renewal_token);
CREATE INDEX IF NOT EXISTS idx_featured_memberships_end_date_status ON featured_memberships(end_date, status);
CREATE INDEX IF NOT EXISTS idx_featured_memberships_payment_status ON featured_memberships(payment_status);

-- Create a composite index for the expiration check query
CREATE INDEX IF NOT EXISTS idx_featured_expiring_check 
ON featured_memberships(status, payment_status, end_date, auto_expired)
WHERE status = 'active' AND payment_status = 'completed';

-- Add comment to table describing the expiration workflow
COMMENT ON TABLE featured_memberships IS 'Tracks featured member placements with $300 fee for 30-day periods. Includes automatic expiration tracking and renewal reminder system.';

-- Add comments to columns
COMMENT ON COLUMN featured_memberships.reminder_sent_at IS 'Timestamp of when the last renewal reminder was sent';
COMMENT ON COLUMN featured_memberships.reminder_count IS 'Total number of renewal reminders sent for this membership';
COMMENT ON COLUMN featured_memberships.auto_expired IS 'Whether this membership was automatically expired by the scheduler';
COMMENT ON COLUMN featured_memberships.renewal_token IS 'Unique token for the renewal payment link';
COMMENT ON COLUMN featured_memberships.member_email IS 'Cached email address for sending reminders';
COMMENT ON COLUMN featured_memberships.member_name IS 'Cached member name for personalized emails';
COMMENT ON COLUMN featured_memberships.stripe_checkout_session_id IS 'Stripe checkout session ID for renewal payments';
COMMENT ON COLUMN featured_memberships.last_reminder_type IS 'Type of last reminder sent (5-day, 3-day, 1-day, expired)';

-- Create a function to check if a membership is expiring soon
CREATE OR REPLACE FUNCTION is_membership_expiring_soon(membership_id UUID, days_threshold INTEGER DEFAULT 5)
RETURNS BOOLEAN AS $$
DECLARE
  end_date_val TIMESTAMP WITH TIME ZONE;
  status_val TEXT;
BEGIN
  SELECT end_date, status INTO end_date_val, status_val
  FROM featured_memberships
  WHERE id = membership_id;
  
  IF status_val != 'active' THEN
    RETURN FALSE;
  END IF;
  
  IF end_date_val IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN end_date_val <= (NOW() + (days_threshold || ' days')::INTERVAL)
         AND end_date_val > NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a function to get memberships needing reminders
CREATE OR REPLACE FUNCTION get_memberships_needing_reminders(days_threshold INTEGER DEFAULT 5)
RETURNS TABLE (
  id UUID,
  company_name TEXT,
  member_email TEXT,
  member_name TEXT,
  end_date TIMESTAMP WITH TIME ZONE,
  days_remaining INTEGER,
  reminder_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fm.id,
    fm.company_name,
    fm.member_email,
    fm.member_name,
    fm.end_date,
    EXTRACT(DAY FROM (fm.end_date - NOW()))::INTEGER as days_remaining,
    fm.reminder_count
  FROM featured_memberships fm
  WHERE fm.status = 'active'
    AND fm.payment_status = 'completed'
    AND fm.end_date IS NOT NULL
    AND fm.end_date <= (NOW() + (days_threshold || ' days')::INTERVAL)
    AND fm.end_date > NOW()
    AND (
      fm.reminder_sent_at IS NULL 
      OR fm.reminder_sent_at < (NOW() - INTERVAL '24 hours')
    )
  ORDER BY fm.end_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get expired memberships that need processing
CREATE OR REPLACE FUNCTION get_expired_memberships()
RETURNS TABLE (
  id UUID,
  company_name TEXT,
  member_email TEXT,
  member_name TEXT,
  end_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fm.id,
    fm.company_name,
    fm.member_email,
    fm.member_name,
    fm.end_date
  FROM featured_memberships fm
  WHERE fm.status = 'active'
    AND fm.payment_status = 'completed'
    AND fm.end_date IS NOT NULL
    AND fm.end_date < NOW()
    AND (fm.auto_expired IS NULL OR fm.auto_expired = FALSE)
  ORDER BY fm.end_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Create a view for admin dashboard showing expiration status
CREATE OR REPLACE VIEW featured_membership_status AS
SELECT 
  fm.*,
  CASE 
    WHEN fm.status != 'active' THEN 'inactive'
    WHEN fm.end_date IS NULL THEN 'no_end_date'
    WHEN fm.end_date < NOW() THEN 'expired'
    WHEN fm.end_date <= (NOW() + INTERVAL '5 days') THEN 'critical'
    WHEN fm.end_date <= (NOW() + INTERVAL '10 days') THEN 'warning'
    ELSE 'healthy'
  END as expiration_status,
  CASE 
    WHEN fm.end_date IS NULL THEN NULL
    ELSE EXTRACT(DAY FROM (fm.end_date - NOW()))::INTEGER
  END as days_remaining,
  CASE 
    WHEN fm.payment_status = 'completed' THEN TRUE
    ELSE FALSE
  END as payment_verified
FROM featured_memberships fm;

-- Grant permissions
GRANT SELECT ON featured_membership_status TO authenticated;
GRANT EXECUTE ON FUNCTION is_membership_expiring_soon TO authenticated;
GRANT EXECUTE ON FUNCTION get_memberships_needing_reminders TO authenticated;
GRANT EXECUTE ON FUNCTION get_expired_memberships TO authenticated;
