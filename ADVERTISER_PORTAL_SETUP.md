# Advertiser Portal Setup Guide

## Overview
Complete public-facing advertiser portal allowing external companies to sign up, create ads, upload creatives, make payments, and view analytics without admin intervention.

## Database Setup

### 1. Create Advertisers Table
```sql
CREATE TABLE advertisers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  website TEXT,
  billing_address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_advertisers_email ON advertisers(email);
```

### 2. Create Ad Creatives Table
```sql
CREATE TABLE ad_creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID REFERENCES advertisers(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ad_creatives_advertiser ON ad_creatives(advertiser_id);
```

### 3. Update Advertisements Table
```sql
ALTER TABLE advertisements 
ADD COLUMN advertiser_id UUID REFERENCES advertisers(id) ON DELETE SET NULL,
ADD COLUMN creative_url TEXT;

CREATE INDEX idx_advertisements_advertiser ON advertisements(advertiser_id);
```

### 4. Enable RLS
```sql
ALTER TABLE advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_creatives ENABLE ROW LEVEL SECURITY;

-- Advertisers can view/update their own data
CREATE POLICY "Advertisers view own data" ON advertisers FOR SELECT USING (true);
CREATE POLICY "Advertisers update own data" ON advertisers FOR UPDATE USING (true);

-- Ad creatives policies
CREATE POLICY "Advertisers view own creatives" ON ad_creatives FOR SELECT USING (true);
CREATE POLICY "Advertisers insert own creatives" ON ad_creatives FOR INSERT WITH CHECK (true);
CREATE POLICY "Advertisers delete own creatives" ON ad_creatives FOR DELETE USING (true);
```

## Edge Functions

### 1. Advertiser Signup Function
Deploy as `advertiser-signup`:
```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { company_name, email, password, contact_name, phone, website } = await req.json();

    // Hash password
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const password_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const response = await fetch(`${supabaseUrl}/rest/v1/advertisers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ company_name, email, password_hash, contact_name, phone, website })
    });

    const data_result = await response.json();
    if (!response.ok) throw new Error(data_result.message || 'Failed to create account');

    return new Response(JSON.stringify({ success: true, advertiser: data_result[0] }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
```

### 2. Advertiser Login Function
Deploy as `advertiser-login`:
```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { email, password } = await req.json();

    // Hash password
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const password_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/advertisers?email=eq.${email}&password_hash=eq.${password_hash}`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );

    const advertisers = await response.json();
    if (!advertisers || advertisers.length === 0) {
      throw new Error('Invalid credentials');
    }

    return new Response(JSON.stringify({ success: true, advertiser: advertisers[0] }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
```

## Features Implemented

### Frontend Pages
1. **AdvertiserSignup** (`/advertiser/signup`)
   - Company information form
   - Contact details
   - Account creation

2. **AdvertiserLogin** (`/advertiser/login`)
   - Email/password authentication
   - Session management

3. **AdvertiserDashboard** (`/advertiser/dashboard`)
   - Real-time analytics (impressions, clicks, CTR)
   - Campaign management
   - Create new ads with payment
   - View all campaigns with status

### Components
1. **AdCreativeUpload**
   - File upload with preview
   - 5MB size limit
   - Image validation
   - Base64 encoding for storage

2. **CreateAdForm**
   - Campaign details
   - Ad type selection (display, video, native)
   - Placement selection with pricing
   - Date range picker
   - Budget calculator
   - Target URL input

### Pricing Structure
- **Sidebar**: $100/day
- **Banner**: $200/day
- **Homepage**: $300/day
- **Featured**: $500/day

### Payment Integration
- Stripe Checkout integration
- Automatic budget calculation
- Payment metadata includes ad_id
- Redirect to Stripe payment page

## Usage Flow

1. **Advertiser Signs Up**
   - Visit `/advertiser/signup`
   - Fill company and contact information
   - Account created with 'active' status

2. **Advertiser Logs In**
   - Visit `/advertiser/login`
   - Enter email and password
   - Redirected to dashboard

3. **Create Advertisement**
   - Click "Create Ad" button
   - Fill campaign details
   - Upload creative asset
   - Select placement and dates
   - Review budget calculation
   - Click "Continue to Payment"
   - Complete Stripe checkout
   - Ad submitted with 'pending' status

4. **Admin Reviews**
   - Admin sees pending ad in `/admin/advertisements`
   - Reviews creative and details
   - Approves or rejects
   - If approved, status changes to 'active'

5. **Ad Goes Live**
   - Active ads display on site
   - Click tracking increments metrics
   - Advertiser sees real-time analytics

6. **View Performance**
   - Dashboard shows all campaigns
   - Real-time impressions and clicks
   - CTR calculation
   - Total spend tracking

## Navigation Integration
- "Advertise With Us" button added to main navigation
- Visible to non-logged-in users
- Links to `/advertiser/signup`

## Storage
- Storage bucket `ad-creatives` created
- Public access enabled
- Stores uploaded creative assets

## Next Steps
1. Deploy edge functions to production
2. Test complete signup → payment → approval flow
3. Configure Stripe webhook for payment confirmation
4. Add email notifications for ad approval/rejection
5. Implement advertiser password reset
6. Add advertiser profile management
7. Create detailed analytics reports (date ranges, exports)
