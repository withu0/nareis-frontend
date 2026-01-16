# Manual Database Cleanup Instructions

The automated SQL queries are timing out due to connection issues. Please follow these manual steps in your Supabase Dashboard:

---

## Step 1: Open Supabase Dashboard

1. Go to: **https://supabase.com/dashboard**
2. Log in to your account
3. Select your **NAREIS project**

---

## Step 2: Delete from Customers Table

1. Click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste this query:

```sql
-- Delete sample seeded customers
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

-- Delete specific users by email
DELETE FROM customers WHERE email IN (
  'rick.delgiorno@gmail.com',
  'info@nareis.com',
  'durobert@gmail.com'
);
```

4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

---

## Step 3: Delete from Auth Users

1. In the left sidebar, click **Authentication**
2. Click **Users** tab
3. Find and delete each of these users:
   - `rick.delgiorno@gmail.com`
   - `info@nareis.com`
   - `durobert@gmail.com`

**To delete a user:**
- Click on the user row
- Click the **three dots menu** (⋮) on the right
- Select **Delete user**
- Confirm deletion

---

## Step 4: Verify Cleanup

Run this query in SQL Editor to verify:

```sql
-- Check remaining customers
SELECT id, email, first_name, last_name, created_at 
FROM customers 
ORDER BY created_at DESC;
```

---

## Expected Result

After cleanup:
- No sample users with placeholder UUIDs
- No users with emails: rick.delgiorno@gmail.com, info@nareis.com, durobert@gmail.com
- Only legitimate registered users remain

---

## Admin Access (After Cleanup)

The following emails have admin access in the application:
- `admin@nareis.org`
- `rick@theraisegroup.com`

These users need to exist in both `auth.users` and `customers` tables to log in.
