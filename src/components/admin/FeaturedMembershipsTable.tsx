import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function FeaturedMembershipsTable({ memberships, onUpdate }: any) {
  const [extendDialog, setExtendDialog] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<any>(null);
  const [extensionDays, setExtensionDays] = useState(30);
  const { toast } = useToast();

  const getStatusBadge = (membership: any) => {
    const now = new Date();
    const endDate = membership.end_date ? new Date(membership.end_date) : null;
    
    if (membership.status === 'pending') {
      return <Badge variant="outline" className="bg-yellow-50"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
    if (membership.status === 'rejected') {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
    }
    if (endDate && endDate < now) {
      return <Badge variant="outline" className="bg-gray-100">Expired</Badge>;
    }
    if (membership.status === 'active') {
      return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  const handleApprove = async (membership: any) => {
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

      toast({ title: 'Success', description: 'Membership approved' });
      onUpdate();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve', variant: 'destructive' });
    }
  };

  const handleReject = async (membership: any) => {
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
      onUpdate();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject', variant: 'destructive' });
    }
  };

  const handleExtend = async () => {
    if (!selectedMembership) return;

    try {
      const currentEnd = selectedMembership.end_date ? new Date(selectedMembership.end_date) : new Date();
      const newEnd = new Date(currentEnd);
      newEnd.setDate(newEnd.getDate() + extensionDays);

      const { error } = await supabase
        .from('featured_memberships')
        .update({
          end_date: newEnd.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedMembership.id);

      if (error) throw error;

      toast({ title: 'Success', description: `Extended by ${extensionDays} days` });
      setExtendDialog(false);
      onUpdate();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to extend', variant: 'destructive' });
    }
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((membership: any) => (
              <TableRow key={membership.id}>
                <TableCell className="font-medium">{membership.company_name}</TableCell>
                <TableCell>
                  <img src={membership.logo_url} alt={membership.company_name} className="h-8 w-auto" />
                </TableCell>
                <TableCell>
                  <a href={membership.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Visit
                  </a>
                </TableCell>
                <TableCell>
                  {membership.start_date ? new Date(membership.start_date).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  {membership.end_date ? new Date(membership.end_date).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>{getStatusBadge(membership)}</TableCell>
                <TableCell>
                  <Badge variant={membership.payment_status === 'paid' ? 'default' : 'outline'}>
                    ${membership.payment_amount || 300}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {membership.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => handleApprove(membership)}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(membership)}>Reject</Button>
                      </>
                    )}
                    {membership.status === 'active' && (
                      <Button size="sm" variant="outline" onClick={() => {
                        setSelectedMembership(membership);
                        setExtendDialog(true);
                      }}>
                        <Calendar className="w-3 h-3 mr-1" />Extend
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={extendDialog} onOpenChange={setExtendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Membership</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Extension Days</Label>
              <Input
                type="number"
                value={extensionDays}
                onChange={(e) => setExtensionDays(Number(e.target.value))}
                min={1}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtendDialog(false)}>Cancel</Button>
            <Button onClick={handleExtend}>Extend</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
