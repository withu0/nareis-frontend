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

-- Update existing records to have completed payment status if they were approved
UPDATE featured_memberships 
SET payment_status = 'completed' 
WHERE status = 'active' AND payment_status = 'pending';
