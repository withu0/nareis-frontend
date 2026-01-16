# Create Admin Account for rick@theraisegroup.com

The admin access has been configured in the code. Now you need to create the actual user account in Supabase.

## Step 1: Reactivate Your Supabase Project

Your Supabase project appears to be paused. You need to reactivate it first:

1. Go to https://supabase.com/dashboard
2. Find your project
3. Click "Restore" or "Unpause" to reactivate it

## Step 2: Create the Admin User Account

Once your project is active, use ONE of these methods:

### Method A: Using Supabase Dashboard (RECOMMENDED)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Enter:
   - **Email**: `rick@theraisegroup.com`
   - **Password**: `Tue#81530`
   - **Auto Confirm User**: ✓ (checked)
5. Click **Create User**

### Method B: Using SQL Query

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this query:

```sql
-- Create the auth user
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
  confirmation_token,
  raw_app_meta_data,
  raw_user_meta_data
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'rick@theraisegroup.com',
  crypt('Tue#81530', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Rick"}'
);
```

## Step 3: Login

1. Go to your website's login page
2. Enter:
   - **Email**: `rick@theraisegroup.com`
   - **Password**: `Tue#81530`
3. You should now have admin access!

## Verify Admin Access

After logging in, you should be able to access the Admin panel at `/admin`.

The email `rick@theraisegroup.com` is now configured as an admin in the AuthContext.
