-- Create admin_settings table for storing global admin configuration
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default auto-approval setting (disabled by default)
INSERT INTO admin_settings (setting_key, setting_value, description)
VALUES (
  'auto_approval',
  '{"enabled": false}',
  'When enabled, new members are automatically approved after successful payment'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert email verification setting
INSERT INTO admin_settings (setting_key, setting_value, description)
VALUES (
  'email_verification',
  '{"enabled": true}',
  'Require email verification before accessing member features'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert welcome email setting
INSERT INTO admin_settings (setting_key, setting_value, description)
VALUES (
  'welcome_email',
  '{"enabled": true}',
  'Send welcome email when a member is approved'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (needed for webhook)
CREATE POLICY "Anyone can read settings" ON admin_settings
  FOR SELECT USING (true);

-- Allow authenticated users to update settings (admin check done in app)
CREATE POLICY "Authenticated users can update settings" ON admin_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert settings" ON admin_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
