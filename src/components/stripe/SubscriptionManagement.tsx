import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, TrendingUp, TrendingDown, AlertCircle, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { stripeAPI, userAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import BillingPortalButton from './BillingPortalButton';

type TierInfo = { id: string; name: string; amount: number; isRecurring?: boolean };

export default function SubscriptionManagement() {
  const { user } = useAuth();
  const [tiers, setTiers] = useState<TierInfo[]>([]);
  const [subscription, setSubscription] = useState<{
    membership_tier?: string;
    membership_status?: string;
    stripe_subscription_id?: string;
    stripe_customer_id?: string;
    renewal_date?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchTiers();
    }
  }, [user]);

  const fetchTiers = async () => {
    try {
      const res = await stripeAPI.getTiers();
      if (res.data && Array.isArray(res.data)) setTiers(res.data);
    } catch (e) {
      console.error('Failed to fetch tiers:', e);
    }
  };

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const response = await userAPI.getSubscription();
      if (response.data) {
        setSubscription({
          membership_tier: response.data.membershipTier,
          membership_status: response.data.membershipStatus,
          stripe_subscription_id: response.data.stripeSubscriptionId,
          stripe_customer_id: response.data.stripeCustomerId,
          renewal_date: response.data.membershipExpiresAt,
        });
        setStripeCustomerId(response.data.stripeCustomerId || null);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (newTier: string) => {
    setActionLoading(`upgrade-${newTier}`);
    try {
      const origin = window.location.origin;
      const response = await stripeAPI.createCheckoutSession({
        tier: newTier,
        successUrl: `${origin}/profile?upgrade=success&session_id={CHECKOUT_SESSION_ID}&tier=${newTier}`,
        cancelUrl: `${origin}/profile?upgrade=cancel`,
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
        return;
      }
      toast.error(response.error || 'Could not start checkout');
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Upgrade failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDowngrade = async (newTier: string) => {
    setActionLoading(`downgrade-${newTier}`);
    try {
      await userAPI.requestDowngrade(newTier);
      toast.success('Plan updated.');
      fetchSubscription();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Downgrade failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? Access continues until your membership period ends.')) return;
    setActionLoading('cancel');
    try {
      await userAPI.cancelSubscription();
      toast.success('Subscription cancelled. Access continues until the end of your membership period.');
      fetchSubscription();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Cancel failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async () => {
    setActionLoading('reactivate');
    try {
      await userAPI.reactivateSubscription();
      toast.success('Subscription reactivated.');
      fetchSubscription();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Reactivate failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  const currentTier = tiers.find((t) => t.id === subscription?.membership_tier);
  const isActive = subscription?.membership_status === 'active';
  const isCanceling = subscription?.membership_status === 'canceling';
  const currentAmount = currentTier?.amount ?? 0;

  return (
    <div className="space-y-6">
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
              <p className="text-muted-foreground">${currentTier?.amount ?? 0} per year</p>
            </div>
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {subscription?.membership_status || 'pending'}
            </Badge>
          </div>

          {subscription?.renewal_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Membership expires {new Date(subscription.renewal_date).toLocaleDateString()}</span>
            </div>
          )}

          {isCanceling && subscription?.renewal_date && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your membership will end on {new Date(subscription.renewal_date).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 flex-wrap">
            <BillingPortalButton stripeCustomerId={stripeCustomerId || undefined} variant="outline" />
            {isActive && (
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={!!actionLoading}
              >
                Cancel Subscription
              </Button>
            )}
            {isCanceling && (
              <Button onClick={handleReactivate} disabled={!!actionLoading}>
                Reactivate Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isActive && tiers.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>Upgrade to a higher tier (billed annually). You can use a promotion code at checkout.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tiers
                .filter((t) => t.amount > currentAmount)
                .map((tier) => (
                  <div key={tier.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{tier.name}</h4>
                      <p className="text-sm text-muted-foreground">${tier.amount} one-time</p>
                    </div>
                    <Button
                      onClick={() => handleUpgrade(tier.id)}
                      disabled={actionLoading === `upgrade-${tier.id}`}
                    >
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
              <CardDescription>Change to a lower tier. Takes effect immediately.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tiers
                .filter((t) => t.amount < currentAmount)
                .map((tier) => (
                  <div key={tier.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{tier.name}</h4>
                      <p className="text-sm text-muted-foreground">${tier.amount} per year</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleDowngrade(tier.id)}
                      disabled={actionLoading === `downgrade-${tier.id}`}
                    >
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
