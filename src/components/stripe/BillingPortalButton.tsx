import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, CreditCard } from 'lucide-react';
import { stripeAPI } from '@/lib/api';
import { toast } from 'sonner';

interface BillingPortalButtonProps {
  stripeCustomerId?: string;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

export default function BillingPortalButton({ 
  stripeCustomerId, 
  variant = 'outline',
  className = ''
}: BillingPortalButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleManageBilling = async () => {
    if (!stripeCustomerId) {
      toast.error('No billing account found. Please contact support.');
      return;
    }

    setLoading(true);
    try {
      const response = await stripeAPI.getBillingPortal();

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('Failed to create portal session');
      }
    } catch (err: any) {
      console.error('Portal error:', err);
      toast.error(err.message || 'Failed to open billing portal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleManageBilling}
      disabled={loading || !stripeCustomerId}
      className={className}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <CreditCard className="w-4 h-4 mr-2" />
      )}
      Manage Billing
      <ExternalLink className="w-3 h-3 ml-2" />
    </Button>
  );
}
