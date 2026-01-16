import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Event } from '@/types/event';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onRegister: (eventId: string) => void;
  isRegistered?: boolean;
}

export function EventCard({ event, onRegister, isRegistered }: EventCardProps) {
  const isFull = event.capacity && event.registered_count && event.registered_count >= event.capacity;
  const spotsLeft = event.capacity ? event.capacity - (event.registered_count || 0) : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <Badge variant={event.location_type === 'virtual' ? 'secondary' : 'default'}>
            {event.location_type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {format(new Date(event.event_date), 'PPP p')}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {event.location}
        </div>
        {event.capacity && (
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {spotsLeft} spots left
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onRegister(event.id)} 
          disabled={isRegistered || isFull}
          className="w-full"
        >
          {isRegistered ? 'Registered' : isFull ? 'Join Waitlist' : 'Register'}
        </Button>
      </CardFooter>
    </Card>
  );
}
