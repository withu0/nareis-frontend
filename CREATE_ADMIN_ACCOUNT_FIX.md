# Fix Admin Login - Create admin@nareis.org Account

## The Problem
You're getting "invalid login credentials" because the admin@nareis.org user doesn't exist in Supabase Auth yet.

## SOLUTION: Create User via Supabase Dashboard (EASIEST METHOD)

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your NAREIS project
3. Click on "Authentication" in the left sidebar
4. Click on "Users" tab

### Step 2: Add New User
1. Click the "Add User" button (top right)
2. Fill in:
   - **Email**: `admin@nareis.org`
   - **Password**: `Tue#81530`
   - **Auto Confirm User**: ✓ CHECK THIS BOX (very important!)
3. Click "Create User"

### Step 3: Test Login
1. Go to your NAREIS website
2. Click "Login"
3. Enter:
   - Email: `admin@nareis.org`
   - Password: `Tue#81530`
4. You should now be logged in and able to access /admin

---

## Alternative: SQL Method (If Dashboard Method Doesn't Work)

If the dashboard method fails, run this SQL in SQL Editor:

```sql
-- Create the admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@nareis.org',
  crypt('Tue#81530', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"NAREIS Admin"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@nareis.org'
);
```

---

## Why This Works

The AuthContext checks for admin access by email:
- `admin@nareis.org` ✓ (admin access)
- `rick.delgiorno@gmail.com` ✓ (admin access)
- `admin@example.com` ✓ (admin access)
- `rick@theraisegroup.com` ✓ (admin access)

Once the user exists in Supabase Auth with email confirmed, you can log in and access /admin.
