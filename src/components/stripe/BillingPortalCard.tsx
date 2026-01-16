import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, FileText, Settings, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function BillingPortalCard() {
  const [loading, setLoading] = useState(false);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('');

  useEffect(() => {
    fetchBillingInfo();
  }, []);

  const fetchBillingInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('customers')
      .select('stripe_customer_id, subscription_status')
      .eq('id', user.id)
      .single();

    if (data) {
      setStripeCustomerId(data.stripe_customer_id);
      setSubscriptionStatus(data.subscription_status || 'inactive');
    }
  };

  const openBillingPortal = async () => {
    if (!stripeCustomerId) {
      toast.error('No billing account found. Please contact support.');
      return;
    }

    setLoading(true);
    try {
      const returnUrl = `${window.location.origin}/dashboard`;

      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { customerId: stripeCustomerId, returnUrl }
      });

      if (error) throw error;

      if (data?.success && data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data?.error || 'Failed to create portal session');
      }
    } catch (err: any) {
      console.error('Portal error:', err);
      toast.error(err.message || 'Failed to open billing portal');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: CreditCard, label: 'Update Payment Methods' },
    { icon: FileText, label: 'View & Download Invoices' },
    { icon: RefreshCw, label: 'Modify Subscription' },
    { icon: Settings, label: 'Billing Settings' }
  ];

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Billing & Subscription
        </CardTitle>
        <CardDescription>Manage your payment methods, invoices, and subscription</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
              <feature.icon className="w-4 h-4 text-blue-500" />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        <Button 
          onClick={openBillingPortal} 
          disabled={loading || !stripeCustomerId}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ExternalLink className="w-4 h-4 mr-2" />
          )}
          Manage Billing
        </Button>
      </CardContent>
    </Card>
  );
}
