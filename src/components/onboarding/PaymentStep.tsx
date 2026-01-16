import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, CreditCard, Shield, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentStepProps {
  data: any;
  onComplete: () => void;
}

const tierPrices: Record<string, { amount: number; priceId: string; isRecurring: boolean }> = {
  foundation: { amount: 495, priceId: 'price_foundation_yearly', isRecurring: true },
  growth: { amount: 995, priceId: 'price_growth_yearly', isRecurring: true },
  stakeholder: { amount: 1495, priceId: 'price_stakeholder_yearly', isRecurring: true },
  professional: { amount: 1995, priceId: 'price_professional_yearly', isRecurring: true },
  enterprise: { amount: 3995, priceId: 'price_enterprise_yearly', isRecurring: true },
  founding: { amount: 5995, priceId: 'price_founding_lifetime', isRecurring: false }
};

const tierNames: Record<string, string> = {
  foundation: 'Foundation Member',
  growth: 'Growth Member',
  stakeholder: 'Service Partner Member',
  professional: 'Professional Member',
  enterprise: 'Enterprise Member',
  founding: 'Founding Lifetime Member'
};

export default function PaymentStep({ data, onComplete }: PaymentStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const tier = data.membershipTier || 'foundation';
  const priceInfo = tierPrices[tier] || tierPrices.foundation;
  const tierName = tierNames[tier] || 'Foundation Member';

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('\n═══════════════════════════════════════════════');
      console.log('>>> PAYMENT STEP: STARTING CHECKOUT PROCESS <<<');
      console.log('═══════════════════════════════════════════════');
      
      // Get session with retries (critical for reliability)
      console.log('[AUTH] Getting user session...');
      let userId: string | null = null;
      let userEmail: string | null = null;
      
      const maxAuthRetries = 3;
      for (let attempt = 1; attempt <= maxAuthRetries; attempt++) {
        console.log(`[AUTH] Attempt ${attempt}/${maxAuthRetries}`);
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error(`[AUTH] Error on attempt ${attempt}:`, sessionError);
          if (attempt === maxAuthRetries) {
            throw new Error('Could not verify your session. Please refresh and try again.');
          }
          await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }
        
        if (sessionData?.session?.user) {
          userId = sessionData.session.user.id;
          userEmail = sessionData.session.user.email || null;
          console.log('[AUTH] ✅ Session verified');
          console.log('[AUTH]   User ID:', userId);
          console.log('[AUTH]   Email:', userEmail);
          break;
        }
        
        if (attempt < maxAuthRetries) {
          console.warn('[AUTH] No session found, retrying...');
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (!userId || !userEmail) {
        console.error('[AUTH] ❌ Failed to get valid session after retries');
        setError('Session expired. Please refresh the page and try again.');
        setLoading(false);
        return;
      }

      console.log('[AUTH]   Selected Tier:', tier);

      // CRITICAL: Ensure customer record exists BEFORE payment
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[CUSTOMER] CHECKING/CREATING CUSTOMER RECORD');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const { data: existingCustomer, error: lookupError } = await supabase
        .from('customers')
        .select('id, auth_id, email, full_name, membership_tier, subscription_status, onboarding_completed')
        .eq('auth_id', userId)
        .maybeSingle();

      if (lookupError && lookupError.code !== 'PGRST116') {
        console.error('[CUSTOMER] ❌ Database lookup error:', lookupError);
        setError('Database error. Please try again.');
        setLoading(false);
        return;
      }

      if (existingCustomer) {
        console.log('[CUSTOMER] ✅ Found existing customer record');
        console.log('[CUSTOMER]   ID:', existingCustomer.id);
        console.log('[CUSTOMER]   Email:', existingCustomer.email);
        console.log('[CUSTOMER]   Current Tier:', existingCustomer.membership_tier);
        console.log('[CUSTOMER]   Current Status:', existingCustomer.subscription_status);
        console.log('[CUSTOMER] Updating to pending for new purchase...');
        
        // Update to pending status for new payment
        const { error: updateError } = await supabase
          .from('customers')
          .update({
            membership_tier: tier,
            subscription_status: 'pending',
            onboarding_completed: false,
            updated_at: new Date().toISOString()
          })
          .eq('auth_id', userId);

        if (updateError) {
          console.error('[CUSTOMER] ❌ Update failed:', updateError);
          setError('Could not update membership. Please try again.');
          setLoading(false);
          return;
        }
        
        console.log('[CUSTOMER] ✅ Customer updated successfully');
      } else {
        console.log('[CUSTOMER] ℹ️ No existing customer found, creating new...');
        
        // Create customer record with all onboarding data
        const customerData = {
          auth_id: userId,
          email: userEmail,
          full_name: data.fullName || (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : 'Member'),
          first_name: data.firstName || '',
          last_name: data.lastName || '',
          phone: data.phone || null,
          organization: data.organization || null,
          job_title: data.jobTitle || null,
          membership_tier: tier,
          subscription_status: 'pending',
          membership_status: 'pending',
          onboarding_completed: false,
          approval_status: 'pending',
          chapter_id: data.chapter || null,
          interests: data.interests || [],
          profile_picture_url: data.profilePictureUrl || null,
          role: 'member',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('[CUSTOMER] Creating with data:', {
          email: customerData.email,
          tier: customerData.membership_tier,
          status: customerData.subscription_status
        });

        const { error: createError } = await supabase
          .from('customers')
          .insert(customerData);

        if (createError) {
          console.error('[CUSTOMER] ❌ Create failed:', createError);
          console.error('[CUSTOMER] Error details:', createError);
          setError('Could not create customer record. Please contact support.');
          setLoading(false);
          return;
        }

        console.log('[CUSTOMER] ✅ Customer record created successfully');
      }

      // Small delay to ensure DB write is committed before Stripe redirect
      console.log('[CUSTOMER] Waiting 300ms for DB commit...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Now create Stripe checkout session
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[STRIPE] CREATING CHECKOUT SESSION');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const checkoutData = {
        priceId: priceInfo.priceId,
        planName: tierName,
        amount: priceInfo.amount,
        isRecurring: priceInfo.isRecurring,
        userId: userId,
        userEmail: userEmail,
        tier: tier,
        successUrl: `${window.location.origin}/onboarding?payment=success&tier=${tier}`,
        cancelUrl: `${window.location.origin}/onboarding?payment=cancel`
      };
      
      console.log('[STRIPE] Request data:', {
        tier: checkoutData.tier,
        amount: checkoutData.amount,
        userId: checkoutData.userId.substring(0, 8) + '...'
      });

      const response = await supabase.functions.invoke('create-checkout-session', {
        body: checkoutData
      });

      if (response.error) {
        console.error('[STRIPE] ❌ Function error:', response.error);
        setError('Payment system unavailable. Please try again or contact support.');
        setLoading(false);
        return;
      }

      if (!response.data?.url) {
        console.error('[STRIPE] ❌ No checkout URL returned');
        console.error('[STRIPE] Response:', response.data);
        setError('Could not create checkout session. Please try again.');
        setLoading(false);
        return;
      }

      console.log('[STRIPE] ✅ Checkout URL received');
      console.log('[STRIPE] 🚀 REDIRECTING TO STRIPE CHECKOUT NOW');
      
      // Redirect to Stripe - user will return to successUrl after payment
      window.location.href = response.data.url;
      
    } catch (err: any) {
      console.error('\n❌ PAYMENT ERROR:', err);
      console.error('Stack:', err.stack);
      setError(err.message || 'Payment processing failed. Please try again or contact support.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Complete Your Membership</h3>
        <p className="text-gray-600 mt-2">Secure payment to activate your {tierName}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-lg">{tierName}</h4>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Selected</span>
        </div>
        <div className="text-3xl font-bold text-blue-900 mb-2">
          ${priceInfo.amount}
          <span className="text-lg text-gray-600 font-normal">
            {priceInfo.isRecurring ? '/year' : ' one-time'}
          </span>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Full member benefits</li>
          <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Access to all resources</li>
          <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Networking opportunities</li>
        </ul>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-4 pt-4 border-t">
          <Shield className="w-4 h-4 text-green-600" />
          <span>30-day money-back guarantee</span>
        </div>
      </Card>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Lock className="w-4 h-4" />
        <span>Secured by Stripe</span>
      </div>

      <Button onClick={handlePayment} disabled={loading} className="w-full" size="lg">
        <CreditCard className="w-5 h-5 mr-2" />
        {loading ? 'Preparing checkout...' : `Pay $${priceInfo.amount} Now`}
      </Button>
      
      <p className="text-xs text-center text-gray-500">
        By proceeding, you agree to our Terms of Service and Privacy Policy.
        Your card will be charged ${priceInfo.amount} {priceInfo.isRecurring ? 'annually' : 'once'}.
      </p>
    </div>
  );
}