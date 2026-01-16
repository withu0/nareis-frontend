# Database Seeding Guide

This guide explains how to populate your Supabase database with sample data.

## What Gets Seeded

The seed scripts will populate:
- **10 Members** in the `customers` table
- **8 Events** in the `events` table  
- **12 Resources** in the `resources` table

## Prerequisites

Before running seed scripts, ensure the database tables exist by running schema migrations first.

## Step 1: Create Tables (Required First!)

Run these migrations in order in the Supabase SQL Editor:

1. `supabase/migrations/000_create_customers_table.sql` - **REQUIRED FIRST**
2. `supabase/migrations/001_create_core_tables.sql`
3. `supabase/migrations/003_create_events.sql`
4. `supabase/migrations/004_create_resources.sql`
5. `supabase/migrations/008_enable_rls.sql`

## Step 2: Seed the Data

### Via Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Copy and paste each seed file in order:
   - `supabase/migrations/021_seed_customers.sql`
   - `supabase/migrations/022_seed_customers_part2.sql`
   - `supabase/migrations/023_seed_events.sql`
   - `supabase/migrations/024_seed_resources.sql`
   - `supabase/migrations/025_seed_resources_part2.sql`
5. Click **Run** for each script

### Via Supabase CLI

```bash
supabase db push
```

## Step 3: Verify Data

Run these queries to confirm data was inserted:

```sql
-- Check customers count
SELECT COUNT(*) FROM customers;
-- Expected: 10

-- Check events count
SELECT COUNT(*) FROM events;
-- Expected: 8

-- Check resources count
SELECT COUNT(*) FROM resources;
-- Expected: 12

-- View sample member
SELECT first_name, last_name, company, city, state FROM customers LIMIT 3;
```

## Troubleshooting

### "relation customers does not exist"
Run `000_create_customers_table.sql` first before any other migrations.

### Members not showing on website
1. Check browser console for errors
2. Verify RLS policies allow SELECT: `008_enable_rls.sql`
3. Ensure data exists: `SELECT * FROM customers LIMIT 5;`

### Clear and Re-seed

```sql
-- Clear existing seed data
DELETE FROM customers WHERE id LIKE '%-%-%-%-111111111111';
DELETE FROM events WHERE id LIKE '%-%-%-%-111111111111';
DELETE FROM resources WHERE id LIKE '%-%-%-%-111111111111';

-- Then re-run seed scripts
```

## Quick Start (All-in-One)

Copy this entire block into SQL Editor and run:

```sql
-- Quick verification query
SELECT 
  (SELECT COUNT(*) FROM customers) as members,
  (SELECT COUNT(*) FROM events) as events,
  (SELECT COUNT(*) FROM resources) as resources;
```
