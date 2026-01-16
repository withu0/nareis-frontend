# Grant Admin Access to admin@nareis.org

## Run This SQL in Supabase

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this query:

```sql
-- Grant admin role to admin@nareis.org
UPDATE customers 
SET role = 'admin' 
WHERE email = 'admin@nareis.org';
```

3. Verify the update worked:

```sql
-- Verify admin role was set
SELECT id, email, full_name, role, auth_id, created_at 
FROM customers 
WHERE email = 'admin@nareis.org';
```

## Expected Result

| email | role |
|-------|------|
| admin@nareis.org | admin |

## After Granting Admin Access

1. **Log out** if currently logged in
2. **Log back in** with admin@nareis.org
3. **Navigate to** `/admin` - you should now have full admin access
4. **Verify** you can see all admin tabs: Dashboard, Users, Events, Content, etc.

## Troubleshooting

If admin access doesn't work after the update:

```sql
-- Check the current role value
SELECT email, role FROM customers WHERE email = 'admin@nareis.org';

-- If role is NULL or different, update again
UPDATE customers SET role = 'admin' WHERE email = 'admin@nareis.org';

-- Confirm the change
SELECT email, role FROM customers WHERE email = 'admin@nareis.org';
```

## Note

The admin role grants access to:
- User management
- Event management  
- Content management
- Analytics dashboard
- Broadcast notifications
- All other admin features
