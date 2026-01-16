# Badge Analytics Setup Guide

## Overview
This guide explains how to set up the badge analytics tracking system in Supabase.

## Database Schema

### Table: badge_analytics
Tracks all badge downloads and customizations by members.

**Columns:**
- `id` (UUID, Primary Key) - Unique identifier
- `user_id` (UUID, Foreign Key) - References auth.users(id)
- `badge_type` (VARCHAR) - 'custom' or 'pre-made'
- `color_scheme` (VARCHAR) - Color scheme selected
- `badge_format` (VARCHAR) - 'social', 'website', or 'print'
- `company_name` (TEXT) - Company name on badge
- `member_since` (INTEGER) - Member since year
- `certification_level` (VARCHAR) - Certification level
- `downloaded_at` (TIMESTAMPTZ) - Download timestamp
- `created_at` (TIMESTAMPTZ) - Record creation timestamp

## Setup Instructions

### 1. Run Migrations
Execute the migration files in order:
```bash
# Run in Supabase SQL Editor
supabase/migrations/019_create_badge_analytics.sql
supabase/migrations/020_badge_analytics_rls.sql
```

### 2. Enable Real-time (Optional)
For live analytics updates in admin dashboard:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE badge_analytics;
```

### 3. Create Analytics View (Optional)
For aggregated analytics:
```sql
CREATE OR REPLACE VIEW badge_analytics_summary AS
SELECT
  COUNT(*) as total_downloads,
  COUNT(DISTINCT user_id) as unique_users,
  badge_type,
  color_scheme,
  badge_format,
  DATE_TRUNC('day', downloaded_at) as download_date
FROM badge_analytics
GROUP BY badge_type, color_scheme, badge_format, DATE_TRUNC('day', downloaded_at);

GRANT SELECT ON badge_analytics_summary TO authenticated;
```

## Security (RLS Policies)

1. **Users can insert** - Members can track their own downloads
2. **Users can view own** - Members see their download history
3. **Admins view all** - Admins access all analytics
4. **Admins can delete** - Admins manage analytics data

## Usage

The badge analytics system automatically tracks:
- Custom badge downloads with personalization
- Pre-made badge downloads
- Color scheme preferences
- Download format choices
- Member engagement metrics

Admin dashboard displays:
- Total downloads and unique users
- Badge type distribution
- Popular color schemes
- Format preferences
- Adoption rates
