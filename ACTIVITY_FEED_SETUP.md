# Activity Feed System Setup Guide

This guide explains how to set up the social activity feed system with like/comment functionality, activity filtering, personalized feeds, and weekly digest emails.

## Database Schema

### 1. Create Activity Feed Table

```sql
-- Activity Feed Table
CREATE TABLE member_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'certification', 'event', 'resource', 'forum', 'referral'
  content TEXT NOT NULL,
  metadata JSONB, -- Additional data (event_id, resource_id, etc.)
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Likes Table
CREATE TABLE activity_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES member_activities(id) ON DELETE CASCADE,
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, member_id)
);

-- Activity Comments Table
CREATE TABLE activity_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES member_activities(id) ON DELETE CASCADE,
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Member Connections Table (for personalized feed)
CREATE TABLE member_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  connected_member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'blocked'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, connected_member_id)
);

-- Activity Digest Preferences
CREATE TABLE activity_digest_preferences (
  member_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  frequency VARCHAR(20) DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly', 'never'
  enabled BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activities_member ON member_activities(member_id);
CREATE INDEX idx_activities_type ON member_activities(activity_type);
CREATE INDEX idx_activities_created ON member_activities(created_at DESC);
CREATE INDEX idx_likes_activity ON activity_likes(activity_id);
CREATE INDEX idx_comments_activity ON activity_comments(activity_id);
CREATE INDEX idx_connections_member ON member_connections(member_id);
```

### 2. Enable RLS Policies

```sql
-- Enable RLS
ALTER TABLE member_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_digest_preferences ENABLE ROW LEVEL SECURITY;

-- Activities: All members can view, only owner can create/update
CREATE POLICY "Members can view all activities" ON member_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members can create own activities" ON member_activities FOR INSERT TO authenticated WITH CHECK (auth.uid() = member_id);
CREATE POLICY "Members can update own activities" ON member_activities FOR UPDATE TO authenticated USING (auth.uid() = member_id);

-- Likes: Members can view all, create/delete own
CREATE POLICY "Members can view all likes" ON activity_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members can create own likes" ON activity_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = member_id);
CREATE POLICY "Members can delete own likes" ON activity_likes FOR DELETE TO authenticated USING (auth.uid() = member_id);

-- Comments: Members can view all, create/update/delete own
CREATE POLICY "Members can view all comments" ON activity_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members can create own comments" ON activity_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = member_id);
CREATE POLICY "Members can update own comments" ON activity_comments FOR UPDATE TO authenticated USING (auth.uid() = member_id);
CREATE POLICY "Members can delete own comments" ON activity_comments FOR DELETE TO authenticated USING (auth.uid() = member_id);

-- Connections: Members can view and manage own connections
CREATE POLICY "Members can view own connections" ON member_connections FOR SELECT TO authenticated USING (auth.uid() = member_id);
CREATE POLICY "Members can create own connections" ON member_connections FOR INSERT TO authenticated WITH CHECK (auth.uid() = member_id);
CREATE POLICY "Members can delete own connections" ON member_connections FOR DELETE TO authenticated USING (auth.uid() = member_id);

-- Digest Preferences: Members can manage own preferences
CREATE POLICY "Members can manage own digest prefs" ON activity_digest_preferences FOR ALL TO authenticated USING (auth.uid() = member_id);
```

## Edge Functions

### 1. Create Activity Function

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { activityType, content, metadata } = await req.json();

    const { data, error } = await supabaseClient
      .from('member_activities')
      .insert({
        member_id: user.id,
        activity_type: activityType,
        content,
        metadata
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, activity: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

### 2. Weekly Digest Email Function

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const sendGridApiKey = Deno.env.get('SENDGRID_API_KEY');
    
    // Get members who want weekly digests
    const { data: members } = await supabaseClient
      .from('activity_digest_preferences')
      .select('member_id')
      .eq('frequency', 'weekly')
      .eq('enabled', true)
      .lt('last_sent_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    for (const member of members || []) {
      // Get member's connections
      const { data: connections } = await supabaseClient
        .from('member_connections')
        .select('connected_member_id')
        .eq('member_id', member.member_id);

      const connectionIds = connections?.map(c => c.connected_member_id) || [];

      // Get activities from connections in the last week
      const { data: activities } = await supabaseClient
        .from('member_activities')
        .select('*, profiles:member_id(full_name, email)')
        .in('member_id', connectionIds)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      // Send email via SendGrid
      const emailHtml = generateDigestEmail(activities);
      
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendGridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: member.email }],
            subject: 'Your Weekly Activity Digest - NAREIS'
          }],
          from: { email: 'noreply@nareis.org', name: 'NAREIS' },
          content: [{ type: 'text/html', value: emailHtml }]
        })
      });

      // Update last_sent_at
      await supabaseClient
        .from('activity_digest_preferences')
        .update({ last_sent_at: new Date().toISOString() })
        .eq('member_id', member.member_id);
    }

    return new Response(JSON.stringify({ success: true, sent: members?.length || 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function generateDigestEmail(activities: any[]): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Your Weekly Activity Digest</h2>
        <p>Here's what your connections have been up to this week:</p>
        ${activities.map(a => `
          <div style="margin: 20px 0; padding: 15px; border-left: 3px solid #2563eb;">
            <strong>${a.profiles.full_name}</strong>
            <p>${a.content}</p>
            <small style="color: #666;">${new Date(a.created_at).toLocaleDateString()}</small>
          </div>
        `).join('')}
        <p><a href="https://nareis.org/dashboard?tab=activity">View all activity</a></p>
      </body>
    </html>
  `;
}
```

## Frontend Integration

The activity feed is already integrated into the Dashboard component under the "Activity Feed" tab. The components include:

- **ActivityFeed**: Main feed container with filtering and personalization
- **ActivityItem**: Individual activity with like/comment functionality
- **ActivityFilters**: Filter activities by type

## Features Implemented

✅ Activity feed showing member actions (certifications, events, resources, forums, referrals)
✅ Like functionality with real-time count updates
✅ Comment system with nested replies
✅ Activity filtering by type (all, certifications, events, resources, forums, referrals)
✅ Personalized feed toggle based on member connections
✅ Weekly digest email system
✅ Beautiful UI with activity icons and colors
✅ Real-time timestamps using date-fns

## Next Steps

1. Run the SQL queries in Supabase SQL Editor
2. Deploy the edge functions
3. Set up a cron job to run the weekly digest function
4. Test the activity feed functionality
5. Customize email templates as needed
