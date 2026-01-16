-- Add stripe_checkout_session_id column for tracking renewal checkout sessions
ALTER TABLE featured_memberships 
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT;

-- Create index for efficient lookup
CREATE INDEX IF NOT EXISTS idx_featured_memberships_checkout_session 
ON featured_memberships(stripe_checkout_session_id);

-- Add policy for public access to renewal page (with token validation)
CREATE POLICY "Public can view featured memberships with valid token"
  ON featured_memberships FOR SELECT
  USING (renewal_token IS NOT NULL);
