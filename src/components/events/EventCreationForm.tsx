import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, MapPin, Users, Video } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';


interface EventCreationFormProps {
  onSuccess: () => void;
}

export function EventCreationForm({ onSuccess }: EventCreationFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    endDate: '',
    location: '',
    locationType: 'in-person',
    virtualLink: '',
    capacity: '',
    category: 'Local Meetup',
    tierAccess: 'all',
    waitlistEnabled: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('events').insert([{
        title: formData.title,
        description: formData.description,
        event_date: formData.eventDate,
        end_date: formData.endDate || null,
        location: formData.location,
        location_type: formData.locationType,
        virtual_link: formData.virtualLink || null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        category: formData.category,
        tier_access: formData.tierAccess,
        waitlist_enabled: formData.waitlistEnabled,
        organizer_id: user.id,
        status: 'upcoming'
      }]);

      if (error) throw error;

      toast({ title: 'Success', description: 'Event created successfully!' });
      onSuccess();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="eventDate">Start Date & Time *</Label>
          <Input
            id="eventDate"
            type="datetime-local"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date & Time</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="locationType">Location Type *</Label>
        <Select value={formData.locationType} onValueChange={(val) => setFormData({ ...formData, locationType: val })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-person">In-Person</SelectItem>
            <SelectItem value="virtual">Virtual</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.locationType !== 'virtual' && (
        <div>
          <Label htmlFor="location">Location Address *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>
      )}

      {formData.locationType !== 'in-person' && (
        <div>
          <Label htmlFor="virtualLink">Virtual Meeting Link</Label>
          <div className="relative">
            <Video className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="virtualLink"
              value={formData.virtualLink}
              onChange={(e) => setFormData({ ...formData, virtualLink: e.target.value })}
              className="pl-10"
              placeholder="https://zoom.us/j/..."
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <div className="relative">
            <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Local Meetup">Local Meetup</SelectItem>
              <SelectItem value="Virtual Session">Virtual Session</SelectItem>
              <SelectItem value="Industry Mixer">Industry Mixer</SelectItem>
              <SelectItem value="Speed Networking">Speed Networking</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
              <SelectItem value="Conference">Conference</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="waitlist">Enable Waitlist</Label>
        <Switch
          id="waitlist"
          checked={formData.waitlistEnabled}
          onCheckedChange={(checked) => setFormData({ ...formData, waitlistEnabled: checked })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating Event...' : 'Create Event'}
      </Button>

    </form>
  );
}
