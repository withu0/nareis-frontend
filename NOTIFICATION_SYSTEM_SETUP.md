# Notification System Setup Guide

## Database Tables

### 1. Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('message', 'event', 'forum', 'resource', 'certification', 'referral', 'announcement')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

### 2. Notification Preferences Table
```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  messages_email BOOLEAN DEFAULT TRUE,
  messages_push BOOLEAN DEFAULT TRUE,
  messages_in_app BOOLEAN DEFAULT TRUE,
  events_email BOOLEAN DEFAULT TRUE,
  events_push BOOLEAN DEFAULT TRUE,
  events_in_app BOOLEAN DEFAULT TRUE,
  forums_email BOOLEAN DEFAULT FALSE,
  forums_push BOOLEAN DEFAULT TRUE,
  forums_in_app BOOLEAN DEFAULT TRUE,
  resources_email BOOLEAN DEFAULT FALSE,
  resources_push BOOLEAN DEFAULT FALSE,
  resources_in_app BOOLEAN DEFAULT TRUE,
  certifications_email BOOLEAN DEFAULT TRUE,
  certifications_push BOOLEAN DEFAULT TRUE,
  certifications_in_app BOOLEAN DEFAULT TRUE,
  referrals_email BOOLEAN DEFAULT TRUE,
  referrals_push BOOLEAN DEFAULT TRUE,
  referrals_in_app BOOLEAN DEFAULT TRUE,
  announcements_email BOOLEAN DEFAULT TRUE,
  announcements_push BOOLEAN DEFAULT TRUE,
  announcements_in_app BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Edge Function: send-notification-email

Deploy this function to handle email notifications when users are offline.

The function uses the SENDGRID_API_KEY environment variable (already configured).

## Features Implemented

- ✅ Notification bell icon with unread count badge
- ✅ Notification center with tabs (All, Unread, Messages, Events)
- ✅ Notification preferences with email/push/in-app toggles
- ✅ Mark as read/unread functionality
- ✅ Notification grouping by type
- ✅ Click notifications to navigate to relevant pages
- ✅ Beautiful UI with icons for each notification type
- ✅ Ready for database integration
