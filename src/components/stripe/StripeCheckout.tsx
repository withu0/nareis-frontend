import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface StripeCheckoutProps {
  planName: string;
  amount: number;
  priceId: string;
  isRecurring: boolean;
}

export function StripeCheckout({ planName, amount, priceId, isRecurring }: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const stripe = await (window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      
      const response = await fetch('https://puvvhscxffpmemufkxaq.supabase.co/functions/v1/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          planName,
          isRecurring,
          successUrl: `${window.location.origin}/dashboard?payment=success`,
          cancelUrl: `${window.location.origin}/member-benefits?payment=cancel`
        })
      });

      const session = await response.json();
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      toast({ title: 'Error', description: 'Payment failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full">
      {loading ? 'Processing...' : `Pay $${amount}`}
    </Button>
  );
}
