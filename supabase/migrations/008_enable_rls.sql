-- Enable Row Level Security on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE advocacy_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_participants ENABLE ROW LEVEL SECURITY;

-- Customers policies
CREATE POLICY "Users can view all customer profiles" ON customers FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON customers FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "Users can insert own profile" ON customers FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Chapters policies
CREATE POLICY "Anyone can view chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Chapter leaders can update their chapters" ON chapters FOR UPDATE USING (leader_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
CREATE POLICY "Admins can insert chapters" ON chapters FOR INSERT WITH CHECK (true);
