# Create Admin User: admin@nareis.org

## Method 1: Supabase Dashboard (RECOMMENDED)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Users**
4. Click **Add User** button
5. Enter:
   - **Email**: `admin@nareis.org`
   - **Password**: `Tue#81530`
   - Check **Auto Confirm User** ✓
6. Click **Create User**

After user is created, run this SQL in **SQL Editor**:

```sql
-- Update the profile for admin user
UPDATE profiles 
SET 
  role = 'admin',
  membership_tier = 'premium',
  approval_status = 'approved',
  full_name = 'NAREI Admin'
WHERE email = 'admin@nareis.org';
```

## Method 2: SQL Only (If Method 1 doesn't work)

Run this in **SQL Editor**:

```sql
-- Create admin user with encrypted password
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@nareis.org',
  crypt('Tue#81530', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"NAREI Admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Create profile
INSERT INTO profiles (id, email, full_name, role, membership_tier, approval_status)
SELECT id, email, 'NAREI Admin', 'admin', 'premium', 'approved'
FROM auth.users WHERE email = 'admin@nareis.org';
```

## Login Credentials

- **Email**: admin@nareis.org
- **Password**: Tue#81530
- **Admin Access**: Yes (recognized in AuthContext.tsx)

## After Creation

1. Go to `/login`
2. Enter credentials above
3. Navigate to `/admin` to access Admin Dashboard
