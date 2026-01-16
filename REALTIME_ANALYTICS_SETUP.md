# Real-Time Analytics Setup Guide

This guide explains how to set up and use the real-time analytics tracking system for the advertiser portal.

## Features Implemented

1. **Real-Time Event Tracking**: Automatic capture of impressions and clicks
2. **Live Dashboard Updates**: Supabase realtime subscriptions update analytics instantly
3. **Live Activity Feed**: Shows recent ad interactions in real-time
4. **Visual Notifications**: Toast notifications when ads receive clicks
5. **Auto-Refresh**: Dashboard metrics refresh every 10 seconds
6. **Live Counters**: Impression and click counters increment automatically

## Database Setup

The analytics_events table should already be created from ANALYTICS_TRACKING_SETUP.md. Ensure Supabase Realtime is enabled:

```sql
-- Enable realtime for analytics_events table
ALTER PUBLICATION supabase_realtime ADD TABLE analytics_events;
```

## How It Works

### 1. Automatic Event Tracking
- AdBanner and AdCard components automatically track impressions on mount
- Click events are tracked when users interact with ads
- Device, browser, location data captured automatically

### 2. Real-Time Subscriptions
The AdvancedAdvertiserAnalytics page subscribes to database changes:
- Listens for new INSERT events on analytics_events table
- Filters by advertiser_id to show only relevant events
- Triggers toast notifications for new clicks
- Automatically refreshes analytics data

### 3. Live Activity Feed
The RealTimeAnalytics component:
- Shows live counters for impressions, clicks, and CTR
- Displays recent activity with event type, device, and location
- Updates instantly when new events occur
- Shows "Live" indicator with pulse animation

### 4. Auto-Refresh
- Dashboard refreshes every 10 seconds automatically
- Charts update dynamically with new data
- No page reload required

## Usage

1. **For Advertisers**: Navigate to Advanced Analytics page
2. **View Live Data**: See real-time counters and activity feed
3. **Receive Notifications**: Get toast alerts when ads are clicked
4. **Monitor Performance**: Watch charts update as events occur

## Testing Real-Time Features

1. Open advertiser analytics dashboard
2. In another tab/browser, visit pages with ads
3. Click on ads to generate events
4. Watch the analytics dashboard update in real-time
5. Verify toast notifications appear for clicks

## Performance Considerations

- Realtime subscriptions use WebSocket connections
- Auto-refresh interval set to 10 seconds (adjustable)
- Activity feed limited to 10 most recent events
- Efficient filtering by advertiser_id reduces data transfer

## Troubleshooting

If real-time updates aren't working:
1. Check Supabase realtime is enabled for analytics_events table
2. Verify RLS policies allow reading analytics_events
3. Check browser console for WebSocket connection errors
4. Ensure advertiser_id is correctly set in events
5. Verify Supabase project has realtime enabled

## Future Enhancements

- Add sound notifications for high-value clicks
- Implement real-time budget tracking
- Add live competitor comparison
- Create real-time alerts for performance thresholds
- Add geographic heat map with live updates
