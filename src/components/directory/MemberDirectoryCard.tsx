import { Member } from '@/types/member';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MemberDirectoryCardProps {
  member: Member;
}

export function MemberDirectoryCard({ member }: MemberDirectoryCardProps) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/members/${member.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewProfile}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={member.image}
            alt={member.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{member.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{member.title}</p>
            <p className="text-sm font-medium text-primary truncate">{member.company}</p>
          </div>
          <Badge variant={member.membershipTier === 'founding-lifetime' || member.membershipTier === 'enterprise' ? 'default' : 'secondary'}>
            {member.membershipTier.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Badge>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{member.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>{member.industry}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {member.expertise.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Button size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handleViewProfile(); }}>
            View Profile
          </Button>
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${member.email}`; }}>
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
