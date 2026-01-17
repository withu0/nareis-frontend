import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, CreditCard, Loader2, FileText } from 'lucide-react';
import { userAPI, stripeAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Payment {
  id: string;
  created_at: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  invoice_id: string;
  invoice_url: string;
}

export default function PaymentHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPaymentHistory();
    }
  }, [user]);

  const fetchPaymentHistory = async () => {
    if (!user) return;

    try {
      const response = await userAPI.getSubscription();
      if (response.data) {
        setStripeCustomerId(response.data.stripeCustomerId || null);
        if (response.data.paymentHistory) {
          setPayments(response.data.paymentHistory.map((p: any) => ({
            id: p.id,
            created_at: p.createdAt,
            amount: p.amount,
            currency: 'usd',
            status: p.status,
            description: 'Membership Payment',
            invoice_id: '',
            invoice_url: p.invoiceUrl,
          })));
        }
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const openBillingPortal = async () => {
    if (!stripeCustomerId) {
      toast.error('No billing account found');
      return;
    }

    setPortalLoading(true);
    try {
      const response = await stripeAPI.getBillingPortal();
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('Failed to open portal');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to open billing portal');
    } finally {
      setPortalLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'succeeded': return 'default';
      case 'failed': return 'destructive';
      case 'pending': return 'secondary';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) return <Card className="p-6"><p>Loading payment history...</p></Card>;

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={openBillingPortal} disabled={portalLoading || !stripeCustomerId}>
          {portalLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
          Manage Payment Methods
        </Button>
        <Button variant="outline" onClick={openBillingPortal} disabled={portalLoading || !stripeCustomerId}>
          <FileText className="w-4 h-4 mr-2" />
          View All Invoices in Stripe
        </Button>
      </div>

      {/* Payment History Table */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Payment History</h2>
        {payments.length === 0 ? (
          <p className="text-muted-foreground">No payment history found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.description || 'Membership Payment'}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {payment.invoice_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={payment.invoice_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />View
                        </a>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
