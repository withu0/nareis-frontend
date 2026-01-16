import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { emailService } from '@/lib/emailService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';
import ApplicationFilters from './ApplicationFilters';
import ApplicationDetailDialog from './ApplicationDetailDialog';

interface Application {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  phone: string;
  role: string;
  membership_tier: string;
  approval_status: string;
  created_at: string;
  avatar_url?: string;
  city?: string;
  state?: string;
  bio?: string;
}

export default function ApplicationManagement() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [bulkActionDialog, setBulkActionDialog] = useState<'approve' | 'reject' | null>(null);
  const [bulkNotes, setBulkNotes] = useState('');
  const [detailApp, setDetailApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load applications');
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (app: Application) => {
    try {
      const { error: dbError } = await supabase
        .from('customers')
        .update({ 
          approval_status: 'approved',
          approval_notes: notes[app.id] || '',
          approved_at: new Date().toISOString()
        })
        .eq('id', app.id);

      if (dbError) throw dbError;

      // Send welcome email to newly approved member
      await emailService.sendWelcomeEmail(
        app.email,
        `${app.first_name} ${app.last_name}`,
        app.membership_tier
      );

      toast.success('Application approved! Welcome email sent.');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to approve application');
    }
  };


  const handleReject = async (app: Application) => {
    try {
      const rejectionReason = notes[app.id] || 'Application did not meet membership requirements';
      
      const { error: dbError } = await supabase
        .from('customers')
        .update({ 
          approval_status: 'rejected',
          approval_notes: rejectionReason,
          rejected_at: new Date().toISOString()
        })
        .eq('id', app.id);

      if (dbError) throw dbError;

      await emailService.sendMembershipRejection(
        app.email,
        `${app.first_name} ${app.last_name}`,
        rejectionReason
      );

      toast.success('Application rejected');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to reject application');
    }
  };

  const handleBulkAction = async () => {
    if (selectedApps.size === 0) return;
    
    const action = bulkActionDialog;
    const appsToProcess = applications.filter(a => selectedApps.has(a.id));
    
    try {
      for (const app of appsToProcess) {
        if (action === 'approve') {
          await handleApprove(app);
        } else if (action === 'reject') {
          await handleReject(app);
        }
      }
      
      toast.success(`${selectedApps.size} application(s) ${action}d`);
      setSelectedApps(new Set());
      setBulkActionDialog(null);
      setBulkNotes('');
    } catch (error) {
      toast.error('Bulk action failed');
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

  const filterAndSortApplications = (apps: Application[]) => {
    let filtered = apps;

    if (searchTerm) {
      filtered = filtered.filter(a => 
        `${a.first_name} ${a.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (tierFilter !== 'all') {
      filtered = filtered.filter(a => a.membership_tier === tierFilter);
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`));
    }

    return filtered;
  };

  const renderApplication = (app: Application) => (
    <Card key={app.id} className="p-6 mb-4">
      <div className="flex gap-4">
        <Checkbox
          checked={selectedApps.has(app.id)}
          onCheckedChange={() => toggleSelection(app.id)}
          className="mt-1"
        />
        <Avatar className="h-16 w-16">
          <AvatarImage src={app.avatar_url} />
          <AvatarFallback>{app.first_name?.[0]}{app.last_name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{app.first_name} {app.last_name}</h3>
              <p className="text-sm text-muted-foreground">{app.email}</p>
            </div>
            <Badge>{app.membership_tier}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div><span className="font-medium">Company:</span> {app.company || 'N/A'}</div>
            <div><span className="font-medium">Role:</span> {app.role || 'N/A'}</div>
            <div><span className="font-medium">Applied:</span> {new Date(app.created_at).toLocaleDateString()}</div>
            <div><span className="font-medium">Location:</span> {app.city}, {app.state}</div>
          </div>
          {app.approval_status === 'pending' && (
            <>
              <Textarea
                placeholder="Add notes or rejection reason (optional)"
                value={notes[app.id] || ''}
                onChange={(e) => setNotes({ ...notes, [app.id]: e.target.value })}
                className="mb-3"
              />
              <div className="flex gap-2">
                <Button onClick={() => handleApprove(app)} size="sm">
                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button onClick={() => handleReject(app)} variant="destructive" size="sm">
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button onClick={() => setDetailApp(app)} variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" /> View Details
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );

  const pending = filterAndSortApplications(applications.filter(a => a.approval_status === 'pending'));
  const approved = filterAndSortApplications(applications.filter(a => a.approval_status === 'approved'));
  const rejected = filterAndSortApplications(applications.filter(a => a.approval_status === 'rejected'));

  if (loading) return <div className="flex justify-center p-12"><RefreshCw className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Member Applications</h2>
        <Button onClick={fetchApplications} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <ApplicationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tierFilter={tierFilter}
        setTierFilter={setTierFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {selectedApps.size > 0 && (
        <Card className="p-4 bg-blue-50">
          <div className="flex justify-between items-center">
            <span className="font-medium">{selectedApps.size} application(s) selected</span>
            <div className="flex gap-2">
              <Button onClick={() => setBulkActionDialog('approve')} size="sm">
                Bulk Approve
              </Button>
              <Button onClick={() => setBulkActionDialog('reject')} variant="destructive" size="sm">
                Bulk Reject
              </Button>
              <Button onClick={() => setSelectedApps(new Set())} variant="outline" size="sm">
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          {pending.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              No pending applications
            </Card>
          ) : (
            pending.map(renderApplication)
          )}
        </TabsContent>
        <TabsContent value="approved">
          {approved.map(renderApplication)}
        </TabsContent>
        <TabsContent value="rejected">
          {rejected.map(renderApplication)}
        </TabsContent>
      </Tabs>

      <Dialog open={bulkActionDialog !== null} onOpenChange={() => setBulkActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk {bulkActionDialog === 'approve' ? 'Approve' : 'Reject'} Applications</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>You are about to {bulkActionDialog} {selectedApps.size} application(s).</p>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea
                value={bulkNotes}
                onChange={(e) => setBulkNotes(e.target.value)}
                placeholder={bulkActionDialog === 'reject' ? 'Rejection reason...' : 'Approval notes...'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkActionDialog(null)}>Cancel</Button>
            <Button onClick={handleBulkAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ApplicationDetailDialog
        application={detailApp}
        open={detailApp !== null}
        onOpenChange={(open) => !open && setDetailApp(null)}
      />
    </div>
  );
}
