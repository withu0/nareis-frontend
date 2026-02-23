import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, MapPin, Users, Video, DollarSign, Image as ImageIcon, X } from 'lucide-react';
import { eventsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';


interface EventCreationFormProps {
  onSuccess: () => void;
}

export function EventCreationForm({ onSuccess }: EventCreationFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    endDate: '',
    location: '',
    locationType: 'in-person',
    virtualLink: '',
    capacity: '',
    category: 'Networking',
    tierAccess: 'all',
    waitlistEnabled: true,
    isFree: true,
    price: '',
    memberOnly: false
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Error', description: 'Please select an image file', variant: 'destructive' });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: 'Error', description: 'Image size must be less than 10MB', variant: 'destructive' });
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Validate required fields
    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Event title is required', variant: 'destructive' });
      return;
    }
    if (!formData.description.trim()) {
      toast({ title: 'Error', description: 'Event description is required', variant: 'destructive' });
      return;
    }
    if (!formData.eventDate) {
      toast({ title: 'Error', description: 'Start date and time is required', variant: 'destructive' });
      return;
    }
    // For non-virtual events, location address is required
    if (formData.locationType !== 'virtual' && !formData.location.trim()) {
      toast({ title: 'Error', description: 'Event location address is required for in-person events', variant: 'destructive' });
      return;
    }
    // For virtual events, virtual link should be provided
    if (formData.locationType === 'virtual' && !formData.virtualLink.trim()) {
      toast({ title: 'Error', description: 'Virtual meeting link is required for virtual events', variant: 'destructive' });
      return;
    }
    // Validate capacity - must be a positive number
    if (!formData.capacity || parseInt(formData.capacity) < 1) {
      toast({ title: 'Error', description: 'Event capacity must be at least 1 attendee', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    try {
      // Determine location based on event type
      let location = formData.location.trim();
      if (formData.locationType === 'virtual') {
        // For virtual events, set location to "Online" if not provided
        location = location || 'Online';
      }
      
      // Use FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('eventType', formData.category);
      formDataToSend.append('startDate', formData.eventDate);
      if (formData.endDate) formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('location', location);
      if (formData.virtualLink?.trim()) formDataToSend.append('virtualLink', formData.virtualLink.trim());
      formDataToSend.append('isVirtual', String(formData.locationType === 'virtual'));
      formDataToSend.append('maxAttendees', formData.capacity); // Capacity is now always required
      formDataToSend.append('status', 'upcoming');
      formDataToSend.append('isFree', String(formData.isFree));
      if (!formData.isFree && formData.price) formDataToSend.append('price', formData.price);
      formDataToSend.append('memberOnly', String(formData.memberOnly));
      formDataToSend.append('waitlistEnabled', String(formData.waitlistEnabled));
      
      // Append image if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      console.log('Creating event with FormData');
      const response = await eventsAPI.create(formDataToSend);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({ title: 'Success', description: 'Event created successfully!' });
      onSuccess();
    } catch (error: any) {
      console.error('Create event error:', error);
      toast({ 
        title: 'Error', 
        description: error.response?.data?.error || error.message || 'Failed to create event', 
        variant: 'destructive' 
      });
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

      <div>
        <Label htmlFor="image">Event Image</Label>
        <div className="space-y-2">
          {imagePreview ? (
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Event preview" 
                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="pl-10"
              />
            </div>
          )}
          <p className="text-xs text-gray-500">
            Upload an image for your event card (max 10MB)
          </p>
        </div>
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
              placeholder="123 Main St, City, State"
              required
            />
          </div>
        </div>
      )}

      {formData.locationType !== 'in-person' && (
        <div>
          <Label htmlFor="virtualLink">
            Virtual Meeting Link {formData.locationType === 'virtual' && '*'}
          </Label>
          <div className="relative">
            <Video className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="virtualLink"
              value={formData.virtualLink}
              onChange={(e) => setFormData({ ...formData, virtualLink: e.target.value })}
              className="pl-10"
              placeholder="https://zoom.us/j/... or https://meet.google.com/..."
              required={formData.locationType === 'virtual'}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="capacity">Capacity *</Label>
          <div className="relative">
            <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="capacity"
              type="number"
              min="0"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="pl-10"
              placeholder="e.g. 50"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum 1 attendee</p>
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Networking">Networking</SelectItem>
              <SelectItem value="Webinar">Webinar</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
              <SelectItem value="Conference">Conference</SelectItem>
              <SelectItem value="Seminar">Seminar</SelectItem>
              <SelectItem value="Training">Training</SelectItem>
              <SelectItem value="Panel Discussion">Panel Discussion</SelectItem>
              <SelectItem value="Meetup">Meetup</SelectItem>
              <SelectItem value="Social Event">Social Event</SelectItem>
              <SelectItem value="Fundraiser">Fundraiser</SelectItem>
              <SelectItem value="Awards Ceremony">Awards Ceremony</SelectItem>
              <SelectItem value="Trade Show">Trade Show</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold text-sm">Event Pricing</h3>
        <div>
          <Label htmlFor="eventPricing">Cost *</Label>
          <Select 
            value={formData.isFree ? 'free' : 'paid'} 
            onValueChange={(val) => setFormData({ ...formData, isFree: val === 'free', price: val === 'free' ? '' : formData.price })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free Event</SelectItem>
              <SelectItem value="paid">Paid Event</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!formData.isFree && (
          <div>
            <Label htmlFor="price">Price Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="pl-10"
                placeholder="0.00"
                required={!formData.isFree}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter the ticket price in USD</p>
          </div>
        )}
      </div>

      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold text-sm">Access Settings</h3>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="memberOnly">Members Only Event</Label>
            <p className="text-xs text-gray-500 mt-1">Only registered members can register</p>
          </div>
          <Switch
            id="memberOnly"
            checked={formData.memberOnly}
            onCheckedChange={(checked) => setFormData({ ...formData, memberOnly: checked })}
          />
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
