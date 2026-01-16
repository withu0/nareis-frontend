import { useState, useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, FileText, Settings, ExternalLink, Loader2, Calendar, Shield, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import PaymentHistory from '@/components/stripe/PaymentHistory';

export default function Billing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [billingInfo, setBillingInfo] = useState<any>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (user) fetchBillingInfo();
  }, [user]);

  const fetchBillingInfo = async () => {
    const { data } = await supabase
      .from('customers')
      .select('stripe_customer_id, subscription_status, membership_tier, renewal_date')
      .eq('id', user?.id)
      .single();

    setBillingInfo(data);
    setFetchLoading(false);
  };

  const openBillingPortal = async () => {
    if (!billingInfo?.stripe_customer_id) {
      toast.error('No billing account found. Please contact support.');
      return;
    }

    setLoading(true);
    try {
      const returnUrl = `${window.location.origin}/billing`;
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { customerId: billingInfo.stripe_customer_id, returnUrl }
      });

      if (error) throw error;
      if (data?.success && data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data?.error || 'Failed to create portal session');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to open billing portal');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Navigate to="/login" />;

  const portalFeatures = [
    { icon: CreditCard, title: 'Payment Methods', desc: 'Add, update, or remove cards' },
    { icon: FileText, title: 'Invoices', desc: 'View and download all invoices' },
    { icon: RefreshCw, title: 'Subscription', desc: 'Upgrade, downgrade, or cancel' },
    { icon: Settings, title: 'Billing Info', desc: 'Update billing address and details' }
  ];

  return (
    <>
      <SEOHead title="Billing Management - NAREIS" description="Manage your subscription, payment methods, and invoices" />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Billing & Subscription</h1>
            <p className="text-blue-100 mt-2">Manage your payment methods, invoices, and subscription</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <BackButton />

          <div className="grid lg:grid-cols-3 gap-8 mt-6">
            {/* Main Portal Card */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Stripe Customer Portal
                  </CardTitle>
                  <CardDescription>Securely manage all billing through Stripe's hosted portal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {portalFeatures.map((f, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                        <f.icon className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">{f.title}</h4>
                          <p className="text-sm text-gray-500">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button onClick={openBillingPortal} disabled={loading || !billingInfo?.stripe_customer_id} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ExternalLink className="w-5 h-5 mr-2" />}
                    Open Stripe Billing Portal
                  </Button>

                  {!billingInfo?.stripe_customer_id && (
                    <Alert><AlertCircle className="h-4 w-4" /><AlertDescription>No Stripe account linked. Complete a payment to set up billing.</AlertDescription></Alert>
                  )}
                </CardContent>
              </Card>

              <PaymentHistory />
            </div>

            {/* Subscription Status Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fetchLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold capitalize">{billingInfo?.membership_tier || 'Free'}</span>
                        <Badge variant={billingInfo?.subscription_status === 'active' ? 'default' : 'secondary'}>
                          {billingInfo?.subscription_status || 'Inactive'}
                        </Badge>
                      </div>
                      {billingInfo?.renewal_date && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          Renews: {new Date(billingInfo.renewal_date).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Secure Payments</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">All transactions are processed securely through Stripe</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
