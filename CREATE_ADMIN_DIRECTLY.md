# Create Admin Account for rick@theraisegroup.com

## IMPORTANT: Your Supabase project is INACTIVE

You're getting "Invalid login credentials" because the account doesn't exist yet AND your Supabase project is paused.

## Step 1: Reactivate Your Supabase Project

1. Go to https://supabase.com/dashboard/projects
2. Find project `puvvhscxffpmemufkxaq`
3. Click "Restore project" or "Unpause"
4. Wait for project to become active (may take 1-2 minutes)

## Step 2: Create the Admin User Account

### Option A: Using Supabase Dashboard (EASIEST)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** or **"Invite user"**
4. Fill in:
   - **Email**: `rick@theraisegroup.com`
   - **Password**: `Tue#81530`
   - Check **"Auto Confirm User"** (important!)
5. Click **"Create user"** or **"Send invitation"**

### Option B: Using SQL Editor

1. Go to **SQL Editor** in Supabase dashboard
2. Run this query to check if user exists:

```sql
SELECT * FROM auth.users WHERE email = 'rick@theraisegroup.com';
```

3. If user doesn't exist, you MUST use the dashboard method above (Option A)

4. After creating via dashboard, run this to add to customers table:

```sql
INSERT INTO customers (id, email, full_name, approval_status, role)
SELECT 
  id,
  'rick@theraisegroup.com',
  'Rick Admin',
  'approved',
  'admin'
FROM auth.users 
WHERE email = 'rick@theraisegroup.com'
ON CONFLICT (id) DO UPDATE SET
  approval_status = 'approved',
  role = 'admin';
```

## Step 3: Verify Admin Access

The code is already configured to recognize rick@theraisegroup.com as an admin (see `src/contexts/AuthContext.tsx` lines 29 and 43).

Once the account is created, you should be able to:
1. Log in at the login page
2. Access the Admin panel at `/admin`

## Troubleshooting

**Still getting "Invalid login credentials"?**
- Make sure the Supabase project is active (not paused)
- Verify the email is exactly: `rick@theraisegroup.com` (no typos)
- Verify the password is exactly: `Tue#81530` (case-sensitive)
- Check that "Auto Confirm User" was enabled when creating the account
- Try resetting the password through the Supabase dashboard

**Can't access admin panel after login?**
- Check the browser console for errors
- Verify the customers table entry exists with `approval_status = 'approved'`
