import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { emailService } from '@/lib/emailService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  CheckCircle, XCircle, Eye, RefreshCw, ArrowLeft, Search, 
  Filter, Clock, Users, UserCheck, UserX, Mail, Building2,
  MapPin, Phone, Calendar, CreditCard, AlertCircle, ChevronDown,
  Download, MoreVertical, ExternalLink, Send, Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Application {
  id: string;
  auth_id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  company: string;
  phone: string;
  role: string;
  membership_tier: string;
  membership_status: string;
  approval_status: string;
  created_at: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  approval_notes?: string;
  avatar_url?: string;
  city?: string;
  state?: string;
  bio?: string;
  website?: string;
  linkedin_url?: string;
  stripe_customer_id?: string;
  subscription_status?: string;
  company_size?: string;
  experience?: string;
  property_types?: string[];
  investment_strategies?: string[];
}

const REJECTION_REASONS = [
  'Incomplete application information',
  'Unable to verify professional credentials',
  'Does not meet membership requirements',
  'Duplicate account detected',
  'Suspicious activity or information',
  'Other (please specify)',
];

export default function ApprovalQueue() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('pending');
  
  // Dialog states
  const [detailApp, setDetailApp] = useState<Application | null>(null);
  const [rejectApp, setRejectApp] = useState<Application | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [bulkActionDialog, setBulkActionDialog] = useState<'approve' | 'reject' | null>(null);
  const [bulkReason, setBulkReason] = useState('');

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (app: Application, notes?: string) => {
    setProcessing(app.id);
    try {
      const { error: dbError } = await supabase
        .from('customers')
        .update({ 
          approval_status: 'approved',
          approval_notes: notes || '',
          approved_at: new Date().toISOString(),
          membership_status: 'active'
        })
        .eq('id', app.id);

      if (dbError) throw dbError;

      // Send approval email
      const emailResult = await emailService.sendWelcomeEmail(
        app.email,
        `${app.first_name || ''} ${app.last_name || ''}`.trim() || app.full_name || 'Member',
        app.membership_tier || 'Foundation'
      );

      if (emailResult.success) {
        toast.success(`Application approved! Welcome email sent to ${app.email}`);
      } else {
        toast.success('Application approved! (Email notification may be delayed)');
      }

      fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (app: Application, reason: string) => {
    setProcessing(app.id);
    try {
      const finalReason = reason || 'Application did not meet membership requirements';
      
      const { error: dbError } = await supabase
        .from('customers')
        .update({ 
          approval_status: 'rejected',
          rejection_reason: finalReason,
          rejected_at: new Date().toISOString(),
          membership_status: 'inactive'
        })
        .eq('id', app.id);

      if (dbError) throw dbError;

      // Send rejection email
      const emailResult = await emailService.sendMembershipRejection(
        app.email,
        `${app.first_name || ''} ${app.last_name || ''}`.trim() || app.full_name || 'Applicant',
        finalReason
      );

      if (emailResult.success) {
        toast.success(`Application rejected. Notification sent to ${app.email}`);
      } else {
        toast.success('Application rejected. (Email notification may be delayed)');
      }

      setRejectApp(null);
      setRejectionReason('');
      setCustomReason('');
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    } finally {
      setProcessing(null);
    }
  };

  const handleBulkAction = async () => {
    if (selectedApps.size === 0) return;
    
    const action = bulkActionDialog;
    const appsToProcess = applications.filter(a => selectedApps.has(a.id));
    
    setProcessing('bulk');
    try {
      for (const app of appsToProcess) {
        if (action === 'approve') {
          await handleApprove(app);
        } else if (action === 'reject') {
          await handleReject(app, bulkReason);
        }
      }
      
      toast.success(`${selectedApps.size} application(s) ${action === 'approve' ? 'approved' : 'rejected'}`);
      setSelectedApps(new Set());
      setBulkActionDialog(null);
      setBulkReason('');
    } catch (error) {
      toast.error('Bulk action failed');
    } finally {
      setProcessing(null);
    }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedApps);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedApps(newSelection);
  };

  const selectAllPending = () => {
    const pendingIds = applications
      .filter(a => a.approval_status === 'pending')
      .map(a => a.id);
    setSelectedApps(new Set(pendingIds));
  };

  const filterApplications = (apps: Application[]) => {
    let filtered = apps;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        `${a.first_name} ${a.last_name}`.toLowerCase().includes(search) ||
        a.full_name?.toLowerCase().includes(search) ||
        a.email.toLowerCase().includes(search) ||
        a.company?.toLowerCase().includes(search) ||
        a.city?.toLowerCase().includes(search) ||
        a.state?.toLowerCase().includes(search)
      );
    }

    if (tierFilter !== 'all') {
      filtered = filtered.filter(a => a.membership_tier === tierFilter);
    }

    if (paymentFilter !== 'all') {
      if (paymentFilter === 'paid') {
        filtered = filtered.filter(a => a.subscription_status === 'active' || a.stripe_customer_id);
      } else if (paymentFilter === 'unpaid') {
        filtered = filtered.filter(a => !a.subscription_status || a.subscription_status !== 'active');
      }
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.trim() || a.full_name || '';
        const nameB = `${b.first_name} ${b.last_name}`.trim() || b.full_name || '';
        return nameA.localeCompare(nameB);
      });
    } else if (sortBy === 'tier') {
      const tierOrder = { executive: 0, professional: 1, foundation: 2 };
      filtered.sort((a, b) => 
        (tierOrder[a.membership_tier as keyof typeof tierOrder] || 3) - 
        (tierOrder[b.membership_tier as keyof typeof tierOrder] || 3)
      );
    }

    return filtered;
  };

  const getPaymentStatus = (app: Application) => {
    if (app.subscription_status === 'active') return { label: 'Paid', variant: 'default' as const };
    if (app.stripe_customer_id) return { label: 'Payment Started', variant: 'secondary' as const };
    return { label: 'Unpaid', variant: 'outline' as const };
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'executive': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'professional': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'foundation': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved': return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200"><UserCheck className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected': return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200"><UserX className="w-3 h-3 mr-1" />Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDaysSinceApplication = (date: string) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const pending = filterApplications(applications.filter(a => a.approval_status === 'pending'));
  const approved = filterApplications(applications.filter(a => a.approval_status === 'approved'));
  const rejected = filterApplications(applications.filter(a => a.approval_status === 'rejected'));

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.approval_status === 'pending').length,
    approved: applications.filter(a => a.approval_status === 'approved').length,
    rejected: applications.filter(a => a.approval_status === 'rejected').length,
    paidPending: applications.filter(a => a.approval_status === 'pending' && (a.subscription_status === 'active' || a.stripe_customer_id)).length,
  };

  const renderApplicationCard = (app: Application, showActions: boolean = true) => {
    const name = `${app.first_name || ''} ${app.last_name || ''}`.trim() || app.full_name || 'Unknown';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const paymentStatus = getPaymentStatus(app);
    const isPending = app.approval_status === 'pending';

    return (
      <Card key={app.id} className={`mb-4 transition-all hover:shadow-md ${selectedApps.has(app.id) ? 'ring-2 ring-blue-500' : ''}`}>
        <CardContent className="p-6">
          <div className="flex gap-4">
            {isPending && (
              <div className="flex items-start pt-1">
                <Checkbox
                  checked={selectedApps.has(app.id)}
                  onCheckedChange={() => toggleSelection(app.id)}
                />
              </div>
            )}
            
            <Avatar className="h-16 w-16 border-2 border-gray-100">
              <AvatarImage src={app.avatar_url} alt={name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {app.email}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${getTierBadgeColor(app.membership_tier)} border`}>
                    {app.membership_tier || 'Foundation'}
                  </Badge>
                  <Badge variant={paymentStatus.variant}>
                    <CreditCard className="w-3 h-3 mr-1" />
                    {paymentStatus.label}
                  </Badge>
                  {getStatusBadge(app.approval_status)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-4">
                {app.company && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{app.company}</span>
                  </div>
                )}
                {(app.city || app.state) && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{[app.city, app.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {app.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{app.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{getDaysSinceApplication(app.created_at)}</span>
                </div>
              </div>

              {app.bio && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{app.bio}</p>
              )}

              {app.rejection_reason && app.approval_status === 'rejected' && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-700">
                    <strong>Rejection Reason:</strong> {app.rejection_reason}
                  </p>
                </div>
              )}

              {showActions && isPending && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <Button 
                    onClick={() => handleApprove(app)} 
                    size="sm"
                    disabled={processing === app.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processing === app.id ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    )}
                    Approve
                  </Button>
                  <Button 
                    onClick={() => setRejectApp(app)} 
                    variant="destructive" 
                    size="sm"
                    disabled={processing === app.id}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => setDetailApp(app)} 
                    variant="outline" 
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(`mailto:${app.email}`, '_blank')}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      {app.linkedin_url && (
                        <DropdownMenuItem onClick={() => window.open(app.linkedin_url, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View LinkedIn
                        </DropdownMenuItem>
                      )}
                      {app.website && (
                        <DropdownMenuItem onClick={() => window.open(app.website, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {!isPending && (
                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    onClick={() => setDetailApp(app)} 
                    variant="outline" 
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Approval Queue</h1>
                <p className="text-sm text-gray-500">Review and manage member applications</p>
              </div>
            </div>
            <Button onClick={fetchApplications} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('pending')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              {stats.paidPending > 0 && (
                <p className="text-xs text-green-600 mt-2">{stats.paidPending} with payment</p>
              )}
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('approved')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('rejected')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <UserX className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Applications</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <div className="flex-1 bg-green-200 h-2 rounded-full" style={{ width: `${(stats.approved / stats.total) * 100}%` }} />
                <div className="flex-1 bg-yellow-200 h-2 rounded-full" style={{ width: `${(stats.pending / stats.total) * 100}%` }} />
                <div className="flex-1 bg-red-200 h-2 rounded-full" style={{ width: `${(stats.rejected / stats.total) * 100}%` }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Membership Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="foundation">Foundation</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="tier">Tier (High-Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedApps.size > 0 && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="font-medium text-blue-800">
                  {selectedApps.size} application(s) selected
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={() => setBulkActionDialog('approve')} 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={processing === 'bulk'}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve All
                  </Button>
                  <Button 
                    onClick={() => setBulkActionDialog('reject')} 
                    variant="destructive" 
                    size="sm"
                    disabled={processing === 'bulk'}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject All
                  </Button>
                  <Button 
                    onClick={() => setSelectedApps(new Set())} 
                    variant="outline" 
                    size="sm"
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Applications Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="h-4 w-4" />
                Pending ({pending.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                <UserCheck className="h-4 w-4" />
                Approved ({approved.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                <UserX className="h-4 w-4" />
                Rejected ({rejected.length})
              </TabsTrigger>
            </TabsList>

            {activeTab === 'pending' && pending.length > 0 && (
              <Button variant="outline" size="sm" onClick={selectAllPending}>
                Select All Pending
              </Button>
            )}
          </div>

          <TabsContent value="pending">
            {pending.length === 0 ? (
              <Card className="p-12 text-center">
                <UserCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-500">No pending applications to review.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pending.map(app => renderApplicationCard(app))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved">
            {approved.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No approved applications</h3>
                <p className="text-gray-500">Approved members will appear here.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {approved.map(app => renderApplicationCard(app, false))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected">
            {rejected.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No rejected applications</h3>
                <p className="text-gray-500">Rejected applications will appear here.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {rejected.map(app => renderApplicationCard(app, false))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Application Detail Dialog */}
      <Dialog open={detailApp !== null} onOpenChange={(open) => !open && setDetailApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {detailApp && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-gray-100">
                  <AvatarImage src={detailApp.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-semibold">
                    {`${detailApp.first_name || ''} ${detailApp.last_name || ''}`.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {`${detailApp.first_name || ''} ${detailApp.last_name || ''}`.trim() || detailApp.full_name || 'Unknown'}
                  </h3>
                  <p className="text-gray-500">{detailApp.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={`${getTierBadgeColor(detailApp.membership_tier)} border`}>
                      {detailApp.membership_tier || 'Foundation'}
                    </Badge>
                    {getStatusBadge(detailApp.approval_status)}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">Company</Label>
                  <p className="font-medium">{detailApp.company || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Role</Label>
                  <p className="font-medium">{detailApp.role || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Phone</Label>
                  <p className="font-medium">{detailApp.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Location</Label>
                  <p className="font-medium">{[detailApp.city, detailApp.state].filter(Boolean).join(', ') || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Company Size</Label>
                  <p className="font-medium">{detailApp.company_size || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Experience</Label>
                  <p className="font-medium">{detailApp.experience || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Applied</Label>
                  <p className="font-medium">{new Date(detailApp.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Payment Status</Label>
                  <Badge variant={getPaymentStatus(detailApp).variant}>
                    {getPaymentStatus(detailApp).label}
                  </Badge>
                </div>
              </div>

              {detailApp.bio && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-gray-500">Bio</Label>
                    <p className="mt-1 text-gray-700">{detailApp.bio}</p>
                  </div>
                </>
              )}

              {detailApp.property_types && detailApp.property_types.length > 0 && (
                <div>
                  <Label className="text-gray-500">Property Types</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {detailApp.property_types.map((type, i) => (
                      <Badge key={i} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {detailApp.investment_strategies && detailApp.investment_strategies.length > 0 && (
                <div>
                  <Label className="text-gray-500">Investment Strategies</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {detailApp.investment_strategies.map((strategy, i) => (
                      <Badge key={i} variant="outline">{strategy}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {(detailApp.website || detailApp.linkedin_url) && (
                <>
                  <Separator />
                  <div className="flex gap-4">
                    {detailApp.website && (
                      <Button variant="outline" size="sm" onClick={() => window.open(detailApp.website, '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Website
                      </Button>
                    )}
                    {detailApp.linkedin_url && (
                      <Button variant="outline" size="sm" onClick={() => window.open(detailApp.linkedin_url, '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    )}
                  </div>
                </>
              )}

              {detailApp.approval_status === 'pending' && (
                <>
                  <Separator />
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        handleApprove(detailApp);
                        setDetailApp(null);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={processing === detailApp.id}
                    >
                      {processing === detailApp.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approve Application
                    </Button>
                    <Button 
                      onClick={() => {
                        setDetailApp(null);
                        setRejectApp(detailApp);
                      }}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectApp !== null} onOpenChange={(open) => !open && setRejectApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application. The applicant will be notified via email.
            </DialogDescription>
          </DialogHeader>
          {rejectApp && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar>
                  <AvatarImage src={rejectApp.avatar_url} />
                  <AvatarFallback>
                    {`${rejectApp.first_name || ''} ${rejectApp.last_name || ''}`.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {`${rejectApp.first_name || ''} ${rejectApp.last_name || ''}`.trim() || rejectApp.full_name}
                  </p>
                  <p className="text-sm text-gray-500">{rejectApp.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rejection Reason</Label>
                <Select value={rejectionReason} onValueChange={setRejectionReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    {REJECTION_REASONS.map((reason) => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {rejectionReason === 'Other (please specify)' && (
                <div className="space-y-2">
                  <Label>Custom Reason</Label>
                  <Textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Please specify the reason for rejection..."
                    rows={3}
                  />
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    An email will be sent to the applicant explaining the rejection reason.
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectApp(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                const reason = rejectionReason === 'Other (please specify)' 
                  ? customReason 
                  : rejectionReason;
                if (rejectApp) handleReject(rejectApp, reason);
              }}
              disabled={!rejectionReason || (rejectionReason === 'Other (please specify)' && !customReason) || processing === rejectApp?.id}
            >
              {processing === rejectApp?.id ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Reject & Notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Confirmation Dialog */}
      <AlertDialog open={bulkActionDialog !== null} onOpenChange={(open) => !open && setBulkActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bulk {bulkActionDialog === 'approve' ? 'Approve' : 'Reject'} Applications
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to {bulkActionDialog} {selectedApps.size} application(s). 
              {bulkActionDialog === 'approve' 
                ? ' Each applicant will receive a welcome email.'
                : ' Each applicant will receive a rejection notification.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {bulkActionDialog === 'reject' && (
            <div className="space-y-2 py-4">
              <Label>Rejection Reason (applies to all)</Label>
              <Textarea
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={3}
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkAction}
              className={bulkActionDialog === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              disabled={bulkActionDialog === 'reject' && !bulkReason}
            >
              {processing === 'bulk' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : bulkActionDialog === 'approve' ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Confirm {bulkActionDialog === 'approve' ? 'Approval' : 'Rejection'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
