import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with proper session persistence
const supabaseUrl = 'https://qkwaywkacqjjkkfogvtm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrd2F5d2thY3FqamtrZm9ndnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTg5MDUsImV4cCI6MjA4MDc3NDkwNX0.rvLMX0BxFUnN380ENYF66tEIpuOibHDUnlq8jiisTzA';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}
//
// CRITICAL: Configure session persistence for external redirects (like Stripe)
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Use localStorage for session persistence (survives redirects)
    storage: window.localStorage,
    // Storage key - consistent across the app
    storageKey: 'nareis-auth-token',
    // Automatically refresh sessions before they expire
    autoRefreshToken: true,
    // Persist session across browser tabs and page reloads
    persistSession: true,
    // Detect session in URL after OAuth/redirect flows
    detectSessionInUrl: true,
    // Use PKCE flow for better security in SPAs
    flowType: 'pkce',
  },
});

// Debug session state changes (helpful for troubleshooting)
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔔 Supabase Auth Event:', event);
  console.log('   Session exists:', !!session);
  
  if (session) {
    console.log('   User:', session.user.email);
    console.log('   Expires:', new Date(session.expires_at! * 1000).toISOString());
  }
  
  // Ensure session is properly stored in localStorage
  if (event === 'SIGNED_IN' && session) {
    try {
      const storageKey = 'nareis-auth-token';
      const existingData = localStorage.getItem(storageKey);
      
      if (!existingData) {
        console.warn('⚠️ Session not in localStorage after SIGNED_IN event');
        console.log('💾 Manually saving session to localStorage');
        
        localStorage.setItem(storageKey, JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
          expires_in: session.expires_in,
          token_type: session.token_type,
          user: session.user
        }));
        
        console.log('✅ Session manually saved');
      } else {
        console.log('✅ Session already in localStorage');
      }
    } catch (e) {
      console.error('❌ Error checking/saving session:', e);
    }
  }
  
  if (event === 'SIGNED_OUT') {
    console.log('👋 User signed out');
  }
  
  if (event === 'TOKEN_REFRESHED') {
    console.log('🔄 Token refreshed successfully');
  }
});

// Debug helper function
export const debugSession = async () => {
  console.log('\n🔍 SESSION DEBUG');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  console.log('Session exists:', !!session);
  if (session) {
    console.log('User ID:', session.user.id);
    console.log('Email:', session.user.email);
    console.log('Expires at:', new Date(session.expires_at! * 1000).toISOString());
    console.log('Time until expiry:', Math.floor((session.expires_at! * 1000 - Date.now()) / 1000 / 60), 'minutes');
    console.log('Access token present:', !!session.access_token);
    console.log('Refresh token present:', !!session.refresh_token);
  } else {
    console.log('No session found');
    if (error) {
      console.error('Session error:', error);
    }
  }
  
  // Check localStorage
  const storageKey = 'nareis-auth-token';
  const storedData = localStorage.getItem(storageKey);
  console.log('localStorage key exists:', !!storedData);
  
  if (storedData) {
    try {
      const parsed = JSON.parse(storedData);
      console.log('localStorage session valid:', !!parsed?.access_token);
      console.log('localStorage user:', parsed?.user?.email);
    } catch (e) {
      console.error('localStorage parse error:', e);
    }
  }
  
  // Check all auth-related keys in localStorage
  const authKeys = Object.keys(localStorage).filter(k => 
    k.includes('auth') || k.includes('supabase') || k.includes('nareis')
  );
  console.log('All auth-related keys:', authKeys);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  return { session, error };
};

export { supabase };