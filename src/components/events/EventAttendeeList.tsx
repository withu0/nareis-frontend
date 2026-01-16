import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle } from 'lucide-react';

interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  membershipTier: string;
  checkedIn: boolean;
}

interface EventAttendeeListProps {
  attendees: Attendee[];
  capacity?: number;
}

export function EventAttendeeList({ attendees, capacity }: EventAttendeeListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg">
            Attendees ({attendees.length}{capacity ? `/${capacity}` : ''})
          </h3>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {attendees.map((attendee) => (
          <div key={attendee.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <Avatar>
              <AvatarImage src={attendee.avatar} />
              <AvatarFallback>{attendee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{attendee.name}</p>
                {attendee.checkedIn && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
              <p className="text-sm text-gray-600 truncate">{attendee.email}</p>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {attendee.membershipTier}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
