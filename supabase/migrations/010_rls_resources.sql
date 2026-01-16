-- Resources RLS policies
CREATE POLICY "Anyone can view resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Authors can update their resources" ON resources FOR UPDATE 
  USING (author_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
CREATE POLICY "Authenticated users can create resources" ON resources FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors can delete their resources" ON resources FOR DELETE 
  USING (author_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));

-- Resource downloads policies
CREATE POLICY "Users can view their downloads" ON resource_downloads FOR SELECT 
  USING (customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
CREATE POLICY "Users can download resources" ON resource_downloads FOR INSERT 
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_id = auth.uid()));
