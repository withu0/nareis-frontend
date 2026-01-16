import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Ban, CheckCircle, RefreshCw, Database, HardDrive, Trash2, UserPlus, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { fetchMembersRaw, SupabaseMember } from '@/lib/memberService';
import { membersDirectory } from '@/data/membersDirectory';

export default function MemberManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [members, setMembers] = useState<SupabaseMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDatabase, setFromDatabase] = useState(false);
  const [showDatabaseOnly, setShowDatabaseOnly] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteAuthDialogOpen, setDeleteAuthDialogOpen] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', firstName: '', lastName: '', tier: 'foundation' });

  const getSampleMembers = (): SupabaseMember[] => membersDirectory.map(m => ({
    id: m.id, first_name: m.name.split(' ')[0], last_name: m.name.split(' ').slice(1).join(' '),
    email: m.email, company: m.company, phone: m.phone, website: m.website || null, role: m.title,
    bio: m.bio, membership_tier: m.membershipTier, membership_status: 'active', approval_status: 'approved',
    city: m.location.split(',')[0]?.trim() || null, state: m.state, avatar_url: m.image,
    linkedin_url: m.linkedin || null, property_types: m.expertise, investment_strategies: null,
    membership_start_date: m.joinedDate, onboarding_completed: true, created_at: m.joinedDate
  }));

  const fetchMembers = async () => {
    setLoading(true);
    const result = await fetchMembersRaw();
    setDebugInfo(`Database returned ${result.data.length} records`);
    if (result.data.length > 0) { setMembers(result.data); setFromDatabase(true); }
    else if (showDatabaseOnly) { setMembers([]); setFromDatabase(true); }
    else { setMembers(getSampleMembers()); setFromDatabase(false); }
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, [showDatabaseOnly]);

  const handleDeleteAuthUser = async () => {
    if (!deleteEmail) return;
    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-delete-user', { body: { email: deleteEmail } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: 'Success', description: `User ${deleteEmail} deleted from auth` });
      setDeleteAuthDialogOpen(false);
      setDeleteEmail('');
      fetchMembers();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setDeleting(false);
  };

  const handleAddUser = async () => {
    if (!newUser.email) { toast({ title: 'Error', description: 'Email required', variant: 'destructive' }); return; }
    const { error } = await supabase.from('customers').insert({ email: newUser.email, first_name: newUser.firstName, last_name: newUser.lastName, membership_tier: newUser.tier, membership_status: 'active', approval_status: 'approved', created_at: new Date().toISOString() });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Success' }); setAddDialogOpen(false); setNewUser({ email: '', firstName: '', lastName: '', tier: 'foundation' }); fetchMembers(); }
  };

  const filteredMembers = members.filter(m => {
    const name = `${m.first_name || ''} ${m.last_name || ''}`.toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || (m.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'active') return matchesSearch && m.membership_status === 'active';
    return matchesSearch && m.approval_status === 'pending';
  });

  const handleDelete = async (id: string, name: string) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) toast({ title: 'Error', variant: 'destructive' });
    else { toast({ title: 'Deleted' }); fetchMembers(); }
  };

  const handleToggleStatus = async (id: string, status: string | null) => {
    const newStatus = status === 'active' ? 'suspended' : 'active';
    await supabase.from('customers').update({ membership_status: newStatus }).eq('id', id);
    fetchMembers();
  };

  const getStatusBadge = (m: SupabaseMember) => {
    if (m.membership_status === 'suspended') return <Badge variant="destructive">Suspended</Badge>;
    if (m.membership_status === 'active') return <Badge className="bg-green-600">Active</Badge>;
    return <Badge variant="outline">New</Badge>;
  };

  if (loading) return <Card className="p-12 flex justify-center"><RefreshCw className="h-8 w-8 animate-spin" /></Card>;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Member Management</h2>
          <Badge variant={fromDatabase ? "default" : "secondary"}>{fromDatabase ? <><Database className="h-3 w-3 mr-1" />Live</> : <><HardDrive className="h-3 w-3 mr-1" />Sample</>}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={deleteAuthDialogOpen} onOpenChange={setDeleteAuthDialogOpen}>
            <DialogTrigger asChild><Button size="sm" variant="destructive"><UserX className="h-4 w-4 mr-1" />Delete Auth User</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Delete User from Auth</DialogTitle></DialogHeader>
              <p className="text-sm text-gray-600 mb-4">This will permanently delete the user from Supabase Auth AND the customers table. Use for test accounts.</p>
              <div className="space-y-4">
                <div><Label>Email Address</Label><Input placeholder="rick@theraisegroup.com" value={deleteEmail} onChange={e => setDeleteEmail(e.target.value)} /></div>
                <Button onClick={handleDeleteAuthUser} disabled={deleting || !deleteEmail} variant="destructive" className="w-full">{deleting ? 'Deleting...' : 'Delete User Permanently'}</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild><Button size="sm"><UserPlus className="h-4 w-4 mr-1" />Add</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Customer Record</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div><Label>Email *</Label><Input value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} /></div>
                <div><Label>First Name</Label><Input value={newUser.firstName} onChange={e => setNewUser({...newUser, firstName: e.target.value})} /></div>
                <div><Label>Last Name</Label><Input value={newUser.lastName} onChange={e => setNewUser({...newUser, lastName: e.target.value})} /></div>
                <Button onClick={handleAddUser} className="w-full">Add User</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setShowDatabaseOnly(!showDatabaseOnly)} variant="outline" size="sm">{showDatabaseOnly ? 'Samples' : 'DB Only'}</Button>
          <Button onClick={fetchMembers} variant="outline" size="sm"><RefreshCw className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm">{debugInfo}</div>
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" /></div>
        <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="pending">Pending</SelectItem></SelectContent></Select>
      </div>
      {filteredMembers.length === 0 ? (<div className="text-center py-12 bg-gray-50 rounded"><p className="text-gray-500 mb-4">No members in database</p></div>) : (
        <table className="min-w-full divide-y"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y">{filteredMembers.map(m => (<tr key={m.id} className="hover:bg-gray-50"><td className="px-4 py-3"><div className="font-medium">{m.first_name} {m.last_name}</div><div className="text-xs text-gray-500">{m.email}</div></td><td className="px-4 py-3"><Badge variant="outline">{m.membership_tier || 'foundation'}</Badge></td><td className="px-4 py-3">{getStatusBadge(m)}</td><td className="px-4 py-3 text-right space-x-1"><Button size="sm" variant="ghost" onClick={() => handleToggleStatus(m.id, m.membership_status)}>{m.membership_status === 'active' ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}</Button><AlertDialog><AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-red-600"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete {m.first_name}?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(m.id, `${m.first_name}`)} className="bg-red-600">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></td></tr>))}</tbody></table>)}
    </Card>
  );
}