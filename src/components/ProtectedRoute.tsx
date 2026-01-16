import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [memberStatus, setMemberStatus] = useState<{
    approvalStatus: string | null;
    subscriptionStatus: string | null;
    onboardingCompleted: boolean;
  } | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (user) {
      checkMemberStatus();
    } else {
      setCheckingStatus(false);
    }
  }, [user]);

  const checkMemberStatus = async () => {
    if (!user) {
      setCheckingStatus(false);
      return;
    }
    
    setCheckingStatus(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('approval_status, subscription_status, onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking member status:', error);
        setMemberStatus({ approvalStatus: 'approved', subscriptionStatus: 'active', onboardingCompleted: true });
      } else if (data) {
        setMemberStatus({
          approvalStatus: data.approval_status || 'approved',
          subscriptionStatus: data.subscription_status || 'pending',
          onboardingCompleted: data.onboarding_completed || false
        });
      }
    } catch (err) {
      console.error('Exception checking member status:', err);
      setMemberStatus({ approvalStatus: 'approved', subscriptionStatus: 'active', onboardingCompleted: true });
    } finally {
      setCheckingStatus(false);
    }
  };

  if (loading || checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Allow access to onboarding and pending-approval pages
  const allowedPaths = ['/onboarding', '/pending-approval', '/billing'];
  if (allowedPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  // Check if onboarding is incomplete - redirect to complete it
  if (!memberStatus?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  // Check subscription status - must have active subscription
  if (memberStatus?.subscriptionStatus !== 'active') {
    return <Navigate to="/onboarding" state={{ step: 6, message: 'Please complete payment to access member features.' }} replace />;
  }

  // Check approval status
  if (memberStatus?.approvalStatus === 'pending' || memberStatus?.approvalStatus === 'rejected') {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
}
