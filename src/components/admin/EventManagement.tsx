import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { eventsAPI } from '@/lib/api';
import { Plus, Edit, Trash, Users, RefreshCw } from 'lucide-react';

interface BackendEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate?: string;
  location: string;
  virtualLink?: string;
  isVirtual: boolean;
  maxAttendees?: number;
  registrationDeadline?: string;
  status: string;
  imageUrl?: string;
  registeredCount: number;
}

export default function EventManagement() {
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<BackendEvent | null>(null);
  const [showAttendeesDialog, setShowAttendeesDialog] = useState(false);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState<any[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    virtualLink: '',
    isVirtual: false,
    maxAttendees: '',
    eventType: 'Networking',
    status: 'upcoming',
    imageUrl: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsAPI.getAll();
      if (response.data?.events) {
        setEvents(response.data.events);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to fetch events', variant: 'destructive' });
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      virtualLink: '',
      isVirtual: false,
      maxAttendees: '',
      eventType: 'Networking',
      status: 'upcoming',
      imageUrl: ''
    });
    setEditingEvent(null);
  };

  const handleEdit = (event: BackendEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      startDate: event.startDate.slice(0, 16), // Format for datetime-local input
      endDate: event.endDate ? event.endDate.slice(0, 16) : '',
      location: event.location,
      virtualLink: event.virtualLink || '',
      isVirtual: event.isVirtual,
      maxAttendees: event.maxAttendees?.toString() || '',
      eventType: event.eventType,
      status: event.status,
      imageUrl: event.imageUrl || ''
    });
    setShowCreateDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        location: formData.location,
        virtualLink: formData.virtualLink || undefined,
        isVirtual: formData.isVirtual,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        eventType: formData.eventType,
        status: formData.status,
        imageUrl: formData.imageUrl || undefined
      };

      if (editingEvent) {
        await eventsAPI.update(editingEvent.id, eventData);
        toast({ title: 'Success', description: 'Event updated successfully' });
      } else {
        await eventsAPI.create(eventData);
        toast({ title: 'Success', description: 'Event created successfully' });
      }

      setShowCreateDialog(false);
      resetForm();
      fetchEvents();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save event', variant: 'destructive' });
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await eventsAPI.delete(eventId);
      toast({ title: 'Success', description: 'Event deleted successfully' });
      fetchEvents();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete event', variant: 'destructive' });
    }
  };

  const viewAttendees = async (eventId: string) => {
    try {
      const response = await eventsAPI.getRegistrations(eventId);
      setSelectedEventAttendees(response.data?.registrations || []);
      setShowAttendeesDialog(true);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to fetch attendees', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchEvents}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => { resetForm(); setShowCreateDialog(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Create Event
          </Button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded">
          <p className="text-gray-500 mb-4">No events found</p>
          <Button onClick={() => { resetForm(); setShowCreateDialog(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Create First Event
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map(event => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell><Badge variant="outline">{event.eventType}</Badge></TableCell>
                <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {event.isVirtual ? 'Virtual' : event.location}
                </TableCell>
                <TableCell>
                  {event.registeredCount}
                  {event.maxAttendees ? ` / ${event.maxAttendees}` : ''}
                </TableCell>
                <TableCell>
                  <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => viewAttendees(event.id)}>
                      <Users className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{event.title}" and all its registrations.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(event.id)} className="bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={showCreateDialog} onOpenChange={(open) => { setShowCreateDialog(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit' : 'Create'} Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event Type</Label>
                <Select value={formData.eventType} onValueChange={(value) => setFormData({...formData, eventType: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Networking">Networking</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Webinar">Webinar</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date & Time *</Label>
                <Input type="datetime-local" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
              </div>
              <div>
                <Label>End Date & Time</Label>
                <Input type="datetime-local" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
              </div>
            </div>
            <div>
              <Label>Location *</Label>
              <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Physical address or 'Online'" required />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="isVirtual" checked={formData.isVirtual} onChange={(e) => setFormData({...formData, isVirtual: e.target.checked})} className="rounded" />
              <Label htmlFor="isVirtual">Virtual Event</Label>
            </div>
            {formData.isVirtual && (
              <div>
                <Label>Virtual Link (Zoom, Teams, etc.)</Label>
                <Input value={formData.virtualLink} onChange={(e) => setFormData({...formData, virtualLink: e.target.value})} placeholder="https://..." />
              </div>
            )}
            <div>
              <Label>Max Attendees (optional)</Label>
              <Input type="number" value={formData.maxAttendees} onChange={(e) => setFormData({...formData, maxAttendees: e.target.value})} placeholder="Leave empty for unlimited" />
            </div>
            <div>
              <Label>Image URL (optional)</Label>
              <Input value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
            </div>
            <Button type="submit" className="w-full">{editingEvent ? 'Update' : 'Create'} Event</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showAttendeesDialog} onOpenChange={setShowAttendeesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Event Registrations ({selectedEventAttendees.length})</DialogTitle>
          </DialogHeader>
          {selectedEventAttendees.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No registrations yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedEventAttendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell>{attendee.user?.fullName || 'N/A'}</TableCell>
                    <TableCell>{attendee.user?.email || 'N/A'}</TableCell>
                    <TableCell>{attendee.user?.organization || '-'}</TableCell>
                    <TableCell><Badge>{attendee.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
