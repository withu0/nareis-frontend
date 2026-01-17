import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['admin@nareis.org', 'rick@theraisegroup.com'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = (authUser: User | null) => {
    if (!authUser) {
      setIsAdmin(false);
      return;
    }
    
    // Check hardcoded list or role from user object
    if (ADMIN_EMAILS.includes(authUser.email) || authUser.role === 'admin') {
      console.log('[AUTH] ✅ Admin detected:', authUser.email);
      setIsAdmin(true);
      return;
    }
    
    setIsAdmin(false);
  };

  useEffect(() => {
    console.log('[AUTH] Initializing AuthProvider...');
    
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          if (response.data?.user) {
            const userData = response.data.user;
            setUser(userData);
            checkAdminStatus(userData);
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch (error) {
          console.error('[AUTH] Failed to get current user:', error);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('[SIGNUP] Starting signup process');
      console.log('[SIGNUP] Email:', email);
      console.log('[SIGNUP] Name:', fullName);
      
      const response = await authAPI.signup(email, password, fullName);
      
      if (response.error) {
        console.error('[SIGNUP] ❌ Signup error:', response.error);
        return { data: null, error: { message: response.error } };
      }
      
      if (response.data?.user) {
        const userData = response.data.user;
        setUser(userData);
        checkAdminStatus(userData);
        console.log('[SIGNUP] ✅ Signup complete');
        return { data: { user: userData }, error: null };
      }
      
      return { data: null, error: { message: 'Failed to create user' } };
    } catch (error: any) {
      console.error('[SIGNUP] ❌ Exception during signup:', error);
      return { data: null, error: { message: error.message || 'Failed to create account' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[AUTH] Signing in:', email);
      const response = await authAPI.login(email, password);
      
      if (response.error) {
        console.error('[AUTH] ❌ Sign in failed:', response.error);
        return { data: null, error: { message: response.error } };
      }
      
      if (response.data?.user) {
        const userData = response.data.user;
        setUser(userData);
        checkAdminStatus(userData);
        console.log('[AUTH] ✅ Sign in successful');
        return { data: { user: userData, session: { access_token: response.data.token } }, error: null };
      }
      
      return { data: null, error: { message: 'Login failed' } };
    } catch (error: any) {
      console.error('[AUTH] ❌ Sign in exception:', error);
      return { data: null, error: { message: error.message || 'Failed to login' } };
    }
  };

  const signOut = async () => {
    console.log('[AUTH] Signing out...');
    await authAPI.logout();
    setUser(null);
    setIsAdmin(false);
    console.log('[AUTH] ✅ Signed out');
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('[AUTH] Password reset requested for:', email);
      const response = await authAPI.forgotPassword(email);
      return response;
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Failed to send reset email' } };
    }
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