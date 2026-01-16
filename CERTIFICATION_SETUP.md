# Certification System Setup Instructions

## Database Migration

The certification system requires a new database table. Run the migration file to create it:

### Option 1: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/014_create_certifications.sql`
4. Paste and execute the SQL

### Option 2: Using Supabase CLI
```bash
supabase db push
```

## Database Schema

The `certifications` table includes:
- `id`: Unique identifier (UUID)
- `certificate_number`: Unique certificate number (e.g., NAREI-123456)
- `user_id`: Reference to auth.users
- `module_completions`: JSONB array of completed module IDs
- `scores`: JSONB object with module scores
- `certification_date`: When certification was completed
- `expiration_date`: When certification expires (1 year from completion)
- `status`: Current status (in_progress, completed, expired)

## Row Level Security (RLS)

The table has the following RLS policies:
1. Users can view their own certifications
2. Users can insert/update their own certifications
3. Anyone can view completed certifications (for public verification)

## Features Implemented

### Certification Portal (`/certification`)
- Loads user's certification progress from database
- Auto-creates certification record on first visit
- Saves module completions and scores to database
- Updates certification status when all modules complete
- Sets certification and expiration dates automatically

### Public Verification (`/verify-certification`)
- Queries real certification data by certificate number
- Shows member name, dates, and status
- Validates expiration dates
- Public access (no login required)

## Testing

1. Log in as a member
2. Navigate to Certification Portal
3. Complete modules (pass assessments with 80%+)
4. View your certificate number when all modules complete
5. Use the certificate number on `/verify-certification` to test public verification
