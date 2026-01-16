import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase, debugSession } from '@/lib/supabase';
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
    const tier = searchParams.get('tier');
    
    console.log('=== PAYMENT RETURN CHECK ===');
    console.log('Payment status:', paymentStatus);
    console.log('Tier:', tier);
    console.log('Already started?', verificationStartedRef.current);
    
    if (paymentStatus === 'success' && tier && !verificationStartedRef.current) {
      verificationStartedRef.current = true;
      console.log('✅ Payment success detected, starting verification...');
      setStep(7);
      setProcessingPayment(true);
      setVerificationError(null);
      setVerificationTimeout(false);
      
      // Set a timeout to show manual options after 45 seconds
      const timeoutId = setTimeout(() => {
        console.log('⏱️ Verification taking longer than expected');
        setVerificationTimeout(true);
      }, 45000);
      
      // CRITICAL: Force Supabase to check localStorage and restore session
      const restoreAndVerify = async () => {
        console.log('🔄 Forcing session restoration from localStorage...');
        
        // Check if session exists in localStorage
        const storedSession = localStorage.getItem('nareis-auth-token');
        console.log('📦 localStorage check:', storedSession ? 'Data found' : 'No data');
        
        if (storedSession) {
          try {
            const parsed = JSON.parse(storedSession);
            console.log('✅ Session data in localStorage:', {
              hasAccessToken: !!parsed.access_token,
              hasRefreshToken: !!parsed.refresh_token,
              userEmail: parsed.user?.email
            });
          } catch (e) {
            console.error('❌ Failed to parse stored session:', e);
          }
        }
        
        // Force Supabase to re-initialize with timeout
        console.log('⏱️ Calling getSession with 3s timeout...');
        try {
          await Promise.race([
            supabase.auth.getSession(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('getSession timeout')), 3000))
          ]);
          console.log('✅ getSession completed');
        } catch (err: any) {
          console.warn('⚠️ getSession failed or timed out:', err.message);
          // Continue anyway since session is in localStorage
        }
        
        // Small additional delay
        console.log('⏱️ Waiting 500ms before verification...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Now start verification
        console.log('🚀 Calling startVerification...');
        try {
          await startVerification(tier);
          clearTimeout(timeoutId);
          console.log('✅ startVerification completed successfully');
        } catch (err: any) {
          clearTimeout(timeoutId);
          console.error('❌ VERIFICATION FAILED:', err);
          console.error('Error stack:', err.stack);
          setVerificationError(err.message || 'Verification failed');
          setProcessingPayment(false);
          setStep(6);
        }
      };
      
      // Start restoration after small delay
      setTimeout(restoreAndVerify, 1500);
      
    } else if (paymentStatus === 'cancel') {
      toast({
        title: 'Payment Cancelled',
        description: 'You can try again when ready.',
        variant: 'default'
      });
      setStep(6);
    }
  }, [searchParams]);

  async function startVerification(tier: string) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('>>> PAYMENT VERIFICATION STARTED <<<');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Tier to verify:', tier);
    
    // Debug session state (non-blocking with timeout)
    try {
      await Promise.race([
        debugSession(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('debugSession timeout')), 2000))
      ]);
    } catch (err: any) {
      console.warn('⚠️ debugSession timed out, continuing anyway');
    }
    
    let userId: string | null = null;
    let userEmail: string | null = null;
    
    // Extended retry logic for auth after Stripe redirect
    const maxAuthRetries = 10;
    for (let authAttempt = 1; authAttempt <= maxAuthRetries; authAttempt++) {
      console.log(`\n[AUTH ATTEMPT ${authAttempt}/${maxAuthRetries}]`);
      
      try {
        // WORKAROUND: If getSession hangs, read directly from localStorage
        const storedSession = localStorage.getItem('nareis-auth-token');
        if (storedSession) {
          try {
            const parsed = JSON.parse(storedSession);
            if (parsed.user?.id) {
              userId = parsed.user.id;
              userEmail = parsed.user.email || null;
              console.log(`[AUTH] ✅ Got user from localStorage directly`);
              console.log(`[AUTH]   User ID: ${userId}`);
              console.log(`[AUTH]   Email: ${userEmail}`);
              break; // Success!
            }
          } catch (parseErr) {
            console.warn('[AUTH] Failed to parse localStorage session:', parseErr);
          }
        }
        
        // Try getSession with timeout as fallback
        try {
          const sessionPromise = supabase.auth.getSession();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('getSession timeout')), 2000)
          );
          
          const result: any = await Promise.race([sessionPromise, timeoutPromise]);
          
          if (result?.data?.session?.user?.id) {
            userId = result.data.session.user.id;
            userEmail = result.data.session.user.email || null;
            console.log(`[AUTH] ✅ Session from getSession()`);
            console.log(`[AUTH]   User ID: ${userId}`);
            break;
          }
        } catch (sessionErr: any) {
          console.warn(`[AUTH] getSession failed:`, sessionErr.message);
        }
        
        // Wait before retry
        if (!userId && authAttempt < maxAuthRetries) {
          const delay = authAttempt <= 3 ? 500 : 1000;
          console.log(`[AUTH] ⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
      } catch (err) {
        console.error(`[AUTH] Exception on attempt ${authAttempt}:`, err);
        if (authAttempt < maxAuthRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    if (!userId) {
      console.error('[AUTH] ❌ Failed to restore session after all retries');
      console.error('[AUTH] This may indicate:');
      console.error('[AUTH]   - Session was not persisted through Stripe redirect');
      console.error('[AUTH]   - Browser cleared session storage');
      console.error('[AUTH]   - Supabase session expired');
      throw new Error('Session expired during payment. Please sign in again and contact support if payment was processed.');
    }
    
    console.log(`\n[AUTH] 🎯 Authenticated as user: ${userId}`);
    console.log(`[AUTH] 📧 Email: ${userEmail}`);
    
    // Poll for webhook update from Stripe using direct REST API
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[POLLING] Waiting for Stripe webhook to update database');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const maxAttempts = 120; // 120 seconds (2 minutes) to account for slow webhooks
    const pollInterval = 1000;
    
    // Direct REST API call instead of Supabase client to avoid hanging
    const supabaseUrl = 'https://qkwaywkacqjjkkfogvtm.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrd2F5d2thY3FqamtrZm9ndnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTg5MDUsImV4cCI6MjA4MDc3NDkwNX0.rvLMX0BxFUnN380ENYF66tEIpuOibHDUnlq8jiisTzA';
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`\n[POLL ${attempt}/${maxAttempts}]`);
      
      try {
        const url = `${supabaseUrl}/rest/v1/customers?auth_id=eq.${userId}&select=subscription_status,membership_tier,onboarding_completed,email,stripe_customer_id,stripe_subscription_id`;
        
        console.log('[POLL] Fetching directly from REST API...');
        
        const fetchPromise = fetch(url, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        });
        
        const timeoutPromise = new Promise<Response>((_, reject) => 
          setTimeout(() => reject(new Error('Fetch timeout')), 5000)
        );
        
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[POLL] HTTP ${response.status}:`, errorText);
          if (attempt > 15) {
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          continue;
        }
        
        const data = await response.json();
        console.log('[POLL] Response received:', data);
        
        if (!data || data.length === 0) {
          console.warn(`[POLL] ⚠️ No customer record found`);
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          continue;
        }
        
        const customer = data[0];
        
        console.log(`[POLL] Customer record found:`);
        console.log(`       Email: ${customer.email}`);
        console.log(`       Stripe Customer: ${customer.stripe_customer_id || 'not set'}`);
        console.log(`       Stripe Subscription: ${customer.stripe_subscription_id || 'not set'}`);
        console.log(`       Status: ${customer.subscription_status}`);
        console.log(`       Tier: ${customer.membership_tier}`);
        console.log(`       Onboarding Complete: ${customer.onboarding_completed}`);
        
        // Check if webhook has updated the record
        const isActive = customer.subscription_status === 'active';
        const tierMatches = customer.membership_tier === tier;
        const isComplete = customer.onboarding_completed === true;
        const hasStripeId = !!customer.stripe_customer_id;
        
        console.log(`[POLL] Verification checks:`);
        console.log(`       ✓ Active subscription: ${isActive}`);
        console.log(`       ✓ Tier matches: ${tierMatches} (${customer.membership_tier} === ${tier})`);
        console.log(`       ✓ Onboarding complete: ${isComplete}`);
        console.log(`       ✓ Has Stripe ID: ${hasStripeId}`);
        
        if (isActive && tierMatches && isComplete) {
          console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('🎉 PAYMENT VERIFIED SUCCESSFULLY!');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          
          setProcessingPayment(false);
          setPaymentComplete(true);
          setData((prev: any) => ({ ...prev, membershipTier: tier }));
          
          toast({
            title: 'Payment Successful!',
            description: 'Your membership is now active. Welcome to NAREIS!'
          });
          
          setTimeout(() => {
            console.log('[REDIRECT] Navigating to dashboard...');
            // Hard redirect to reset Supabase client state
            window.location.href = '/dashboard';
          }, 2000);
          
          return; // SUCCESS!
        }
        
        // Log what we're waiting for
        if (!isActive) console.log(`       ⏳ Waiting for webhook to set status to 'active'`);
        if (!tierMatches) console.log(`       ⏳ Waiting for tier to update to '${tier}'`);
        if (!isComplete) console.log(`       ⏳ Waiting for onboarding_completed flag`);
        
        // Continue polling
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
        
      } catch (pollErr: any) {
        console.error(`[POLL] Exception:`, pollErr);
        if (attempt > 20) {
          throw pollErr;
        }
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }
    
    // Timeout reached
    console.error('\n[POLL] ⏱️ TIMEOUT - Webhook did not update record in time');
    console.error('[POLL] Possible issues:');
    console.error('[POLL]   - Webhook endpoint not configured correctly');
    console.error('[POLL]   - Webhook failed to process');
    console.error('[POLL]   - Payment succeeded but webhook delayed');
    throw new Error('Payment verification timeout. Your payment may have succeeded. Please refresh the page or contact support to verify your membership status.');
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