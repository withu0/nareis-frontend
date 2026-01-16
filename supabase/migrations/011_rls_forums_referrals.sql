-- Forum posts policies
CREATE POLICY "Anyone can view forum posts" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON forum_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors can update their posts" ON forum_posts FOR UPDATE USING (author_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
CREATE POLICY "Authors can delete their posts" ON forum_posts FOR DELETE USING (author_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));

-- Forum comments policies
CREATE POLICY "Anyone can view comments" ON forum_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON forum_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors can update comments" ON forum_comments FOR UPDATE USING (author_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
CREATE POLICY "Authors can delete comments" ON forum_comments FOR DELETE USING (author_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));

-- Referrals policies
CREATE POLICY "Users view own referrals" ON referrals FOR SELECT USING (referrer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
CREATE POLICY "Users create referrals" ON referrals FOR INSERT WITH CHECK (referrer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));

-- Advocacy campaigns policies
CREATE POLICY "Anyone can view campaigns" ON advocacy_campaigns FOR SELECT USING (true);
CREATE POLICY "Organizers update campaigns" ON advocacy_campaigns FOR UPDATE USING (organizer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));

-- Campaign participants policies
CREATE POLICY "Anyone view participants" ON campaign_participants FOR SELECT USING (true);
CREATE POLICY "Users join campaigns" ON campaign_participants FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
