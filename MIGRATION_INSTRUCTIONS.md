# Database Migration Instructions

## How to Run These Migrations

Since the Supabase connection is timing out, please run these migrations manually:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to the SQL Editor (left sidebar)
4. Run each migration file in order:

### Order of Execution:
1. `001_create_core_tables.sql` - Updates customers table
2. `002_create_chapters.sql` - Creates chapters and chapter_members
3. `003_create_events.sql` - Creates events and registrations
4. `004_create_resources.sql` - Creates resources and downloads
5. `005_create_forums.sql` - Creates forum posts and comments
6. `006_create_referrals.sql` - Creates referrals table
7. `007_create_advocacy.sql` - Creates advocacy campaigns
8. `008_enable_rls.sql` - Enables RLS and basic policies
9. `009_rls_events.sql` - RLS for events
10. `010_rls_resources.sql` - RLS for resources
11. `011_rls_forums_referrals.sql` - RLS for forums, referrals, advocacy

## After Running Migrations

Your database will have:
- Complete schema with all relationships
- Row Level Security enabled
- Proper indexes for performance
- Foreign key constraints

The signup should now work correctly with the database schema in place.
