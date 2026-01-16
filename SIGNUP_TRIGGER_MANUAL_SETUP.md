# Manual Setup: Signup Trigger for Customer Records

The database connection is currently timing out. Please run this SQL manually in your Supabase Dashboard.

## Steps:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Create a new query and paste the following SQL:

```sql
-- Create trigger function for automatic customer record creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (
    auth_id,
    email,
    full_name,
    first_name,
    last_name,
    approval_status,
    membership_status,
    membership_tier,
    role,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 1),
    CASE 
      WHEN POSITION(' ' IN COALESCE(NEW.raw_user_meta_data->>'full_name', '')) > 0 
      THEN SUBSTRING(NEW.raw_user_meta_data->>'full_name' FROM POSITION(' ' IN NEW.raw_user_meta_data->>'full_name') + 1)
      ELSE ''
    END,
    'pending',
    'pending',
    'foundation',
    'member',
    NOW()
  )
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

4. Click **Run** to execute the query

## What This Does:

- Creates a trigger that fires whenever a new user signs up via Supabase Auth
- Automatically creates a corresponding record in the `customers` table
- Links the customer record to the auth user via `auth_id`
- Extracts first/last name from the full_name metadata
- Sets default values for approval_status, membership_status, etc.

## Verification:

After running the SQL, test by:
1. Creating a new user account via the signup form
2. Check the `customers` table - a new record should appear automatically
