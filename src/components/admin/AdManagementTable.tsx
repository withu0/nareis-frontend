import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Edit, Pause, Play } from 'lucide-react';
import { AdCreationForm } from './AdCreationForm';

interface AdManagementTableProps {
  ads: any[];
  onUpdate: () => void;
}

export function AdManagementTable({ ads, onUpdate }: AdManagementTableProps) {
  const { toast } = useToast();
  const [editingAd, setEditingAd] = useState<any>(null);
  const [rejectingAd, setRejectingAd] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const updateAdStatus = async (adId: string, status: string, reason?: string) => {
    try {
      const updateData: any = { status, updated_at: new Date().toISOString() };
      
      if (status === 'active') {
        updateData.approved_at = new Date().toISOString();
        updateData.approved_by = (await supabase.auth.getUser()).data.user?.id;
      }
      
      if (reason) {
        updateData.rejection_reason = reason;
      }

      const { error } = await supabase
        .from('advertisements')
        .update(updateData)
        .eq('id', adId);

      if (error) throw error;
      toast({ title: `Ad ${status} successfully` });
      onUpdate();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleReject = async () => {
    if (!rejectingAd || !rejectionReason) return;
    await updateAdStatus(rejectingAd.id, 'rejected', rejectionReason);
    setRejectingAd(null);
    setRejectionReason('');
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      active: 'default',
      pending: 'secondary',
      paused: 'outline',
      rejected: 'destructive',
      expired: 'outline'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Advertiser</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Placement</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Impressions</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>CTR</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads.map((ad) => {
            const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00';
            return (
              <TableRow key={ad.id}>
                <TableCell className="font-medium">{ad.title}</TableCell>
                <TableCell>{ad.advertiser_name}</TableCell>
                <TableCell>{ad.ad_type}</TableCell>
                <TableCell className="text-xs">{ad.placement}</TableCell>
                <TableCell>{getStatusBadge(ad.status)}</TableCell>
                <TableCell className="text-xs">
                  {new Date(ad.start_date).toLocaleDateString()} - {new Date(ad.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell>${ad.budget}</TableCell>
                <TableCell>{ad.impressions.toLocaleString()}</TableCell>
                <TableCell>{ad.clicks.toLocaleString()}</TableCell>
                <TableCell>{ctr}%</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {ad.status === 'pending' && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => updateAdStatus(ad.id, 'active')}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setRejectingAd(ad)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {ad.status === 'active' && (
                      <Button size="sm" variant="ghost" onClick={() => updateAdStatus(ad.id, 'paused')}>
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {ad.status === 'paused' && (
                      <Button size="sm" variant="ghost" onClick={() => updateAdStatus(ad.id, 'active')}>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setEditingAd(ad)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={!!editingAd} onOpenChange={() => setEditingAd(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Advertisement</DialogTitle>
          </DialogHeader>
          <AdCreationForm editAd={editingAd} onSuccess={() => { setEditingAd(null); onUpdate(); }} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!rejectingAd} onOpenChange={() => setRejectingAd(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Advertisement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <Button onClick={handleReject} disabled={!rejectionReason}>
              Reject Ad
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
