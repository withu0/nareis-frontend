# Admin Broadcast Notification System Setup

## Overview
The admin broadcast notification system allows administrators to send notifications to all members or specific segments, schedule notifications, preview before sending, and track delivery/read rates.

## Database Schema

### 1. Create broadcast_notifications table
```sql
CREATE TABLE broadcast_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  recipient_type TEXT NOT NULL, -- 'all', 'bronze', 'silver', 'gold', 'platinum', 'chapter'
  recipient_filter JSONB, -- Additional filters for custom segments
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sent', 'failed'
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE broadcast_notifications ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins can manage broadcast notifications"
  ON broadcast_notifications
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

### 2. Create broadcast_notification_recipients table
```sql
CREATE TABLE broadcast_notification_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broadcast_id UUID REFERENCES broadcast_notifications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  delivered BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(broadcast_id, user_id)
);

-- Enable RLS
ALTER TABLE broadcast_notification_recipients ENABLE ROW LEVEL SECURITY;

-- Users can view their own recipient records
CREATE POLICY "Users can view their own recipient records"
  ON broadcast_notification_recipients
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can manage all recipient records
CREATE POLICY "Admins can manage recipient records"
  ON broadcast_notification_recipients
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

### 3. Create notification_templates table
```sql
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- Admins can manage templates
CREATE POLICY "Admins can manage templates"
  ON notification_templates
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

## Edge Function: broadcast-notification

Create an edge function to handle sending broadcast notifications:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { broadcastId } = await req.json();

    // Get broadcast details
    const { data: broadcast } = await supabase
      .from('broadcast_notifications')
      .select('*')
      .eq('id', broadcastId)
      .single();

    if (!broadcast) {
      throw new Error('Broadcast not found');
    }

    // Get recipients based on filters
    let query = supabase.from('members').select('user_id, email');
    
    if (broadcast.recipient_type !== 'all') {
      query = query.eq('membership_tier', broadcast.recipient_type);
    }

    const { data: recipients } = await query;

    // Create recipient records
    const recipientRecords = recipients.map(r => ({
      broadcast_id: broadcastId,
      user_id: r.user_id,
      delivered: true,
      delivered_at: new Date().toISOString()
    }));

    await supabase
      .from('broadcast_notification_recipients')
      .insert(recipientRecords);

    // Create in-app notifications
    const notifications = recipients.map(r => ({
      user_id: r.user_id,
      type: 'announcement',
      title: broadcast.title,
      message: broadcast.message,
      link: broadcast.link,
      read: false
    }));

    await supabase.from('notifications').insert(notifications);

    // Update broadcast status
    await supabase
      .from('broadcast_notifications')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', broadcastId);

    return new Response(
      JSON.stringify({ success: true, recipientCount: recipients.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

## Features Implemented

### 1. Broadcast Composition
- Select recipients (all members, by tier, by chapter)
- Compose title and message
- Add optional links
- Schedule for later delivery
- Preview before sending

### 2. Notification Templates
- Pre-built templates for common announcements
- Categories: Welcome, Events, Education, Membership, Resources, Chapters
- One-click template selection

### 3. Delivery Tracking
- Real-time analytics dashboard
- Metrics: Total sent, delivered, read, scheduled
- Individual notification performance
- Delivery rate and read rate percentages
- Progress bars for visual tracking

### 4. Preview Functionality
- See exactly how notification will appear
- Modal preview matching actual notification design
- Test before sending to all members

## Usage

1. Navigate to Admin Dashboard → Notifications tab
2. Compose a new notification or select a template
3. Choose recipient segment
4. Preview the notification
5. Send immediately or schedule for later
6. Track delivery and read rates in the Tracking tab

## Next Steps

1. Deploy the database schema using the SQL commands above
2. Create and deploy the broadcast-notification edge function
3. Set up scheduled job for sending scheduled notifications
4. Configure email notifications for offline members (optional)
5. Add file attachment support via Supabase Storage
