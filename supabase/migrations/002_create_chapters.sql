-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  state VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  member_count INTEGER DEFAULT 0,
  contact_email VARCHAR(255),
  meeting_schedule TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chapter members junction table
CREATE TABLE IF NOT EXISTS chapter_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  role VARCHAR(50) DEFAULT 'member',
  UNIQUE(chapter_id, customer_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chapters_state ON chapters(state);
CREATE INDEX IF NOT EXISTS idx_chapters_leader ON chapters(leader_id);
CREATE INDEX IF NOT EXISTS idx_chapter_members_chapter ON chapter_members(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapter_members_customer ON chapter_members(customer_id);
