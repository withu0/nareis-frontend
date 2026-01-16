-- Events RLS policies
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Organizers can update their events" ON events FOR UPDATE 
  USING (organizer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Event registrations policies
CREATE POLICY "Users can view their own registrations" ON event_registrations FOR SELECT 
  USING (customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
CREATE POLICY "Users can register for events" ON event_registrations FOR INSERT 
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
CREATE POLICY "Users can cancel their registrations" ON event_registrations FOR DELETE 
  USING (customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));

-- Chapter members policies
CREATE POLICY "Anyone can view chapter members" ON chapter_members FOR SELECT USING (true);
CREATE POLICY "Users can join chapters" ON chapter_members FOR INSERT 
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
CREATE POLICY "Users can leave chapters" ON chapter_members FOR DELETE 
  USING (customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
