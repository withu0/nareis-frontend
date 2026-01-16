# Admin Access Verification Checklist

## Pre-requisites Completed
- [x] Created admin@nareis.org account
- [x] Updated customers table with `role='admin'`
- [x] AuthContext updated to check both hardcoded emails AND database role

## Admin Access Methods
The system now supports TWO ways to grant admin access:

### Method 1: Hardcoded Email List (Immediate)
These emails automatically have admin access:
- admin@nareis.org
- admin@example.com
- rick.delgiorno@gmail.com
- rick@theraisegroup.com

### Method 2: Database Role (Flexible)
Run this SQL to grant any user admin access:
```sql
UPDATE customers SET role='admin' WHERE email='user@example.com';
```

## Verification Steps

### 1. Login Test
1. Go to `/login`
2. Enter: admin@nareis.org
3. Enter password
4. Should redirect to dashboard

### 2. Admin Access Test
1. Navigate to `/admin`
2. Should see Admin Dashboard (not redirected)
3. Verify "Welcome, admin@nareis.org" displays

### 3. Feature Verification

#### Real-Time Analytics Tab
- [ ] Live visitor count displays
- [ ] Active sessions chart works
- [ ] Real-time events stream

#### Overview Tab (Analytics Dashboard)
- [ ] Charts render correctly
- [ ] Date filters work
- [ ] Export functionality available

#### Users Tab (Member Management)
- [ ] User list loads
- [ ] Search/filter works
- [ ] Edit user functionality
- [ ] Delete user functionality

#### Operations Tab (Applications)
- [ ] Pending applications display
- [ ] Approve/reject buttons work
- [ ] Application details viewable

#### CMS Tab (Content Management)
- [ ] Content list displays
- [ ] Edit content works
- [ ] Add new content works

#### Revenue Tab
- [ ] Revenue charts display
- [ ] Subscription data shows
- [ ] Payment history available

#### Badges Tab
- [ ] Badge analytics display
- [ ] Badge distribution charts
- [ ] Member badge stats

#### Settings Tab
- [ ] Bulk email form works
- [ ] Broadcast notifications work
- [ ] Email templates available

## Troubleshooting

### "Access Denied" or Redirect to Dashboard
1. Check browser console for errors
2. Verify email in customers table:
```sql
SELECT email, role FROM customers WHERE email='admin@nareis.org';
```
3. Clear browser cache and re-login

### Features Not Loading
1. Check Supabase connection in browser console
2. Verify RLS policies allow admin access
3. Check if required tables exist

### Database Connection Issues
Run migrations if tables missing:
```sql
-- Check if customers table exists
SELECT * FROM customers LIMIT 1;
```

## Quick SQL Verification
```sql
-- Verify admin user exists with correct role
SELECT id, email, role, approval_status, membership_status 
FROM customers 
WHERE email = 'admin@nareis.org';

-- Expected result:
-- role: 'admin'
-- approval_status: 'approved' (or null)
-- membership_status: 'active' (or null)
```
