# Setting Admin Password

## Method 1: Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Find the user with email: `admin@nareis.org`
5. Click on the user to open details
6. Click **"Reset Password"** or **"Send Magic Link"**
7. Or click the three dots menu → **"Edit User"**
8. Set password to: `Tue#81530`
9. Save changes

## Method 2: Create User if Doesn't Exist

If the user doesn't exist yet:

1. Go to **Authentication** → **Users**
2. Click **"Add User"**
3. Enter:
   - Email: `admin@nareis.org`
   - Password: `Tue#81530`
   - Auto Confirm User: **Yes** (check this box)
4. Click **"Create User"**

## Method 3: SQL Editor (If project is active)

Go to **SQL Editor** in Supabase Dashboard and run:

```sql
UPDATE auth.users 
SET encrypted_password = crypt('Tue#81530', gen_salt('bf')),
    updated_at = NOW(),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'admin@nareis.org';
```

## Login Credentials

After setting up:
- **Email**: admin@nareis.org
- **Password**: Tue#81530
- **Access**: Admin Dashboard at `/admin`

## Note

The Supabase project may need to be activated if it's currently inactive.
