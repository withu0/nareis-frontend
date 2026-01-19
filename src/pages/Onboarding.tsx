import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { debugSession } from '@/lib/supabase';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import ProfileStep from '@/components/onboarding/ProfileStep';
import MembershipTierStep from '@/components/onboarding/MembershipTierStep';
import InterestsStep from '@/components/onboarding/InterestsStep';
import ChapterStep from '@/components/onboarding/ChapterStep';
import PhotoUploadStep from '@/components/onboarding/PhotoUploadStep';
import PaymentStep from '@/components/onboarding/PaymentStep';
//
export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [data, setData] = useState<any>({ membershipTier: 'foundation' });
  const [verificationTimeout, setVerificationTimeout] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const verificationStartedRef = useRef(false);

  useEffect(() => {
    console.log('=== ONBOARDING useEffect TRIGGERED ===');
    console.log('Current URL:', window.location.href);
    
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    const tier = searchParams.get('tier');
    
    console.log('=== PAYMENT RETURN CHECK ===');
    console.log('Payment status:', paymentStatus);
    console.log('Session ID:', sessionId);
    console.log('Tier:', tier);
    console.log('Already started?', verificationStartedRef.current);
    
    if (paymentStatus === 'success' && sessionId && tier && !verificationStartedRef.current) {
      verificationStartedRef.current = true;
      console.log('✅ Payment success detected, starting verification...');
      setStep(7);
      setProcessingPayment(true);
      setVerificationError(null);
      setVerificationTimeout(false);
      
      // Set a timeout to show manual options after 30 seconds
      const timeoutId = setTimeout(() => {
        console.log('⏱️ Verification taking longer than expected');
        setVerificationTimeout(true);
      }, 30000);
      
      // Direct verification without polling
      const verifyPayment = async () => {
        console.log('🔄 Checking authentication...');
        
        // Check auth token
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.error('❌ No auth token found');
          setVerificationError('Session expired. Please log in again.');
          setProcessingPayment(false);
          setStep(6);
          clearTimeout(timeoutId);
          return;
        }
        
        console.log('✅ Auth token found in localStorage');
        
        // Small delay to ensure backend is ready
        console.log('⏱️ Waiting 1s before verification...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify payment with backend
        console.log('🚀 Calling verifyPayment API...');
        try {
          await verifyPaymentWithRetry(sessionId, tier, 3);
          clearTimeout(timeoutId);
          console.log('✅ Payment verified successfully');
          
          setProcessingPayment(false);
          setPaymentComplete(true);
          setData((prev: any) => ({ ...prev, membershipTier: tier }));
          
          toast({
            title: 'Payment Successful!',
            description: 'Your membership is now active. Welcome to NAREIS!'
          });
          
          setTimeout(() => {
            console.log('[REDIRECT] Navigating to dashboard...');
            window.location.href = '/dashboard';
          }, 2000);
          
        } catch (err: any) {
          clearTimeout(timeoutId);
          console.error('❌ VERIFICATION FAILED:', err);
          setVerificationError(err.message || 'Verification failed');
          setProcessingPayment(false);
          setStep(6);
        }
      };
      
      // Start verification after small delay
      setTimeout(verifyPayment, 500);
      
    } else if (paymentStatus === 'cancel') {
      toast({
        title: 'Payment Cancelled',
        description: 'You can try again when ready.',
        variant: 'default'
      });
      setStep(6);
    }
  }, [searchParams]);

  async function verifyPaymentWithRetry(sessionId: string, tier: string, maxRetries: number = 3) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('>>> PAYMENT VERIFICATION STARTED <<<');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Session ID:', sessionId);
    console.log('Tier:', tier);
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('auth_token');
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`\n[ATTEMPT ${attempt}/${maxRetries}]`);
      
      try {
        const url = `${apiUrl}/stripe/verify-payment`;
        
        console.log('[VERIFY] Calling backend API...');
        
        const fetchPromise = fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionId, tier })
        });
        
        const timeoutPromise = new Promise<Response>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[VERIFY] HTTP ${response.status}:`, errorText);
          
          if (attempt === maxRetries) {
            throw new Error(`Verification failed: ${errorText}`);
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        
        const result = await response.json();
        console.log('[VERIFY] Response:', result);
        
        if (result.data?.success) {
          console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('🎉 PAYMENT VERIFIED SUCCESSFULLY!');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          return result.data;
        } else {
          throw new Error(result.error || 'Verification failed');
        }
        
      } catch (err: any) {
        console.error(`[VERIFY] Attempt ${attempt} failed:`, err.message);
        
        if (attempt === maxRetries) {
          throw err;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw new Error('Payment verification failed after multiple attempts');
  }

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const handleChange = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePaymentComplete = () => {
    setPaymentComplete(true);
  };

  const stepNames = ['Profile', 'Membership', 'Interests', 'Location', 'Photo', 'Payment', 'Complete'];

  const renderStep = () => {
    if (step === 7) {
      if (verificationError) {
        return (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verification Error</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{verificationError}</p>
            <div className="space-x-4">
              <Button onClick={() => {
                console.log('🔄 User requested manual refresh');
                verificationStartedRef.current = false;
                window.location.reload();
              }}>
                Refresh & Retry
              </Button>
              <Button variant="outline" onClick={() => {
                console.log('🏠 User navigating to dashboard');
                navigate('/dashboard');
              }}>
                Go to Dashboard
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              If the error persists, please contact support with your payment confirmation.
            </p>
            
            {/* Debug button in development */}
            {import.meta.env.DEV && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={async () => {
                  await debugSession();
                  console.log('LocalStorage keys:', Object.keys(localStorage));
                }}
              >
                Debug Session (Dev Only)
              </Button>
            )}
          </div>
        );
      }

      if (processingPayment) {
        return (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verifying Payment...</h3>
            <p className="text-gray-600 mb-4">
              Please wait while we confirm your payment with Stripe.
            </p>
            <p className="text-sm text-gray-500">
              This usually takes 5-20 seconds. Do not close this page.
            </p>
            
            {verificationTimeout && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-yellow-800 mb-3">
                  This is taking longer than expected. Your payment may have succeeded.
                </p>
                <div className="space-x-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      console.log('🔄 User forcing verification retry');
                      verificationStartedRef.current = false;
                      window.location.reload();
                    }}
                  >
                    Retry Verification
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      console.log('🏠 User going to dashboard to check status');
                      navigate('/dashboard');
                    }}
                  >
                    Check Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      }

      if (paymentComplete) {
        return (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Complete!</h3>
            <p className="text-gray-600 mb-4">Welcome to NAREIS!</p>
            <p className="text-sm text-gray-500">
              Redirecting to your dashboard...
            </p>
          </div>
        );
      }

      return (
        <div className="text-center py-12">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Loading...</h3>
        </div>
      );
    }

    switch (step) {
      case 1:
        return <ProfileStep data={data} onChange={handleChange} />;
      case 2:
        return <MembershipTierStep data={data} onChange={handleChange} />;
      case 3:
        return <InterestsStep data={data} onChange={handleChange} />;
      case 4:
        return <ChapterStep data={data} onChange={handleChange} />;
      case 5:
        return <PhotoUploadStep data={data} onChange={handleChange} />;
      case 6:
        return <PaymentStep data={data} onComplete={handlePaymentComplete} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              <h2 className="text-3xl font-bold">Welcome to NAREIS!</h2>
              <p className="text-gray-600 mt-2">Complete your profile to get started</p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {step} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2">
                {stepNames.map((name, i) => (
                  <span
                    key={name}
                    className={`text-xs ${
                      i + 1 <= step ? 'text-blue-600 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {renderStep()}

            {step < 7 && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  Back
                </Button>
                {step !== 6 && (
                  <Button onClick={handleNext}>
                    Next
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}