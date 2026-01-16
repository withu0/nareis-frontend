-- Create featured_memberships table
CREATE TABLE IF NOT EXISTS featured_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_amount DECIMAL(10,2) NOT NULL DEFAULT 300.00,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_featured_memberships_user_id ON featured_memberships(user_id);
CREATE INDEX idx_featured_memberships_status ON featured_memberships(status);
CREATE INDEX idx_featured_memberships_end_date ON featured_memberships(end_date);

-- Enable RLS
ALTER TABLE featured_memberships ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own featured memberships"
  ON featured_memberships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own featured memberships"
  ON featured_memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all featured memberships"
  ON featured_memberships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all featured memberships"
  ON featured_memberships FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete all featured memberships"
  ON featured_memberships FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_featured_memberships_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_featured_memberships_updated_at
  BEFORE UPDATE ON featured_memberships
  FOR EACH ROW
  EXECUTE FUNCTION update_featured_memberships_updated_at();
