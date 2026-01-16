# Delete Sample Users from Database

Since the database queries timed out, please run these SQL commands manually in your Supabase Dashboard:

## Steps:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Run the following queries:

## Query 1: Delete Sample/Seeded Customers

```sql
DELETE FROM customers WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888',
  '99999999-9999-9999-9999-999999999999',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);
```

## Query 2: Delete Specific Users by Email

```sql
DELETE FROM customers WHERE email IN (
  'rick.delgiorno@gmail.com',
  'info@nareis.com',
  'durobert@gmail.com'
);
```

## Query 3: Delete from Auth Users (Optional)

To also delete these users from Supabase Auth:

1. Go to **Authentication** → **Users** in the Supabase Dashboard
2. Find and delete users with these emails:
   - rick.delgiorno@gmail.com
   - info@nareis.com
   - durobert@gmail.com

Or run this SQL (requires admin privileges):

```sql
-- Note: This requires the service_role key and may need to be done via the dashboard
DELETE FROM auth.users WHERE email IN (
  'rick.delgiorno@gmail.com',
  'info@nareis.com',
  'durobert@gmail.com'
);
```

## Verification

After running the queries, verify the deletions:

```sql
-- Check remaining customers
SELECT id, email, first_name, last_name FROM customers;

-- Count total customers
SELECT COUNT(*) as total_customers FROM customers;
```

## What Was Updated in Code

The following code changes were made:

1. **AuthContext.tsx** - Removed `rick.delgiorno@gmail.com` and `admin@example.com` from admin emails list
2. **Login.tsx** - Removed demo login functionality and updated admin emails list
3. **membersDirectory.ts** - Cleared all sample member data
4. **021_seed_customers.sql** - Cleared seed data
5. **022_seed_customers_part2.sql** - Cleared seed data

Admin access is now limited to:
- admin@nareis.org
- rick@theraisegroup.com
