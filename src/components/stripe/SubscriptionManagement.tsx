import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, TrendingUp, TrendingDown, AlertCircle, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import BillingPortalButton from './BillingPortalButton';

const tiers = [
  { id: 'basic', name: 'Basic', price: 99, priceId: 'price_basic_yearly', features: ['Member directory', 'Newsletter', 'Forums'] },
  { id: 'professional', name: 'Professional', price: 299, priceId: 'price_pro_yearly', features: ['All Basic', 'Events', 'Webinars', 'Priority support'] },
  { id: 'premium', name: 'Premium', price: 599, priceId: 'price_premium_yearly', features: ['All Pro', 'Unlimited events', 'Mentorship', 'Leadership programs'] }
];

export default function SubscriptionManagement() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('customers')
      .select('membership_tier, subscription_status, renewal_date, stripe_subscription_id, stripe_customer_id')
      .eq('id', user.id)
      .single();

    setSubscription(data);
    setStripeCustomerId(data?.stripe_customer_id || null);
    setLoading(false);

  };


  const handleUpgrade = async (newTier: string, newPriceId: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('manage-subscription', {
        body: { 
          action: 'upgrade', 
          subscriptionId: subscription?.stripe_subscription_id,
          newPriceId,
          userId: user.id
        }
      });

      if (error) throw error;
      toast.success('Subscription upgraded successfully!');
      fetchSubscription();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleDowngrade = async (newTier: string, newPriceId: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('manage-subscription', {
        body: { 
          action: 'downgrade', 
          subscriptionId: subscription?.stripe_subscription_id,
          newPriceId,
          userId: user.id
        }
      });

      if (error) throw error;
      toast.success('Subscription will downgrade at next billing period');
      fetchSubscription();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.functions.invoke('manage-subscription', {
        body: { 
          action: 'cancel',
          subscriptionId: subscription?.stripe_subscription_id,
          userId: user.id
        }
      });

      if (error) throw error;
      toast.success('Subscription cancelled. Access continues until renewal date.');
      fetchSubscription();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleReactivate = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.functions.invoke('manage-subscription', {
        body: { 
          action: 'reactivate',
          subscriptionId: subscription?.stripe_subscription_id,
          userId: user.id
        }
      });

      if (error) throw error;
      toast.success('Subscription reactivated!');
      fetchSubscription();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };


  if (loading) return <div>Loading...</div>;

  const currentTier = tiers.find(t => t.id === subscription?.membership_tier);
  const isActive = subscription?.subscription_status === 'active';
  const isCanceling = subscription?.subscription_status === 'canceling';

  return (
    <div className="space-y-6">
      {/* Billing Portal Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Billing Management
          </CardTitle>
          <CardDescription>
            Access Stripe's secure portal to manage your payment methods, view invoices, and update billing details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BillingPortalButton 
            stripeCustomerId={stripeCustomerId || undefined}
            variant="default"
            className="w-full sm:w-auto"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{currentTier?.name || 'No Plan'}</h3>
              <p className="text-muted-foreground">${currentTier?.price || 0}/year</p>
            </div>
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {subscription?.subscription_status || 'inactive'}
            </Badge>
          </div>

          {subscription?.renewal_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Renews on {new Date(subscription.renewal_date).toLocaleDateString()}</span>
            </div>
          )}

          {isCanceling && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your subscription will end on {new Date(subscription.renewal_date).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Features</h4>
            <ul className="space-y-1">
              {currentTier?.features.map((f, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {f}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 flex-wrap">
            <BillingPortalButton 
              stripeCustomerId={stripeCustomerId || undefined}
              variant="outline"
            />
            {isActive && (
              <Button variant="destructive" onClick={handleCancel}>
                Cancel Subscription
              </Button>
            )}
            {isCanceling && (
              <Button onClick={handleReactivate}>
                Reactivate Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isActive && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>Get more features and benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tiers.filter(t => t.price > (currentTier?.price || 0)).map(tier => (
                <div key={tier.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{tier.name}</h4>
                    <p className="text-sm text-muted-foreground">${tier.price}/year</p>
                  </div>
                  <Button onClick={() => handleUpgrade(tier.id, tier.priceId)}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Upgrade
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Downgrade Your Plan</CardTitle>
              <CardDescription>Changes take effect at next billing period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tiers.filter(t => t.price < (currentTier?.price || 0)).map(tier => (
                <div key={tier.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{tier.name}</h4>
                    <p className="text-sm text-muted-foreground">${tier.price}/year</p>
                  </div>
                  <Button variant="outline" onClick={() => handleDowngrade(tier.id, tier.priceId)}>
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Downgrade
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

