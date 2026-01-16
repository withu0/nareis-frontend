# Grant Admin Access to rick@theraisegroup.com

## Current Status
✅ **Code is already configured** - rick@theraisegroup.com is in the admin emails list
❌ **Account needs to be created** - Follow steps below

## Step-by-Step Instructions

### Step 1: Reactivate Supabase Project (If Needed)
1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. If your project shows as "Paused", click "Restore Project"
4. Wait for the project to become active (may take 1-2 minutes)

### Step 2: Create the Admin User Account
1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click the **"Add User"** or **"Invite User"** button
3. Fill in the form:
   - **Email**: `rick@theraisegroup.com`
   - **Password**: `Tue#81530`
   - **Auto Confirm User**: ✅ CHECK THIS BOX (important!)
4. Click **"Create User"** or **"Send Invitation"**

### Step 3: Add User to Customers Table
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Paste this SQL:

```sql
INSERT INTO customers (id, email, full_name, approval_status, created_at)
SELECT id, email, 'Rick', 'approved', NOW()
FROM auth.users 
WHERE email = 'rick@theraisegroup.com'
ON CONFLICT (id) DO UPDATE 
SET approval_status = 'approved';
```

4. Click **"Run"**

### Step 4: Test Admin Access
1. Go to your website
2. Log in with:
   - Email: rick@theraisegroup.com
   - Password: Tue#81530
3. Navigate to `/admin` or click Admin in the menu
4. You should now have full admin access!

## Why This Works
The code checks if the logged-in user's email is in this list:
- admin@nareis.org
- admin@example.com
- rick.delgiorno@gmail.com
- **rick@theraisegroup.com** ✅

Once you create the account and log in, you'll automatically have admin privileges.

## Troubleshooting
- **Can't log in?** Make sure you checked "Auto Confirm User" when creating the account
- **No admin access?** Check that the email is exactly `rick@theraisegroup.com` (no typos)
- **Project paused?** Restore it first before creating the user
