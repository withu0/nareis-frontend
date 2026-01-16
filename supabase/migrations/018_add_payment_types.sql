-- Add payment_type column to payment_history table
ALTER TABLE payment_history 
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) 
CHECK (payment_type IN ('membership', 'featured_listing', 'advertisement', 'spotlight_application'));

-- Create index for payment_type
CREATE INDEX IF NOT EXISTS idx_payment_history_payment_type ON payment_history(payment_type);

-- Update existing records to have a default payment_type
UPDATE payment_history 
SET payment_type = 'membership' 
WHERE payment_type IS NULL;

-- Add RLS policy for admins to view all payment history
CREATE POLICY "Admins can view all payment history"
  ON payment_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid()
      AND customers.role = 'admin'
    )
  );
