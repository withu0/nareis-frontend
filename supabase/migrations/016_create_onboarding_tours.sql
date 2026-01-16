-- Create onboarding_tours table
CREATE TABLE IF NOT EXISTS onboarding_tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tour_type VARCHAR(50) DEFAULT 'platform_tour',
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 6,
  completed BOOLEAN DEFAULT FALSE,
  skipped BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  last_viewed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE onboarding_tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tour progress"
  ON onboarding_tours FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tour progress"
  ON onboarding_tours FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tour progress"
  ON onboarding_tours FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_onboarding_tours_user_id ON onboarding_tours(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_tours_completed ON onboarding_tours(completed);
