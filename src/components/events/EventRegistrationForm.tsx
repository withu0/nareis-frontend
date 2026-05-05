import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { eventsAPI } from '@/lib/api';

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  userEmail: string;
  userName: string;
  onSuccess: () => void;
}

export function EventRegistrationForm({ eventId, eventTitle, userEmail, userName, onSuccess }: EventRegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dietaryRequirements: '',
    specialRequests: '',
    guestsCount: 0
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await eventsAPI.register(eventId, {
        numberOfGuests: formData.guestsCount,
        dietaryRequirements: formData.dietaryRequirements,
        specialRequests: formData.specialRequests,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Registration Successful',
        description: response.data?.message || `You've been registered for ${eventTitle}`,
      });
      onSuccess();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.error || error.message || 'Failed to register',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Number of Guests</Label>
        <Input 
          type="number" 
          min="0" 
          max="5"
          value={formData.guestsCount}
          onChange={(e) => setFormData({...formData, guestsCount: parseInt(e.target.value)})}
        />
      </div>
      <div>
        <Label>Dietary Requirements</Label>
        <Textarea 
          value={formData.dietaryRequirements}
          onChange={(e) => setFormData({...formData, dietaryRequirements: e.target.value})}
        />
      </div>
      <div>
        <Label>Special Requests</Label>
        <Textarea 
          value={formData.specialRequests}
          onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Registering...' : 'Complete Registration'}
      </Button>
    </form>
  );
}
