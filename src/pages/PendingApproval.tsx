import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Clock, XCircle, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PendingApproval() {
  const { user, signOut } = useAuth();
  const [memberData, setMemberData] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check for payment success
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success') {
      toast({ title: 'Payment Successful!', description: 'Your membership payment has been processed.' });
    }
    
    // Initial check
    checkApprovalStatus();
    
    // Poll for status changes (auto-approval may have triggered)
    const interval = setInterval(checkApprovalStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [user]);


  const checkApprovalStatus = async () => {
    if (!user) return;

    try {
      const response = await authAPI.getCurrentUser();
      
      if (response.data?.user) {
        const userData = response.data.user;
        setMemberData(userData);
        
        // If user has active membership (payment completed), redirect to dashboard
        if (userData.membershipStatus === 'active') {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Failed to check approval status:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!memberData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Payment not completed
  if (memberData.membershipStatus !== 'active') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
        <Card className="max-w-2xl w-full p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Required</h1>
          <p className="text-gray-600 mb-6">
            Please complete your membership payment to continue.
          </p>
          <div className="space-y-4">
            <Button onClick={() => navigate('/onboarding', { state: { step: 6 } })} className="w-full">
              Complete Payment
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="w-full">Sign Out</Button>
          </div>
        </Card>
      </div>
    );
  }

  // Rejected
  if (memberData.approvalStatus === 'rejected') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <Card className="max-w-2xl w-full p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Not Approved</h1>
          <p className="text-gray-600 mb-4">
            Unfortunately, your membership application was not approved at this time.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Contact us at membership@nareis.org for questions.
          </p>
          <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
        </Card>
      </div>
    );
  }

  // Pending approval
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="max-w-2xl w-full p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Received!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your application is now under review.
        </p>
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
            <h2 className="font-semibold text-lg">Application Under Review</h2>
          </div>
          <ul className="text-left space-y-2 text-gray-700 text-sm">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              Payment processed successfully
            </li>
            <li className="flex items-center">
              <Clock className="w-4 h-4 text-blue-600 mr-2" />
              Review typically takes 1-2 business days
            </li>
            <li className="flex items-center">
              <Clock className="w-4 h-4 text-blue-600 mr-2" />
              You'll receive an email when approved
            </li>
          </ul>
        </div>
        <p className="text-sm text-gray-500 mb-6">Questions? Contact membership@nareis.org</p>
        <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
      </Card>
    </div>
  );
}
