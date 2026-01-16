-- Add approval status fields to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS approval_notes TEXT,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP;

-- Create index for approval status
CREATE INDEX IF NOT EXISTS idx_customers_approval_status ON customers(approval_status);

-- Add comment for clarity
COMMENT ON COLUMN customers.approval_status IS 'Status of member application: pending, approved, rejected';
