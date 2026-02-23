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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const imgElement = e.currentTarget;
    
    // Prevent infinite loop - only try fallback once
    if (imgElement.src.includes('placehold.co')) {
      console.error('❌ Even fallback image failed for:', event.title);
      return; // Give up, don't retry
    }
    
    console.error('❌ Failed to load image for event:', event.title, event.image_url);
    console.log('🔄 Using fallback placeholder');
    
    // Use reliable placeholder image with event title
    imgElement.src = `https://placehold.co/800x400/e2e8f0/475569?text=${encodeURIComponent(event.title)}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={event.image_url} 
        alt={event.title} 
        className="w-full h-48 object-cover"
        onError={handleImageError}
      />
      <CardHeader>
        <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant={event.location_type === 'virtual' ? 'secondary' : 'default'}>
            {event.location_type}
          </Badge>
          {event.isFree ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
              FREE
            </Badge>
          ) : (
            <Badge variant="default" className="bg-blue-600 text-white">
              ${event.price?.toFixed(2)}
            </Badge>
          )}
          {event.memberOnly && (
            <Badge variant="outline" className="border-purple-300 text-purple-700">
              Members Only
            </Badge>
          )}
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
