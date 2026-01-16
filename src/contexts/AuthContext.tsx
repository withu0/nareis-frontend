import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
}
//
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['admin@nareis.org', 'rick@theraisegroup.com'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (authUser: User | null) => {
    if (!authUser) {
      setIsAdmin(false);
      return;
    }
    
    // Check hardcoded list first (fast check, no DB dependency)
    if (ADMIN_EMAILS.includes(authUser.email || '')) {
      console.log('[AUTH] ✅ Admin detected via hardcoded list:', authUser.email);
      setIsAdmin(true);
      return;
    }
    
    // For non-admin emails, check database role with timeout
    try {
      console.log('[AUTH] Checking database for admin role...');
      
      const queryPromise = supabase
        .from('customers')
        .select('role')
        .eq('auth_id', authUser.id)
        .maybeSingle();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Admin check timeout')), 3000)
      );
      
      const result: any = await Promise.race([queryPromise, timeoutPromise]);
      
      if (result?.error) {
        console.warn('[AUTH] ⚠️ Error checking admin role:', result.error.message);
        setIsAdmin(false);
        return;
      }
      
      if (result?.data?.role === 'admin') {
        console.log('[AUTH] ✅ Admin role found in database');
        setIsAdmin(true);
        return;
      }
      
      console.log('[AUTH] Regular member (not admin)');
      setIsAdmin(false);
    } catch (e: any) {
      console.warn('[AUTH] ⚠️ Admin check failed or timed out:', e.message);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    console.log('[AUTH] Initializing AuthProvider...');
    
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('[AUTH] Initial session check:', session ? 'Found' : 'None');
      setUser(session?.user ?? null);
      await checkAdminStatus(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH] Auth state changed:', event);
      setUser(session?.user ?? null);
      await checkAdminStatus(session?.user ?? null);
    });

    return () => {
      console.log('[AUTH] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[SIGNUP] Starting signup process');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[SIGNUP] Email:', email);
      console.log('[SIGNUP] Name:', fullName);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/onboarding`
        }
      });
      
      // CRITICAL DIAGNOSTIC: Check session state after signup
      console.log('[SIGNUP] Signup response received:');
      console.log('[SIGNUP]   User created:', !!data?.user);
      console.log('[SIGNUP]   User ID:', data?.user?.id);
      console.log('[SIGNUP]   Session provided:', !!data?.session);
      console.log('[SIGNUP]   Access token:', data?.session?.access_token ? 'YES' : 'NO');
      console.log('[SIGNUP]   Refresh token:', data?.session?.refresh_token ? 'YES' : 'NO');
      
      if (error) {
        console.error('[SIGNUP] ❌ Signup error:', error);
        return { data: null, error };
      }
      
      if (!data.user) {
        console.error('[SIGNUP] ❌ No user in response');
        return { data: null, error: { message: 'Failed to create user' } };
      }

      // Check if session persists after a delay
      setTimeout(async () => {
        const { data: checkSession } = await supabase.auth.getSession();
        console.log('[SIGNUP] Session check after 1s:', !!checkSession.session);
        if (!checkSession.session) {
          console.warn('[SIGNUP] ⚠️ WARNING: Session not persisting after signup!');
          console.warn('[SIGNUP] This may cause issues with Stripe redirect flow');
        } else {
          console.log('[SIGNUP] ✅ Session persisting correctly');
        }
      }, 1000);

      // Create customer record
      console.log('[SIGNUP] Creating customer record...');
      const nameParts = fullName.trim().split(' ');
      const customerData = {
        auth_id: data.user.id,
        email: email.toLowerCase(),
        full_name: fullName,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        approval_status: 'pending',
        membership_status: 'pending',
        membership_tier: 'foundation',
        role: 'member',
        created_at: new Date().toISOString()
      };
      
      console.log('[SIGNUP] Customer data:', {
        auth_id: customerData.auth_id,
        email: customerData.email,
        name: customerData.full_name
      });
      
      const { error: customerError } = await supabase
        .from('customers')
        .insert(customerData);
      
      if (customerError) {
        console.error('[SIGNUP] ❌ Customer creation error:', customerError);
        // Don't fail the signup if customer creation fails
        // The payment step will create it if needed
        console.warn('[SIGNUP] ⚠️ Continuing despite customer creation error');
      } else {
        console.log('[SIGNUP] ✅ Customer record created successfully');
      }
      
      console.log('[SIGNUP] ✅ Signup complete');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      return { data, error: null };
    } catch (error: any) {
      console.error('[SIGNUP] ❌ Exception during signup:', error);
      return { data: null, error: { message: error.message || 'Failed to create account' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('[AUTH] Signing in:', email);
    const result = await supabase.auth.signInWithPassword({ email, password });
    
    if (result.data.session) {
      console.log('[AUTH] ✅ Sign in successful');
      console.log('[AUTH] Session expires:', new Date(result.data.session.expires_at! * 1000).toISOString());
    } else {
      console.error('[AUTH] ❌ Sign in failed:', result.error);
    }
    
    return result;
  };

  const signOut = async () => {
    console.log('[AUTH] Signing out...');
    await supabase.auth.signOut();
    console.log('[AUTH] ✅ Signed out');
  };

  const resetPassword = async (email: string) => {
    console.log('[AUTH] Password reset requested for:', email);
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

// Named export for the hook - Fast Refresh compatible
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export { useAuth };