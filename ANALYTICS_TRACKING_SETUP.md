# Real-Time Analytics Tracking System Setup

## Overview
Comprehensive analytics tracking system that captures impressions, clicks, device, browser, location, and demographic data for advertisements.

## Database Schema

Run this SQL in Supabase SQL Editor:

```sql
-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES advertisements(id) ON DELETE CASCADE,
  advertiser_id UUID NOT NULL REFERENCES advertisers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'click')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  age_group TEXT,
  gender TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_analytics_ad_id ON analytics_events(ad_id);
CREATE INDEX idx_analytics_advertiser_id ON analytics_events(advertiser_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Advertisers view own analytics"
  ON analytics_events FOR SELECT
  USING (advertiser_id = auth.uid());

CREATE POLICY "Anyone can insert analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (true);
```

## Features Implemented

1. **Automatic Tracking**: AdBanner and AdCard components automatically track impressions on mount and clicks on interaction
2. **Device Detection**: Detects Desktop, Mobile, Tablet
3. **Browser Detection**: Chrome, Firefox, Safari, Edge
4. **OS Detection**: Windows, macOS, Linux, Android, iOS
5. **Data Aggregation**: analyticsService.ts aggregates data by date, device, browser, location, demographics
6. **Real-Time Dashboard**: AdvancedAdvertiserAnalytics page displays live data with Recharts visualizations

## Files Modified

- `src/lib/adTracking.ts` - Core tracking utility
- `src/lib/analyticsService.ts` - Data aggregation service
- `src/components/ads/AdBanner.tsx` - Added impression/click tracking
- `src/components/ads/AdCard.tsx` - Added impression/click tracking
- `src/pages/AdvancedAdvertiserAnalytics.tsx` - Integrated real analytics data

## Usage

Tracking happens automatically when ads are displayed. The system:
1. Tracks impression when ad component mounts
2. Tracks click when user clicks the ad
3. Stores device, browser, OS, referrer data
4. Aggregates data for dashboard display

## Next Steps

1. Deploy edge function for server-side IP geolocation
2. Add demographic data collection (requires user profiles)
3. Implement real-time dashboard updates with Supabase realtime subscriptions
