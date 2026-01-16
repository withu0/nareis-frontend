import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  Mail,
  RefreshCw,
  Search,
  ExternalLink,
  Timer,
  TrendingUp,
  Eye,
  Send,
  ArrowLeft,
  Database,
  FileCode,
  Copy
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { emailService } from '@/lib/emailService';
import { useNavigate } from 'react-router-dom';

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
  stripe_payment_intent_id: string | null;
  status: 'pending' | 'active' | 'rejected' | 'expired';
  created_at: string;
  updated_at: string;
  reminder_sent_at: string | null;
  reminder_count: number;
  auto_expired: boolean;
  renewal_token: string | null;
  member_email: string | null;
  member_name: string | null;
}

export default function FeaturedMemberTracking() {
  const [memberships, setMemberships] = useState<FeaturedMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expirationFilter, setExpirationFilter] = useState<string>('all');
  const [selectedMembership, setSelectedMembership] = useState<FeaturedMembership | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [extensionDays, setExtensionDays] = useState(30);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const [runningExpirationCheck, setRunningExpirationCheck] = useState(false);
  const [tableNotFound, setTableNotFound] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiringSoon: 0,
    expired: 0,
    pending: 0,
    totalRevenue: 0,
    paidCount: 0,
    unpaidCount: 0
  });

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    setLoading(true);
    setTableNotFound(false);
    try {
      const { data, error } = await supabase
        .from('featured_memberships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Check if the error is because the table doesn't exist
        if (error.code === 'PGRST205' || error.message?.includes('Could not find')) {
          setTableNotFound(true);
          return;
        }
        throw error;
      }

      setMemberships(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      console.error('Error fetching featured members:', error);
      if (error?.code === 'PGRST205' || error?.message?.includes('Could not find')) {
        setTableNotFound(true);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load featured memberships',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };


  const calculateStats = (data: FeaturedMembership[]) => {
    const now = new Date();
    const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    const active = data.filter(m => 
      m.status === 'active' && 
      m.end_date && 
      new Date(m.end_date) > now
    );

    const expiringSoon = active.filter(m => 
      m.end_date && new Date(m.end_date) <= fiveDaysFromNow
    );

    const expired = data.filter(m => 
      m.status === 'expired' || 
      (m.status === 'active' && m.end_date && new Date(m.end_date) < now)
    );

    const pending = data.filter(m => m.status === 'pending');
    
    const paidMemberships = data.filter(m => m.payment_status === 'completed');
    const totalRevenue = paidMemberships.reduce((sum, m) => sum + (m.payment_amount || 300), 0);

    setStats({
      total: data.length,
      active: active.length,
      expiringSoon: expiringSoon.length,
      expired: expired.length,
      pending: pending.length,
      totalRevenue,
      paidCount: paidMemberships.length,
      unpaidCount: data.filter(m => m.payment_status !== 'completed').length
    });
  };

  const getDaysRemaining = (endDate: string | null): number | null => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getExpirationStatus = (membership: FeaturedMembership) => {
    if (membership.status !== 'active') return null;
    
    const daysRemaining = getDaysRemaining(membership.end_date);
    if (daysRemaining === null) return null;

    if (daysRemaining < 0) {
      return { status: 'expired', color: 'bg-red-100 text-red-800', icon: XCircle };
    } else if (daysRemaining <= 5) {
      return { status: 'critical', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    } else if (daysRemaining <= 10) {
      return { status: 'warning', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    } else {
      return { status: 'healthy', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
  };

  const getStatusBadge = (membership: FeaturedMembership) => {
    const now = new Date();
    const endDate = membership.end_date ? new Date(membership.end_date) : null;
    
    if (membership.status === 'pending') {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
    if (membership.status === 'rejected') {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
    }
    if (membership.status === 'expired' || (endDate && endDate < now)) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-700">Expired</Badge>;
    }
    if (membership.status === 'active') {
      return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  const getPaymentBadge = (membership: FeaturedMembership) => {
    if (membership.payment_status === 'completed') {
      return <Badge className="bg-green-600"><DollarSign className="w-3 h-3 mr-1" />Paid - ${membership.payment_amount || 300}</Badge>;
    }
    if (membership.payment_status === 'pending') {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
    if (membership.payment_status === 'failed') {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
    }
    if (membership.payment_status === 'refunded') {
      return <Badge variant="outline" className="bg-gray-100">Refunded</Badge>;
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  const handleSendReminder = async (membership: FeaturedMembership) => {
    if (!membership.member_email) {
      toast({
        title: 'Error',
        description: 'No email address found for this member',
        variant: 'destructive'
      });
      return;
    }

    setSendingReminder(membership.id);
    try {
      const daysRemaining = getDaysRemaining(membership.end_date) || 0;
      const expirationDate = membership.end_date 
        ? new Date(membership.end_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'Unknown';
      
      const renewalToken = crypto.randomUUID();
      const renewalLink = `${window.location.origin}/renew-featured?token=${renewalToken}&id=${membership.id}`;

      // Update the membership with reminder info
      const { error: updateError } = await supabase
        .from('featured_memberships')
        .update({
          reminder_sent_at: new Date().toISOString(),
          reminder_count: (membership.reminder_count || 0) + 1,
          renewal_token: renewalToken
        })
        .eq('id', membership.id);

      if (updateError) throw updateError;

      // Send the email
      await emailService.sendFeaturedMemberRenewalReminder(
        membership.member_email,
        membership.member_name || 'Member',
        membership.company_name,
        daysRemaining,
        expirationDate,
        renewalLink
      );

      toast({
        title: 'Reminder Sent',
        description: `Renewal reminder sent to ${membership.member_email}`
      });

      fetchMemberships();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reminder',
        variant: 'destructive'
      });
    } finally {
      setSendingReminder(null);
    }
  };

  const handleExtendMembership = async () => {
    if (!selectedMembership) return;

    try {
      const currentEnd = selectedMembership.end_date 
        ? new Date(selectedMembership.end_date) 
        : new Date();
      const newEnd = new Date(currentEnd);
      newEnd.setDate(newEnd.getDate() + extensionDays);

      const { error } = await supabase
        .from('featured_memberships')
        .update({
          end_date: newEnd.toISOString(),
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedMembership.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Membership extended by ${extensionDays} days`
      });

      setShowExtendDialog(false);
      fetchMemberships();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to extend membership',
        variant: 'destructive'
      });
    }
  };

  const handleRunExpirationCheck = async () => {
    setRunningExpirationCheck(true);
    try {
      const { data, error } = await supabase.functions.invoke('featured-expiration-scheduler', {
        body: {}
      });

      if (error) throw error;

      toast({
        title: 'Expiration Check Complete',
        description: `Reminders sent: ${data?.results?.remindersSent || 0}, Expired: ${data?.results?.expiredProcessed || 0}`
      });

      fetchMemberships();
    } catch (error) {
      // If function doesn't exist, show manual instructions
      toast({
        title: 'Manual Check Required',
        description: 'The scheduled function is not deployed. See FEATURED_EXPIRATION_SCHEDULER_SETUP.md for setup instructions.',
        variant: 'default'
      });
    } finally {
      setRunningExpirationCheck(false);
    }
  };


  const handleApprove = async (membership: FeaturedMembership) => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const { error } = await supabase
        .from('featured_memberships')
        .update({
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', membership.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Membership approved and activated for 30 days' });
      fetchMemberships();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve', variant: 'destructive' });
    }
  };

  const handleReject = async (membership: FeaturedMembership) => {
    try {
      const { error } = await supabase
        .from('featured_memberships')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', membership.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Membership rejected' });
      fetchMemberships();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject', variant: 'destructive' });
    }
  };

  const filteredMemberships = memberships.filter(m => {
    // Search filter
    const matchesSearch = 
      m.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.member_email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.member_name?.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

    // Expiration filter
    let matchesExpiration = true;
    if (expirationFilter !== 'all') {
      const daysRemaining = getDaysRemaining(m.end_date);
      if (expirationFilter === 'expiring-5') {
        matchesExpiration = m.status === 'active' && daysRemaining !== null && daysRemaining <= 5 && daysRemaining > 0;
      } else if (expirationFilter === 'expiring-10') {
        matchesExpiration = m.status === 'active' && daysRemaining !== null && daysRemaining <= 10 && daysRemaining > 0;
      } else if (expirationFilter === 'expired') {
        matchesExpiration = m.status === 'expired' || (daysRemaining !== null && daysRemaining < 0);
      }
    }

    return matchesSearch && matchesStatus && matchesExpiration;
  });

  const sqlSetupCode = `-- Run this SQL in your Supabase SQL Editor to create the featured_memberships table

CREATE TABLE IF NOT EXISTS featured_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_amount DECIMAL(10,2) NOT NULL DEFAULT 300.00,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  reminder_count INTEGER DEFAULT 0,
  auto_expired BOOLEAN DEFAULT FALSE,
  renewal_token TEXT,
  member_email TEXT,
  member_name TEXT,
  stripe_checkout_session_id TEXT,
  last_reminder_type TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_featured_memberships_user_id ON featured_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_featured_memberships_status ON featured_memberships(status);
CREATE INDEX IF NOT EXISTS idx_featured_memberships_end_date ON featured_memberships(end_date);

-- Enable RLS
ALTER TABLE featured_memberships ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for renewal page)
CREATE POLICY "Public can view featured memberships"
  ON featured_memberships FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own
CREATE POLICY "Users can create own featured memberships"
  ON featured_memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow service role to update (for webhooks and admin)
CREATE POLICY "Service role can update all"
  ON featured_memberships FOR UPDATE
  USING (true);`;

  // Show setup instructions if table doesn't exist
  if (tableNotFound) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </div>

        <Card className="border-yellow-300 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Database className="w-6 h-6" />
              Database Setup Required
            </CardTitle>
            <CardDescription className="text-yellow-700">
              The featured_memberships table needs to be created in your Supabase database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  SQL Setup Script
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(sqlSetupCode);
                    toast({
                      title: 'Copied!',
                      description: 'SQL script copied to clipboard'
                    });
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy SQL
                </Button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-64">
                {sqlSetupCode}
              </pre>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Setup Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
                <li>Select your project</li>
                <li>Navigate to <strong>SQL Editor</strong> in the left sidebar</li>
                <li>Click <strong>New Query</strong></li>
                <li>Paste the SQL script above</li>
                <li>Click <strong>Run</strong> to execute</li>
                <li>Return here and click the refresh button below</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button onClick={fetchMemberships} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh & Check Again
              </Button>
              <Button variant="outline" asChild>
                <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Supabase Dashboard
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Featured Member Tracking</h1>
            <p className="text-gray-600">Monitor placements, payments, and expiration dates</p>
          </div>
        </div>
        <Button 
          onClick={handleRunExpirationCheck}
          disabled={runningExpirationCheck}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {runningExpirationCheck ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Timer className="w-4 h-4 mr-2" />
          )}
          Run Expiration Check
        </Button>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.paidCount} paid memberships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Placements</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently displayed on site</p>
          </CardContent>
        </Card>

        <Card className={stats.expiringSoon > 0 ? 'border-yellow-400 bg-yellow-50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${stats.expiringSoon > 0 ? 'text-yellow-600' : 'text-gray-400'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.expiringSoon > 0 ? 'text-yellow-600' : ''}`}>
              {stats.expiringSoon}
            </div>
            <p className="text-xs text-muted-foreground">Within 5 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Verification Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Verification Summary
          </CardTitle>
          <CardDescription>
            All featured members must pay the $300 fee for 30-day placement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Verified Payments</span>
              </div>
              <div className="text-3xl font-bold text-green-600">{stats.paidCount}</div>
              <p className="text-sm text-green-700">$300 fee confirmed</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Pending Payment</span>
              </div>
              <div className="text-3xl font-bold text-yellow-600">{stats.unpaidCount}</div>
              <p className="text-sm text-yellow-700">Awaiting payment</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Total Collected</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-sm text-blue-700">From featured placements</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by company, email, or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={expirationFilter} onValueChange={setExpirationFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by expiration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expirations</SelectItem>
                <SelectItem value="expiring-5">Expiring in 5 days</SelectItem>
                <SelectItem value="expiring-10">Expiring in 10 days</SelectItem>
                <SelectItem value="expired">Already Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchMemberships}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Memberships Table */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Memberships ({filteredMemberships.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filteredMemberships.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No featured memberships found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Reminders</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMemberships.map((membership) => {
                    const daysRemaining = getDaysRemaining(membership.end_date);
                    const expirationStatus = getExpirationStatus(membership);
                    
                    return (
                      <TableRow 
                        key={membership.id}
                        className={expirationStatus?.status === 'critical' ? 'bg-red-50' : 
                                   expirationStatus?.status === 'warning' ? 'bg-yellow-50' : ''}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={membership.logo_url} 
                              alt={membership.company_name}
                              className="h-10 w-10 object-contain rounded"
                            />
                            <div>
                              <div className="font-medium">{membership.company_name}</div>
                              <a 
                                href={membership.website_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Website
                              </a>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{membership.member_name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{membership.member_email || 'No email'}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(membership)}</TableCell>
                        <TableCell>{getPaymentBadge(membership)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Start: {membership.start_date ? new Date(membership.start_date).toLocaleDateString() : '-'}</div>
                            <div>End: {membership.end_date ? new Date(membership.end_date).toLocaleDateString() : '-'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {membership.status === 'active' && daysRemaining !== null ? (
                            <div className="flex items-center gap-2">
                              {expirationStatus && (
                                <Badge className={expirationStatus.color}>
                                  <expirationStatus.icon className="w-3 h-3 mr-1" />
                                  {daysRemaining < 0 ? 'Expired' : `${daysRemaining} days`}
                                </Badge>
                              )}
                              {daysRemaining > 0 && (
                                <Progress 
                                  value={Math.max(0, Math.min(100, (daysRemaining / 30) * 100))} 
                                  className="w-16 h-2"
                                />
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Sent: {membership.reminder_count || 0}</div>
                            {membership.reminder_sent_at && (
                              <div className="text-xs text-gray-500">
                                Last: {new Date(membership.reminder_sent_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {membership.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApprove(membership)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject(membership)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {membership.status === 'active' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSendReminder(membership)}
                                  disabled={sendingReminder === membership.id || !membership.member_email}
                                >
                                  {sendingReminder === membership.id ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Send className="w-3 h-3" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedMembership(membership);
                                    setShowExtendDialog(true);
                                  }}
                                >
                                  <Calendar className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedMembership(membership);
                                setShowDetailDialog(true);
                              }}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Featured Membership Details</DialogTitle>
          </DialogHeader>
          {selectedMembership && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedMembership.logo_url} 
                  alt={selectedMembership.company_name}
                  className="h-20 w-20 object-contain rounded border"
                />
                <div>
                  <h3 className="text-xl font-bold">{selectedMembership.company_name}</h3>
                  <a 
                    href={selectedMembership.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {selectedMembership.website_url}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Member Information</h4>
                  <p><strong>Name:</strong> {selectedMembership.member_name || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedMembership.member_email || 'N/A'}</p>
                  <p><strong>User ID:</strong> {selectedMembership.user_id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <p><strong>Status:</strong> {selectedMembership.payment_status}</p>
                  <p><strong>Amount:</strong> ${selectedMembership.payment_amount || 300}</p>
                  <p><strong>Stripe ID:</strong> {selectedMembership.stripe_payment_intent_id || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Placement Period</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Start Date:</strong> {selectedMembership.start_date ? new Date(selectedMembership.start_date).toLocaleString() : 'Not started'}</p>
                    <p><strong>End Date:</strong> {selectedMembership.end_date ? new Date(selectedMembership.end_date).toLocaleString() : 'Not set'}</p>
                  </div>
                  <div>
                    <p><strong>Days Remaining:</strong> {getDaysRemaining(selectedMembership.end_date) ?? 'N/A'}</p>
                    <p><strong>Auto Expired:</strong> {selectedMembership.auto_expired ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Reminder History</h4>
                <p><strong>Reminders Sent:</strong> {selectedMembership.reminder_count || 0}</p>
                <p><strong>Last Reminder:</strong> {selectedMembership.reminder_sent_at ? new Date(selectedMembership.reminder_sent_at).toLocaleString() : 'Never'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <strong>Renewal Token:</strong> 
                  {selectedMembership.renewal_token ? (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Generated</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const renewalUrl = `${window.location.origin}/renew-featured?token=${selectedMembership.renewal_token}&id=${selectedMembership.id}`;
                          navigator.clipboard.writeText(renewalUrl);
                          toast({
                            title: 'Copied!',
                            description: 'Renewal link copied to clipboard'
                          });
                        }}
                      >
                        Copy Link
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/renew-featured?token=${selectedMembership.renewal_token}&id=${selectedMembership.id}`, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="outline">None</Badge>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>Created: {new Date(selectedMembership.created_at).toLocaleString()}</p>
                <p>Last Updated: {new Date(selectedMembership.updated_at).toLocaleString()}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extend Dialog */}
      <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Membership</DialogTitle>
            <DialogDescription>
              Extend the featured membership placement for {selectedMembership?.company_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Extension Days</label>
              <Input
                type="number"
                value={extensionDays}
                onChange={(e) => setExtensionDays(Number(e.target.value))}
                min={1}
                max={365}
              />
              <p className="text-xs text-gray-500 mt-1">
                Current end date: {selectedMembership?.end_date ? new Date(selectedMembership.end_date).toLocaleDateString() : 'Not set'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExtendDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExtendMembership}>
              Extend by {extensionDays} Days
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
