import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  locationType: 'in-person' | 'virtual' | 'hybrid';
  attendees: number;
  registered: boolean;
}

export default function UpcomingEventsCard() {
  const navigate = useNavigate();

  const events: Event[] = [
    {
      id: '1',
      title: 'Real Estate Investment Summit 2025',
      date: '2025-11-15T09:00:00',
      location: 'Convention Center, Lagos',
      locationType: 'in-person',
      attendees: 156,
      registered: true
    },
    {
      id: '2',
      title: 'Quarterly Market Outlook Webinar',
      date: '2025-11-20T14:00:00',
      location: 'Online',
      locationType: 'virtual',
      attendees: 89,
      registered: false
    },
    {
      id: '3',
      title: 'Networking Mixer - Abuja Chapter',
      date: '2025-11-25T18:00:00',
      location: 'Transcorp Hilton, Abuja',
      locationType: 'in-person',
      attendees: 45,
      registered: true
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Events happening soon</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold">{event.title}</h4>
              {event.registered && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  Registered
                </Badge>
              )}
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(event.date), 'PPP')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{format(new Date(event.date), 'p')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{event.attendees} attending</span>
              </div>
            </div>

            <Button 
              size="sm" 
              variant={event.registered ? "outline" : "default"}
              className="w-full"
              onClick={() => navigate('/events')}
            >
              {event.registered ? 'View Details' : 'Register Now'}
            </Button>
          </div>
        ))}
        
        <Button variant="outline" className="w-full" onClick={() => navigate('/events')}>
          View All Events
        </Button>
      </CardContent>
    </Card>
  );
}
