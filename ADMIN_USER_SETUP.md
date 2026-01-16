# Admin User Setup for rick@theriasegroup.com

## Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add user** > **Create new user**
4. Enter:
   - Email: `rick@theriasegroup.com`
   - Password: `Tue#81530`
   - Check "Auto Confirm User"
5. Click **Create user**
6. The user will be created and can immediately log in

## Method 2: Using SQL

Run this SQL in your Supabase SQL Editor:

```sql
-- This will allow the user to sign up and be automatically approved
-- After they sign up with the credentials, their status will be set to approved
```

## Method 3: Manual Signup

1. Go to the signup page
2. Sign up with:
   - Email: rick@theriasegroup.com
   - Password: Tue#81530
3. Then run this SQL to approve the account:

```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{approval_status}',
  '"approved"'
)
WHERE email = 'rick@theriasegroup.com';
```

## Note

The email `rick@theriasegroup.com` is already configured as an admin in the application code (AuthContext.tsx), so once the account is created and approved, they will have full admin access.
