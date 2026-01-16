# Admin Delete User Edge Function Setup

Since the automated deployment failed, you'll need to manually create this edge function in your Supabase dashboard.

## Steps to Create the Edge Function

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Edge Functions** in the left sidebar
4. Click **New Function**
5. Name it: `admin-delete-user`
6. Paste the following code:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(url, key, { 
      auth: { autoRefreshToken: false, persistSession: false } 
    });

    // Verify authorization
    const auth = req.headers.get('Authorization');
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Get the calling user
    const { data: { user: caller } } = await admin.auth.getUser(auth.replace('Bearer ', ''));
    if (!caller) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Check if caller is admin
    const { data: c } = await admin.from('customers').select('role').eq('auth_id', caller.id).single();
    const isAdmin = c?.role === 'admin' || 
                   caller.email === 'rick@theraisegroup.com' || 
                   caller.email === 'admin@nareis.org';
    
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { 
        status: 403, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Get user to delete
    const { userId, email } = await req.json();
    let uid = userId;

    // If email provided, look up the user ID
    if (!uid && email) {
      const { data: { users } } = await admin.auth.admin.listUsers();
      uid = users?.find(u => u.email === email)?.id;
      if (!uid) {
        return new Response(JSON.stringify({ error: 'User not found with that email' }), { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    }

    if (!uid) {
      return new Response(JSON.stringify({ error: 'userId or email required' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Delete from customers table first (cleanup)
    await admin.from('customers').delete().eq('auth_id', uid);

    // Delete from auth.users
    const { error: deleteError } = await admin.auth.admin.deleteUser(uid);
    if (deleteError) throw deleteError;

    return new Response(JSON.stringify({ success: true, message: 'User deleted successfully' }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
```

7. Click **Deploy**

## Usage

Once deployed, you can use the "Delete Auth User" button in the Admin Panel > Member Management section.

Enter the email address of the test account you want to delete (e.g., `rick@theraisegroup.com` or `admin@nareis.org`) and click "Delete User Permanently".

This will:
1. Delete the user from the `customers` table
2. Delete the user from `auth.users` table

After deletion, you can re-test the signup flow with a fresh account.

## Security

The function checks:
- Valid authorization token
- Caller must be an admin (role='admin' in customers table OR one of the hardcoded admin emails)
