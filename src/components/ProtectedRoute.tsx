import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
  if (!user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  // Check subscription status - must have active subscription
  if (user.subscriptionStatus !== 'active') {
    return <Navigate to="/onboarding" state={{ step: 6, message: 'Please complete payment to access member features.' }} replace />;
  }

  // Check approval status
  if (user.approvalStatus === 'pending' || user.approvalStatus === 'rejected') {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
}
