import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { eventsAPI } from '@/lib/api';
import { Plus, Edit, Trash, Users, RefreshCw, ImageIcon, X, Calendar as CalendarIcon, MapPin, Video, DollarSign, Users as UsersIcon, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [submitting, setSubmitting] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<BackendEvent | null>(null);
  const [showAttendeesDialog, setShowAttendeesDialog] = useState(false);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    locationType: 'in-person',
    virtualLink: '',
    isVirtual: false,
    maxAttendees: '',
    eventType: 'Networking',
    status: 'upcoming',
    isFree: true,
    price: '',
    memberOnly: false,
    waitlistEnabled: true,
    category: 'Networking'
  });
  const [isViewOnly, setIsViewOnly] = useState(false);

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
      locationType: 'in-person',
      virtualLink: '',
      isVirtual: false,
      maxAttendees: '',
      eventType: 'Networking',
      status: 'upcoming',
      isFree: true,
      price: '',
      memberOnly: false,
      waitlistEnabled: true,
      category: 'Networking'
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingEvent(null);
  };

  const handleEdit = (event: BackendEvent) => {
    setEditingEvent(event);
    
    // Determine if this is view-only mode based on event status
    const permissions = getEventPermissions(event.status);
    setIsViewOnly(permissions.editMode === 'view' || permissions.editMode === 'none');
    
    setFormData({
      title: event.title,
      description: event.description,
      startDate: event.startDate.slice(0, 16), // Format for datetime-local input
      endDate: event.endDate ? event.endDate.slice(0, 16) : '',
      location: event.location,
      locationType: event.isVirtual ? 'virtual' : 'in-person',
      virtualLink: event.virtualLink || '',
      isVirtual: event.isVirtual,
      maxAttendees: event.maxAttendees?.toString() || '',
      eventType: event.eventType,
      status: event.status,
      isFree: true,
      price: '',
      memberOnly: false,
      waitlistEnabled: true,
      category: event.eventType
    });
    // Show existing image preview if available
    if (event.imageUrl) {
      const backendUrl = 'http://localhost:5000';
      setImagePreview(`${backendUrl}${event.imageUrl}`);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
    setShowCreateDialog(true);
  };

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
      
      // Generate preview
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
    
    // Validate capacity - must be a positive number
    if (!formData.maxAttendees || parseInt(formData.maxAttendees) < 1) {
      toast({ 
        title: 'Error', 
        description: 'Event capacity must be at least 1 attendee', 
        variant: 'destructive' 
      });
      return;
    }
    
    setSubmitting(true);
    try {
      // Use FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('eventType', formData.category);
      formDataToSend.append('startDate', new Date(formData.startDate).toISOString());
      
      if (formData.endDate) {
        formDataToSend.append('endDate', new Date(formData.endDate).toISOString());
      }
      
      // Handle location based on virtual/in-person
      const isVirtual = formData.locationType === 'virtual' || formData.locationType === 'hybrid';
      if (formData.locationType === 'virtual') {
        formDataToSend.append('location', 'Online');
      } else {
        formDataToSend.append('location', formData.location.trim());
      }
      
      if (formData.virtualLink && formData.locationType !== 'in-person') {
        formDataToSend.append('virtualLink', formData.virtualLink.trim());
      }
      
      formDataToSend.append('isVirtual', isVirtual.toString());
      
      // Capacity is now always required
      formDataToSend.append('maxAttendees', formData.maxAttendees);
      
      formDataToSend.append('status', formData.status);
      formDataToSend.append('isFree', formData.isFree.toString());
      
      if (!formData.isFree && formData.price) {
        formDataToSend.append('price', formData.price);
      }
      
      formDataToSend.append('memberOnly', formData.memberOnly.toString());
      formDataToSend.append('waitlistEnabled', formData.waitlistEnabled.toString());
      
      // Append image file if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
        console.log('📸 Image added to FormData:', imageFile.name, imageFile.size);
      }

      console.log('Submitting event with FormData');

      if (editingEvent) {
        await eventsAPI.update(editingEvent.id, formDataToSend);
        toast({ title: 'Success', description: 'Event updated successfully' });
      } else {
        await eventsAPI.create(formDataToSend);
        toast({ title: 'Success', description: 'Event created successfully' });
      }

      setShowCreateDialog(false);
      resetForm();
      fetchEvents();
    } catch (error: any) {
      console.error('Event save error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to save event', variant: 'destructive' });
    } finally {
      setSubmitting(false);
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
      console.log('📊 Fetching attendees for event:', eventId);
      const response = await eventsAPI.getRegistrations(eventId);
      console.log('📊 Attendees response:', response);
      console.log('📊 Registrations data:', response.data?.registrations);
      
      const attendees = response.data?.registrations || [];
      console.log('📊 Attendees count:', attendees.length);
      if (attendees.length > 0) {
        console.log('📊 First attendee structure:', attendees[0]);
      }
      
      setSelectedEventAttendees(attendees);
      setShowAttendeesDialog(true);
    } catch (error: any) {
      console.error('❌ Error fetching attendees:', error);
      toast({ title: 'Error', description: error.message || 'Failed to fetch attendees', variant: 'destructive' });
    }
  };

  // Get status badge styling with distinct, vibrant colors
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: {
        className: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 font-semibold',
        label: 'Upcoming'
      },
      ongoing: {
        className: 'bg-green-600 text-white border-green-600 hover:bg-green-700 font-semibold',
        label: 'Ongoing'
      },
      completed: {
        className: 'bg-slate-600 text-white border-slate-600 hover:bg-slate-700 font-semibold',
        label: 'Completed'
      },
      cancelled: {
        className: 'bg-red-600 text-white border-red-600 hover:bg-red-700 font-semibold',
        label: 'Cancelled'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
    
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Event status permissions logic
  const getEventPermissions = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          canRegister: true,
          canEdit: true,
          registerIcon: CheckCircle,
          registerColor: 'text-green-600',
          registerText: 'Yes',
          editIcon: CheckCircle,
          editColor: 'text-green-600',
          editText: 'Yes',
          editMode: 'full'
        };
      case 'ongoing':
        return {
          canRegister: true,
          canEdit: true,
          registerIcon: AlertTriangle,
          registerColor: 'text-yellow-600',
          registerText: 'Maybe',
          editIcon: AlertTriangle,
          editColor: 'text-yellow-600',
          editText: 'Limited',
          editMode: 'limited'
        };
      case 'completed':
        return {
          canRegister: false,
          canEdit: false,
          registerIcon: XCircle,
          registerColor: 'text-red-600',
          registerText: 'No',
          editIcon: XCircle,
          editColor: 'text-red-600',
          editText: 'No',
          editMode: 'none'
        };
      case 'cancelled':
        return {
          canRegister: false,
          canEdit: false,
          registerIcon: XCircle,
          registerColor: 'text-red-600',
          registerText: 'No',
          editIcon: AlertTriangle,
          editColor: 'text-yellow-600',
          editText: 'View only',
          editMode: 'view'
        };
      default:
        return {
          canRegister: true,
          canEdit: true,
          registerIcon: CheckCircle,
          registerColor: 'text-green-600',
          registerText: 'Yes',
          editIcon: CheckCircle,
          editColor: 'text-green-600',
          editText: 'Yes',
          editMode: 'full'
        };
    }
  };

  // Filter events based on search query and status filter
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search by title, description, location, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      {(searchQuery || statusFilter !== 'all') && (
        <div className="text-sm text-gray-600">
          Showing {filteredEvents.length} of {events.length} event{events.length !== 1 ? 's' : ''}
          {searchQuery && ` matching "${searchQuery}"`}
          {statusFilter !== 'all' && ` with status "${statusFilter}"`}
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded">
          <p className="text-gray-500 mb-4">
            {events.length === 0 ? 'No events found' : 'No events match your search criteria'}
          </p>
          {events.length === 0 ? (
            <Button onClick={() => { resetForm(); setShowCreateDialog(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Create First Event
            </Button>
          ) : (
            <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
              Clear Filters
            </Button>
          )}
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
              <TableHead>Can Register?</TableHead>
              <TableHead>Can Edit?</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map(event => {
              const permissions = getEventPermissions(event.status);
              const RegisterIcon = permissions.registerIcon;
              const EditIcon = permissions.editIcon;
              
              return (
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
                    {getStatusBadge(event.status)}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`flex items-center gap-1 ${permissions.registerColor} cursor-help`}>
                            <RegisterIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{permissions.registerText}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {permissions.canRegister 
                              ? event.status === 'ongoing' 
                                ? 'Registration may be limited during the event' 
                                : 'Open for registration'
                              : 'Registration is closed'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`flex items-center gap-1 ${permissions.editColor} cursor-help`}>
                            <EditIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{permissions.editText}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {permissions.editMode === 'full' && 'Full editing access'}
                            {permissions.editMode === 'limited' && 'Limited editing during event'}
                            {permissions.editMode === 'view' && 'View-only access'}
                            {permissions.editMode === 'none' && 'Editing is disabled'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => viewAttendees(event.id)}>
                              <Users className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Attendees</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(event)}
                              disabled={permissions.editMode === 'none'}
                            >
                              {permissions.editMode === 'view' ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <Edit className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {permissions.editMode === 'view' ? 'View Event' : 
                             permissions.editMode === 'none' ? 'Editing Disabled' : 
                             permissions.editMode === 'limited' ? 'Edit (Limited)' : 'Edit Event'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <AlertDialog>
                        <TooltipProvider>
                          <Tooltip>
                            <AlertDialogTrigger asChild>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                            </AlertDialogTrigger>
                            <TooltipContent>Delete Event</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
              );
            })}
          </TableBody>
        </Table>
      )}

      <Dialog open={showCreateDialog} onOpenChange={(open) => { setShowCreateDialog(open); if (!open) { resetForm(); setIsViewOnly(false); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isViewOnly ? (
                <span className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  View Event
                </span>
              ) : (
                `${editingEvent ? 'Edit' : 'Create'} Event`
              )}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input 
                id="title"
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                placeholder="Enter event title"
                required 
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description"
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                rows={3} 
                placeholder="Describe your event..."
                required 
              />
            </div>

            <div>
              <Label htmlFor="image">Event Image</Label>
              <div className="space-y-2">
                {imagePreview ? (
                  <div className="relative inline-block w-full">
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
                <Label htmlFor="startDate">Start Date & Time *</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    id="startDate"
                    type="datetime-local" 
                    value={formData.startDate} 
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                    className="pl-10"
                    required 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endDate">End Date & Time</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    id="endDate"
                    type="datetime-local" 
                    value={formData.endDate} 
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="locationType">Location Type *</Label>
              <Select 
                value={formData.locationType} 
                onValueChange={(val) => setFormData({
                  ...formData, 
                  locationType: val,
                  isVirtual: val === 'virtual' || val === 'hybrid'
                })}
              >
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
                    onChange={(e) => setFormData({...formData, location: e.target.value})} 
                    className="pl-10"
                    placeholder="123 Main St, City, State"
                    required={formData.locationType !== 'virtual'}
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
                    onChange={(e) => setFormData({...formData, virtualLink: e.target.value})} 
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
                  <UsersIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.maxAttendees} 
                    onChange={(e) => setFormData({...formData, maxAttendees: e.target.value})} 
                    className="pl-10"
                    placeholder="e.g. 50"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 1 attendee</p>
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.eventType} 
                  onValueChange={(value) => setFormData({...formData, eventType: value, category: value})}
                >
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

            <div>
              <Label htmlFor="status">Event Status</Label>
              <Select 
                value={formData.status === 'cancelled' ? 'cancelled' : 'running'} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="running">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">●</span>
                      <span>Running</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">●</span>
                      <span>Cancelled</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.status === 'cancelled' 
                  ? 'Event will not take place' 
                  : 'Status auto-updates: upcoming → ongoing → completed'}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold text-sm">Event Pricing</h3>
              <div>
                <Label htmlFor="eventPricing">Cost *</Label>
                <Select 
                  value={formData.isFree ? 'free' : 'paid'} 
                  onValueChange={(val) => setFormData({
                    ...formData, 
                    isFree: val === 'free', 
                    price: val === 'free' ? '' : formData.price
                  })}
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
                      onChange={(e) => setFormData({...formData, price: e.target.value})} 
                      className="pl-10"
                      placeholder="0.00" 
                      required={!formData.isFree}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter the ticket price in USD</p>
                </div>
              )}
            </div>

            {/* Access Settings */}
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
                  onCheckedChange={(checked) => setFormData({...formData, memberOnly: checked})}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="waitlist">Enable Waitlist</Label>
              <Switch
                id="waitlist"
                checked={formData.waitlistEnabled}
                onCheckedChange={(checked) => setFormData({...formData, waitlistEnabled: checked})}
              />
            </div>

            {isViewOnly ? (
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="text-sm font-medium">
                      {editingEvent?.status === 'cancelled' ? 'This event has been cancelled and cannot be edited.' : 'This event cannot be edited.'}
                    </p>
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => { setShowCreateDialog(false); resetForm(); setIsViewOnly(false); }}
                >
                  Close
                </Button>
              </div>
            ) : (
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (editingEvent ? 'Updating...' : 'Creating...') : (editingEvent ? 'Update Event' : 'Create Event')}
              </Button>
            )}
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showAttendeesDialog} onOpenChange={setShowAttendeesDialog}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">Event Registrations ({selectedEventAttendees.length})</DialogTitle>
          </DialogHeader>
          {selectedEventAttendees.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No registrations yet</p>
          ) : (
            <div className="space-y-4">
              <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Name</TableHead>
                      <TableHead className="w-[220px]">Email</TableHead>
                      <TableHead className="w-[140px]">Phone</TableHead>
                      <TableHead className="w-[180px]">Organization</TableHead>
                      <TableHead className="w-[140px]">Tier</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEventAttendees.map((attendee) => (
                      <TableRow key={attendee.id}>
                        <TableCell className="font-medium">{attendee.name || 'N/A'}</TableCell>
                        <TableCell className="text-sm">{attendee.email || 'N/A'}</TableCell>
                        <TableCell className="text-sm">{attendee.phone || '-'}</TableCell>
                        <TableCell className="text-sm">{attendee.organization || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{attendee.membershipTier || 'Free'}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={attendee.status === 'registered' ? 'default' : 'secondary'} className="text-xs">
                            {attendee.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-sm text-gray-500 text-right pt-2 border-t">
                Total Registrations: {selectedEventAttendees.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
