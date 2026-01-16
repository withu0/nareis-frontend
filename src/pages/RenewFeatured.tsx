import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  Building2,
  Globe,
  CreditCard,
  Shield,
  RefreshCw,
  Star,
  ArrowRight,
  ExternalLink,
  Loader2,
  XCircle,
  Timer
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FeaturedMembership {
  id: string;
  user_id: string;
  company_name: string;
  logo_url: string;
  website_url: string;
  start_date: string | null;
  end_date: string | null;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_amount: number;
  status: 'pending' | 'active' | 'rejected' | 'expired';
  created_at: string;
  member_email: string | null;
  member_name: string | null;
  renewal_token: string | null;
}

export default function RenewFeatured() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [membership, setMembership] = useState<FeaturedMembership | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const token = searchParams.get('token');
  const membershipId = searchParams.get('id');
  const paymentStatus = searchParams.get('payment');

  useEffect(() => {
    if (paymentStatus === 'success') {
      setPaymentSuccess(true);
      // Refresh membership data to show updated status
      if (membershipId) {
        fetchMembershipById(membershipId);
      }
    } else if (paymentStatus === 'cancel') {
      toast({
        title: 'Payment Cancelled',
        description: 'Your payment was cancelled. You can try again when ready.',
        variant: 'destructive'
      });
    }
  }, [paymentStatus]);

  useEffect(() => {
    if (token && membershipId) {
      fetchMembership();
    } else if (membershipId) {
      // Direct access with just ID (for success redirect)
      fetchMembershipById(membershipId);
    } else {
      setError('Invalid renewal link. Please use the link from your renewal email.');
      setLoading(false);
    }
  }, [token, membershipId]);

  const fetchMembership = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('featured_memberships')
        .select('*')
        .eq('id', membershipId)
        .eq('renewal_token', token)
        .single();

      if (fetchError) {
        // Check if the error is because the table doesn't exist
        if (fetchError.code === 'PGRST205' || fetchError.message?.includes('Could not find')) {
          setError('The featured memberships system is not yet configured. Please contact support.');
          return;
        }
        setError('Invalid or expired renewal link. Please contact support or request a new renewal link.');
        return;
      }

      if (!data) {
        setError('Invalid or expired renewal link. Please contact support or request a new renewal link.');
        return;
      }

      setMembership(data);
    } catch (err) {
      setError('Failed to load membership details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembershipById = async (id: string) => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('featured_memberships')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        // Check if the error is because the table doesn't exist
        if (fetchError.code === 'PGRST205' || fetchError.message?.includes('Could not find')) {
          setError('The featured memberships system is not yet configured. Please contact support.');
          return;
        }
        setError('Membership not found.');
        return;
      }

      if (!data) {
        setError('Membership not found.');
        return;
      }

      setMembership(data);
    } catch (err) {
      setError('Failed to load membership details.');
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (endDate: string | null): number | null => {
    if (!endDate) return null;

    const end = new Date(endDate);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStatusInfo = () => {
    if (!membership) return null;
    
    const daysRemaining = getDaysRemaining(membership.end_date);
    
    if (membership.status === 'expired' || (daysRemaining !== null && daysRemaining < 0)) {
      return {
        status: 'expired',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        message: 'Your featured placement has expired',
        urgent: true
      };
    } else if (daysRemaining !== null && daysRemaining <= 5) {
      return {
        status: 'critical',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertTriangle,
        message: `Only ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining!`,
        urgent: true
      };
    } else if (daysRemaining !== null && daysRemaining <= 10) {
      return {
        status: 'warning',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        message: `${daysRemaining} days remaining`,
        urgent: false
      };
    } else {
      return {
        status: 'active',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        message: daysRemaining ? `${daysRemaining} days remaining` : 'Active',
        urgent: false
      };
    }
  };

  const handlePayment = async () => {
    if (!membership) return;
    
    setProcessing(true);
    try {
      // Call the edge function to create a Stripe checkout session
      const { data, error: invokeError } = await supabase.functions.invoke('featured-renewal-checkout', {
        body: {
          membershipId: membership.id,
          companyName: membership.company_name,
          memberEmail: membership.member_email,
          memberName: membership.member_name,
          renewalToken: token,
          successUrl: `${window.location.origin}/renew-featured?id=${membership.id}&payment=success`,
          cancelUrl: `${window.location.origin}/renew-featured?token=${token}&id=${membership.id}&payment=cancel`
        }
      });

      if (invokeError) throw invokeError;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast({
        title: 'Payment Error',
        description: 'Failed to initiate payment. Please try again or contact support.',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your membership details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Invalid Renewal Link</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Homepage
            </Button>
            <Button variant="outline" onClick={() => navigate('/contact')} className="w-full">
              Contact Support
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <CardDescription className="text-lg">
              Your featured membership has been renewed for another 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {membership && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={membership.logo_url} 
                    alt={membership.company_name}
                    className="h-16 w-16 object-contain rounded-lg border bg-white p-2"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{membership.company_name}</h3>
                    <p className="text-sm text-gray-600">Featured Member</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Amount Paid</p>
                    <p className="font-semibold text-green-600">$300.00</p>
                  </div>
                  <div>
                    <p className="text-gray-500">New Duration</p>
                    <p className="font-semibold">30 Days</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Your Benefits Continue
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Prominent logo placement on NAREIS homepage</li>
                <li>• Direct link to your website</li>
                <li>• Enhanced visibility in member directory</li>
                <li>• Priority placement in search results</li>
              </ul>
            </div>

            <p className="text-sm text-gray-500 text-center">
              A confirmation email has been sent to {membership?.member_email}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              View Homepage
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const daysRemaining = getDaysRemaining(membership?.end_date || null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Renew Your Featured Membership</h1>
          <p className="text-blue-100 text-lg">Continue your premium visibility on NAREIS.org</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Membership Details */}
          <div className="space-y-6">
            {/* Current Placement Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Current Placement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {membership && (
                  <>
                    <div className="flex items-center gap-4">
                      <img 
                        src={membership.logo_url} 
                        alt={membership.company_name}
                        className="h-20 w-20 object-contain rounded-lg border bg-white p-2"
                      />
                      <div>
                        <h3 className="font-bold text-xl">{membership.company_name}</h3>
                        <a 
                          href={membership.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                        >
                          <Globe className="w-3 h-3" />
                          {membership.website_url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {statusInfo && (
                      <div className={`p-4 rounded-lg border ${statusInfo.color}`}>
                        <div className="flex items-center gap-2">
                          <statusInfo.icon className="w-5 h-5" />
                          <span className="font-semibold">{statusInfo.message}</span>
                        </div>
                        {daysRemaining !== null && daysRemaining > 0 && (
                          <Progress 
                            value={Math.max(0, Math.min(100, (daysRemaining / 30) * 100))} 
                            className="mt-2 h-2"
                          />
                        )}
                      </div>
                    )}

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Start Date
                        </p>
                        <p className="font-semibold">
                          {membership.start_date 
                            ? new Date(membership.start_date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'Not started'
                          }
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          Expiration Date
                        </p>
                        <p className="font-semibold">
                          {membership.end_date 
                            ? new Date(membership.end_date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'Not set'
                          }
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Featured Member Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Prominent logo placement on NAREIS homepage',
                    'Direct link to your website for increased traffic',
                    'Enhanced visibility in the member directory',
                    'Priority placement in search results',
                    'Featured badge on your member profile',
                    'Monthly analytics report on visibility'
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment */}
          <div className="space-y-6">
            {/* Payment Card */}
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Renewal Payment
                  </span>
                  <Badge className="bg-blue-600">30 Days</Badge>
                </CardTitle>
                <CardDescription>
                  Extend your featured placement for another month
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Price */}
                <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <p className="text-gray-600 mb-1">Renewal Price</p>
                  <div className="flex items-center justify-center gap-1">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                    <span className="text-5xl font-bold text-blue-600">300</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">One-time payment for 30 days</p>
                </div>

                {/* What's Included */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">What's Included:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      30 additional days of featured placement
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Immediate activation upon payment
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Email confirmation and receipt
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      5-day renewal reminder before expiration
                    </li>
                  </ul>
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure payment powered by Stripe</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 pt-0">
                <Button 
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay $300 & Renew Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  By clicking "Pay & Renew Now", you agree to our terms of service.
                  Your card will be charged $300.00.
                </p>
              </CardFooter>
            </Card>

            {/* FAQ Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">When does my renewal start?</h4>
                  <p className="text-sm text-gray-600">
                    Your renewal starts immediately after payment. If your current placement hasn't expired yet, the 30 days will be added to your existing end date.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Can I cancel my renewal?</h4>
                  <p className="text-sm text-gray-600">
                    Featured placements are non-refundable once activated. Contact support if you have any concerns before purchasing.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Will I get a reminder before it expires?</h4>
                  <p className="text-sm text-gray-600">
                    Yes! We'll send you an email reminder 5 days before your placement expires with a direct link to renew.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <div className="text-center text-sm text-gray-500">
              <p>Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact Support</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
