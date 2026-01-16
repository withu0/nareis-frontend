-- Create customers table if it doesn't exist
-- This should be run FIRST before any other migrations

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company VARCHAR(255),
  phone VARCHAR(20),
  website TEXT,
  role VARCHAR(100) DEFAULT 'member',
  company_size VARCHAR(50),
  experience VARCHAR(50),
  bio TEXT,
  membership_tier VARCHAR(50) DEFAULT 'foundation',
  membership_status VARCHAR(50) DEFAULT 'active',
  membership_start_date TIMESTAMP DEFAULT NOW(),
  membership_end_date TIMESTAMP,
  property_types TEXT[],
  investment_strategies TEXT[],
  city VARCHAR(100),
  state VARCHAR(50),
  avatar_url TEXT,
  linkedin_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  approval_status VARCHAR(50) DEFAULT 'pending',
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_auth_id ON customers(auth_id);
CREATE INDEX IF NOT EXISTS idx_customers_membership_tier ON customers(membership_tier);
CREATE INDEX IF NOT EXISTS idx_customers_state ON customers(state);
CREATE INDEX IF NOT EXISTS idx_customers_approval_status ON customers(approval_status);
