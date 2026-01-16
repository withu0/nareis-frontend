# User Signup Flow Testing Guide

This guide walks you through testing the complete user signup flow, verifying database records, and confirming the onboarding process.

## Prerequisites

1. Access to the running application (usually at `http://localhost:5173` or your deployed URL)
2. Access to Supabase Dashboard for database verification
3. Browser developer tools (F12) for console logs

---

## Step 1: Create a Test Account

### 1.1 Navigate to Signup Page

1. Open your application in a browser
2. Click "Sign Up" or navigate to `/signup`
3. You should see the signup form with fields for:
   - Full Name
   - Email
   - Password

### 1.2 Fill Out the Form

Use test credentials like:
- **Full Name:** `Test User`
- **Email:** `testuser@example.com` (use a unique email each time)
- **Password:** `TestPassword123!`

### 1.3 Submit and Monitor

1. Open browser Developer Tools (F12) → Console tab
2. Click "Sign Up" button
3. Watch for console logs:
   ```
   === SIGNUP STARTED ===
   Email: testuser@example.com
   Full Name: Test User
   === SIGNUP SUCCESS ===
   User ID: [uuid]
   User Email: testuser@example.com
   ```

### 1.4 Expected Results

- ✅ Green success alert appears with User ID
- ✅ Toast notification: "Account created! Redirecting to complete your profile..."
- ✅ Automatic redirect to `/onboarding` after 1.5 seconds

---

## Step 2: Verify Database Records

### 2.1 Check auth.users Table

1. Go to Supabase Dashboard → Authentication → Users
2. Look for your test email
3. Verify:
   - ✅ User exists with correct email
   - ✅ User ID matches the one shown in console
   - ✅ `raw_user_meta_data` contains `full_name`

### 2.2 Check customers Table

1. Go to Supabase Dashboard → Table Editor → customers
2. Find the record with your test email
3. Verify these fields:

| Field | Expected Value |
|-------|----------------|
| `auth_id` | Matches auth.users ID |
| `email` | `testuser@example.com` |
| `full_name` | `Test User` |
| `first_name` | `Test` |
| `last_name` | `User` |
| `approval_status` | `pending` |
| `membership_status` | `pending` |
| `membership_tier` | `foundation` |
| `role` | `member` |

### 2.3 SQL Verification Query

Run this in Supabase SQL Editor:

```sql
-- Find the test user in both tables
SELECT 
  au.id as auth_id,
  au.email as auth_email,
  au.created_at as auth_created,
  au.raw_user_meta_data->>'full_name' as meta_full_name,
  c.id as customer_id,
  c.email as customer_email,
  c.full_name,
  c.first_name,
  c.last_name,
  c.approval_status,
  c.membership_status,
  c.membership_tier,
  c.role
FROM auth.users au
LEFT JOIN public.customers c ON c.auth_id = au.id
WHERE au.email = 'testuser@example.com';
```

---

## Step 3: Test the Onboarding Process

### 3.1 Onboarding Steps

The onboarding has 7 steps:

1. **Profile** - Company name, phone number
2. **Membership** - Select membership tier
3. **Interests** - Choose areas of interest
4. **Location** - Select local chapter
5. **Photo** - Upload profile photo (optional)
6. **Payment** - Stripe checkout
7. **Complete** - Confirmation

### 3.2 Test Each Step

#### Step 1: Profile
- Enter company name
- Enter phone number
- Click "Next"

#### Step 2: Membership Tier
- Select a tier (Foundation, Professional, Executive, Enterprise)
- Click "Next"

#### Step 3: Interests
- Select at least one interest area
- Click "Next"

#### Step 4: Chapter Selection
- Choose a local chapter or "No local chapter"
- Click "Next"

#### Step 5: Photo Upload
- Optionally upload a profile photo
- Click "Next"

#### Step 6: Payment
- Click "Proceed to Payment"
- Complete Stripe checkout (use test card: `4242 4242 4242 4242`)
- Or skip if testing without payment

#### Step 7: Complete
- See success message
- Automatic redirect to `/pending-approval`

### 3.3 Verify Onboarding Completion

After completing onboarding, check the customers table:

```sql
SELECT 
  email,
  company,
  phone,
  membership_tier,
  onboarding_completed,
  approval_status
FROM public.customers
WHERE email = 'testuser@example.com';
```

Expected:
- `onboarding_completed` = `true`
- `approval_status` = `pending` (or `approved` if auto-approval is enabled)

---

## Step 4: Test Error Scenarios

### 4.1 Duplicate Email

1. Try signing up with the same email again
2. Expected: Error message "User already registered"

### 4.2 Invalid Password

1. Try signing up with a password less than 6 characters
2. Expected: Form validation error

### 4.3 Invalid Email Format

1. Try signing up with an invalid email
2. Expected: Form validation error

---

## Step 5: Clean Up Test Data

After testing, remove test accounts:

```sql
-- Delete from customers table first
DELETE FROM public.customers 
WHERE email = 'testuser@example.com';

-- Then delete from auth.users (requires admin privileges)
-- Go to Authentication → Users → Find user → Delete
```

Or via SQL (if you have service_role access):

```sql
-- Get the user ID first
SELECT id FROM auth.users WHERE email = 'testuser@example.com';

-- Delete from customers
DELETE FROM public.customers WHERE email = 'testuser@example.com';

-- Delete from auth.users (requires service_role or dashboard)
DELETE FROM auth.users WHERE email = 'testuser@example.com';
```

---

## Troubleshooting

### Issue: User created in auth.users but not in customers

**Cause:** The database trigger may not be set up, or RLS is blocking the insert.

**Solution:** 
1. Check if the trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. If missing, run the migration:
```sql
-- Run the contents of supabase/migrations/026_create_customer_on_signup.sql
```

### Issue: "Database error saving new user"

**Cause:** RLS policy blocking the insert.

**Solution:** Check RLS policies on customers table:
```sql
SELECT * FROM pg_policies WHERE tablename = 'customers';
```

### Issue: Onboarding not saving data

**Cause:** The update query may be using wrong ID field.

**Solution:** Check if the update uses `auth_id` vs `id`:
```sql
-- The correct query should use auth_id
UPDATE customers SET ... WHERE auth_id = '[user-uuid]';
```

---

## Summary Checklist

- [ ] Signup form submits successfully
- [ ] Console shows success logs with User ID
- [ ] User appears in auth.users table
- [ ] Customer record created in customers table
- [ ] auth_id links correctly between tables
- [ ] Onboarding redirects properly
- [ ] Each onboarding step saves data
- [ ] Payment flow works (with test card)
- [ ] Final redirect to pending-approval page
- [ ] Approval status is "pending"

---

## Test Credentials for Stripe

When testing payment:
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)
