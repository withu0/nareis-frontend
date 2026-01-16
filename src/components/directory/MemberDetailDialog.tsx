import { Member } from '@/types/member';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe, Linkedin, MapPin, Briefcase, Calendar, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface MemberDetailDialogProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberDetailDialog({ member, open, onOpenChange }: MemberDetailDialogProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      toast({
        title: 'Connection Request Sent',
        description: `Your connection request has been sent to ${member.name}.`,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Member Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{member.name}</h2>
              <p className="text-muted-foreground">{member.title}</p>
              <p className="font-medium text-primary">{member.company}</p>
              <Badge className="mt-2">{member.membershipTier.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Member</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{member.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <span>{member.industry}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Member since {new Date(member.joinedDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-muted-foreground">{member.bio}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Areas of Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {member.expertise.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = `mailto:${member.email}`}>
                <Mail className="h-4 w-4 mr-2" />
                {member.email}
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = `tel:${member.phone}`}>
                <Phone className="h-4 w-4 mr-2" />
                {member.phone}
              </Button>
              {member.website && (
                <Button variant="outline" className="w-full justify-start" onClick={() => window.open(member.website, '_blank')}>
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              )}
              {member.linkedin && (
                <Button variant="outline" className="w-full justify-start" onClick={() => window.open(member.linkedin, '_blank')}>
                  <Linkedin className="h-4 w-4 mr-2" />
                  Connect on LinkedIn
                </Button>
              )}
            </div>
          </div>

          <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
            <UserPlus className="h-4 w-4 mr-2" />
            {isConnecting ? 'Sending...' : 'Send Connection Request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
