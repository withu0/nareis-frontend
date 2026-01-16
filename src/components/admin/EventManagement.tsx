import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/event';
import { Plus, Edit, Trash, Users } from 'lucide-react';

export function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showAttendeesDialog, setShowAttendeesDialog] = useState(false);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState<any[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    location_type: 'in-person',
    capacity: '',
    category: 'Conference',
    tier_access: 'all'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.functions.invoke('event-management', {
        body: {
          action: editingEvent ? 'update' : 'create',
          eventData: formData,
          eventId: editingEvent?.id
        }
      });

      if (error) throw error;

      toast({
        title: editingEvent ? 'Event Updated' : 'Event Created',
        description: 'Event has been saved successfully'
      });
      setShowCreateDialog(false);
      setEditingEvent(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const viewAttendees = async (eventId: string) => {
    try {
      const { data } = await supabase.functions.invoke('event-management', {
        body: { action: 'getAttendees', eventId }
      });
      setSelectedEventAttendees(data?.attendees || []);
      setShowAttendeesDialog(true);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" /> Create Event
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map(event => (
            <TableRow key={event.id}>
              <TableCell>{event.title}</TableCell>
              <TableCell>{new Date(event.event_date).toLocaleDateString()}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.registered_count}/{event.capacity}</TableCell>
              <TableCell><Badge>{event.status}</Badge></TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => viewAttendees(event.id)}>
                  <Users className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit' : 'Create'} Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date & Time</Label>
                <Input type="datetime-local" value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} required />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} />
              </div>
            </div>
            <Button type="submit">Save Event</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
