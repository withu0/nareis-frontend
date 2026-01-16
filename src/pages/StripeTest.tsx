import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Loader2, CreditCard, AlertTriangle } from 'lucide-react';

const testPlans = [
  { id: 'foundation', name: 'Foundation Member', amount: 495, priceId: 'price_foundation_yearly', isRecurring: true },
  { id: 'growth', name: 'Growth Member', amount: 995, priceId: 'price_growth_yearly', isRecurring: true },
  { id: 'professional', name: 'Professional Member', amount: 1995, priceId: 'price_professional_yearly', isRecurring: true },
  { id: 'founding', name: 'Founding Lifetime', amount: 5995, priceId: 'price_founding_lifetime', isRecurring: false }
];

export default function StripeTest() {
  const [testResults, setTestResults] = useState<Record<string, { status: string; message: string; url?: string }>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const testCheckoutSession = async (plan: typeof testPlans[0]) => {
    setLoading(plan.id);
    try {
      const { data: session } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: plan.priceId,
          planName: plan.name,
          amount: plan.amount,
          isRecurring: plan.isRecurring,
          userId: session?.session?.user?.id || 'test-user-id',
          successUrl: `${window.location.origin}/dashboard?payment=success`,
          cancelUrl: `${window.location.origin}/stripe-test?payment=cancel`
        }
      });

      if (response.error) {
        setTestResults(prev => ({ ...prev, [plan.id]: { status: 'error', message: response.error.message } }));
        return;
      }

      if (response.data?.url) {
        setTestResults(prev => ({ ...prev, [plan.id]: { status: 'success', message: 'Checkout URL generated', url: response.data.url } }));
        toast({ title: 'Success', description: `Checkout session created for ${plan.name}` });
      } else {
        setTestResults(prev => ({ ...prev, [plan.id]: { status: 'error', message: 'No URL returned' } }));
      }
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, [plan.id]: { status: 'error', message: error.message } }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Stripe Checkout Test</h1>
          <p className="text-gray-600 mt-2">Test the create-checkout-session edge function</p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Test Mode:</strong> Use card 4242 4242 4242 4242 with any future date and CVC.
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {testPlans.map(plan => (
            <Card key={plan.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-gray-600">${plan.amount}{plan.isRecurring ? '/year' : ' one-time'}</p>
                    <Badge variant="outline" className="mt-1">{plan.priceId}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    {testResults[plan.id] && (
                      <div className="flex items-center gap-2">
                        {testResults[plan.id].status === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={testResults[plan.id].status === 'success' ? 'text-green-600' : 'text-red-600'}>
                          {testResults[plan.id].message}
                        </span>
                      </div>
                    )}
                    <Button onClick={() => testCheckoutSession(plan)} disabled={loading === plan.id}>
                      {loading === plan.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                      Test
                    </Button>
                    {testResults[plan.id]?.url && (
                      <Button variant="outline" onClick={() => window.open(testResults[plan.id].url, '_blank')}>
                        Open Checkout
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}