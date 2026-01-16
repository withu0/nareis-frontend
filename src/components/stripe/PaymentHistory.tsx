import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, CreditCard, Loader2, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch customer info
    const { data: customerData } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (customerData) {
      setStripeCustomerId(customerData.stripe_customer_id);
    }

    const { data, error } = await supabase
      .from('payment_history')
      .select('*')
      .eq('member_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPayments(data);
    }
    setLoading(false);
  };

  const openBillingPortal = async () => {
    if (!stripeCustomerId) {
      toast.error('No billing account found');
      return;
    }

    setPortalLoading(true);
    try {
      const returnUrl = `${window.location.origin}/profile?tab=payments`;
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { customerId: stripeCustomerId, returnUrl }
      });

      if (error) throw error;
      if (data?.success && data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data?.error || 'Failed to open portal');
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
