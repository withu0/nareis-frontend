-- RLS Policy: Users can insert their own badge analytics
CREATE POLICY "Users can insert their own badge analytics"
  ON badge_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can view their own badge analytics
CREATE POLICY "Users can view their own badge analytics"
  ON badge_analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policy: Admins can view all badge analytics
CREATE POLICY "Admins can view all badge analytics"
  ON badge_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policy: Admins can delete badge analytics
CREATE POLICY "Admins can delete badge analytics"
  ON badge_analytics
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
