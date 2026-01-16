-- Advocacy campaigns table
CREATE TABLE IF NOT EXISTS advocacy_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  campaign_type VARCHAR(50),
  target_audience TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  goal_description TEXT,
  progress_percentage INTEGER DEFAULT 0,
  organizer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  image_url TEXT,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Campaign participants
CREATE TABLE IF NOT EXISTS campaign_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES advocacy_campaigns(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  participation_date TIMESTAMP DEFAULT NOW(),
  action_taken VARCHAR(100),
  UNIQUE(campaign_id, customer_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON advocacy_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_organizer ON advocacy_campaigns(organizer_id);
CREATE INDEX IF NOT EXISTS idx_campaign_participants_campaign ON campaign_participants(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_participants_customer ON campaign_participants(customer_id);
