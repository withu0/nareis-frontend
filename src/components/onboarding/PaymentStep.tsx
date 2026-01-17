import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, CreditCard, Shield, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { stripeAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();
  const { user } = useAuth();
  
  const tier = data.membershipTier || 'foundation';
  const priceInfo = tierPrices[tier] || tierPrices.foundation;
  const tierName = tierNames[tier] || 'Foundation Member';

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is authenticated
      if (!user) {
        setError('Please log in to continue with payment.');
        setLoading(false);
        return;
      }

      console.log('[STRIPE] Creating checkout session...');
      console.log('[STRIPE] User ID:', user.id);
      console.log('[STRIPE] Tier:', tier);
      
      const response = await stripeAPI.createCheckoutSession({
        tier,
        successUrl: `${window.location.origin}/onboarding?payment=success&tier=${tier}`,
        cancelUrl: `${window.location.origin}/onboarding?payment=cancel`,
      });

      if (response.error) {
        console.error('[STRIPE] ❌ Error:', response.error);
        setError(response.error || 'Payment system unavailable. Please try again or contact support.');
        setLoading(false);
        return;
      }

      if (!response.data?.url) {
        console.error('[STRIPE] ❌ No checkout URL returned');
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