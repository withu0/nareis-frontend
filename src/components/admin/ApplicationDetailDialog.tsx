import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  website?: string;
  linkedin?: string;
  interests?: string[];
}

interface ApplicationDetailDialogProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApplicationDetailDialog({ application, open, onOpenChange }: ApplicationDetailDialogProps) {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={application.avatar_url} />
              <AvatarFallback>{application.first_name?.[0]}{application.last_name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{application.first_name} {application.last_name}</h3>
              <p className="text-muted-foreground">{application.email}</p>
              <Badge className="mt-1">{application.membership_tier}</Badge>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-medium">Company:</span> {application.company || 'N/A'}</div>
            <div><span className="font-medium">Role:</span> {application.role || 'N/A'}</div>
            <div><span className="font-medium">Phone:</span> {application.phone || 'N/A'}</div>
            <div><span className="font-medium">Location:</span> {application.city}, {application.state}</div>
            <div><span className="font-medium">Applied:</span> {new Date(application.created_at).toLocaleDateString()}</div>
            <div><span className="font-medium">Status:</span> {application.approval_status}</div>
          </div>
          {application.bio && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground">{application.bio}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
