-- Create badge_analytics table
CREATE TABLE IF NOT EXISTS badge_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL CHECK (badge_type IN ('custom', 'pre-made')),
  color_scheme VARCHAR(50),
  badge_format VARCHAR(20) CHECK (badge_format IN ('social', 'website', 'print')),
  company_name TEXT,
  member_since INTEGER,
  certification_level VARCHAR(100),
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_badge_analytics_user_id ON badge_analytics(user_id);
CREATE INDEX idx_badge_analytics_badge_type ON badge_analytics(badge_type);
CREATE INDEX idx_badge_analytics_color_scheme ON badge_analytics(color_scheme);
CREATE INDEX idx_badge_analytics_downloaded_at ON badge_analytics(downloaded_at DESC);
CREATE INDEX idx_badge_analytics_type_scheme ON badge_analytics(badge_type, color_scheme);

-- Enable Row Level Security
ALTER TABLE badge_analytics ENABLE ROW LEVEL SECURITY;
