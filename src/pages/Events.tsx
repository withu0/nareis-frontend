import { useState, useEffect, useMemo } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { BackButton } from '@/components/ui/back-button';
import { EventCard } from '@/components/events/EventCard';
import { CalendarView } from '@/components/events/CalendarView';
import { EventAttendeeList } from '@/components/events/EventAttendeeList';
import { EventCreationForm } from '@/components/events/EventCreationForm';
import { EventFilters } from '@/components/search/EventFilters';

import { SavedSearchesDialog } from '@/components/search/SavedSearchesDialog';
import { SearchHistoryDialog } from '@/components/search/SearchHistoryDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { EventRegistrationForm } from '@/components/events/EventRegistrationForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types/event';
import { fetchEvents } from '@/lib/eventService';
import { eventsAPI } from '@/lib/api';
import { Plus, Calendar, Users, MessageSquare, Grid, CalendarDays } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromDatabase, setFromDatabase] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    dateRange: 'all',
    location: 'all',
    type: 'all',
    cost: 'all',
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [followUpMessage, setFollowUpMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const result = await fetchEvents();
      setEvents(result.data);
      setFromDatabase(result.fromDatabase);
      if (result.fromDatabase) {
        toast.success('Loaded events from database');
      }
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  // Pull-to-refresh functionality
  const handleRefresh = async () => {
    await loadEvents();
    toast.success('Events refreshed');
  };

  const {
    pullDistance,
    isRefreshing,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    scrollableRef,
  } = usePullToRefresh({ onRefresh: handleRefresh });

  const loadAttendees = async (eventId: string) => {
    setLoadingAttendees(true);
    try {
      const response = await eventsAPI.getRegistrations(eventId);
      if (response.data?.registrations) {
        setAttendees(response.data.registrations);
      } else {
        setAttendees([]);
      }
    } catch (error) {
      console.error('Error loading attendees:', error);
      setAttendees([]);
      toast.error('Failed to load attendees');
    } finally {
      setLoadingAttendees(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           event.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesLocation = filters.location === 'all' || event.location_type === filters.location;
      const matchesType = filters.type === 'all' || event.category.toLowerCase().includes(filters.type);
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [events, filters]);

  const handleExport = () => {
    const csv = [
      ['Title', 'Category', 'Date', 'Location Type', 'Registered', 'Capacity'].join(','),
      ...filteredEvents.map(e => 
        [e.title, e.category, new Date(e.event_date).toLocaleDateString(), e.location_type, e.registered_count, e.capacity || 'Unlimited'].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Events exported successfully');
  };

  const handleRegister = (eventId: string) => {
    if (!user) {
      toast.error('Please log in to register for events');
      return;
    }
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowRegistration(true);
    }
  };

  const handleViewDetails = (event: Event) => {
    if (!user) {
      toast.error('Please log in to view event details');
      return;
    }
    setSelectedEvent(event);
    setShowEventDetails(true);
    loadAttendees(event.id); // Load attendees when opening event details
  };

  const handleSendFollowUp = () => {
    console.log('Sending follow-up:', followUpMessage);
    setShowFollowUp(false);
    setFollowUpMessage('');
  };

  return (
    <div 
      ref={scrollableRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="container mx-auto px-4 py-8 relative" 
      data-tour="events"
    >
      {/* Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 text-blue-600 font-medium text-sm transition-opacity"
          style={{ opacity: Math.min(pullDistance / 80, 1) }}
        >
          {isRefreshing ? 'Refreshing...' : pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
        </div>
      )}
      
      <BackButton />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">Networking Events</h1>

          </div>
          <p className="text-gray-600 text-sm md:text-base">Connect with fellow members at local meetups, virtual sessions, and industry mixers</p>
        </div>
        {user && (
          <Button onClick={() => setShowCreateEvent(true)} className="gap-2 min-h-[44px] w-full md:w-auto">
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
        )}
      </div>


      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 border rounded-lg">
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>


      <EventFilters
        filters={filters}
        onFilterChange={setFilters}
        onExport={handleExport}
        onOpenSaved={() => {
          if (!user) {
            toast.error('Please log in to access saved searches');
            return;
          }
          setShowSavedSearches(true);
        }}
        onOpenHistory={() => {
          if (!user) {
            toast.error('Please log in to access search history');
            return;
          }
          setShowSearchHistory(true);
        }}
        user={user}
      />

      <div className="my-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="gap-2 flex-1 sm:flex-none min-h-[44px]"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid View</span>
            <span className="sm:hidden">Grid</span>
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="gap-2 flex-1 sm:flex-none min-h-[44px]"
          >
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Calendar View</span>
            <span className="sm:hidden">Calendar</span>
          </Button>
        </div>
      </div>


      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event.id} onClick={() => handleViewDetails(event)} className={user ? "cursor-pointer" : "cursor-not-allowed opacity-75"}>
              <EventCard event={event} onRegister={handleRegister} user={user} />
            </div>
          ))}
        </div>
      ) : (
        <CalendarView events={filteredEvents} onEventClick={handleViewDetails} />
      )}
      </>
      )}




      {/* Event Details Dialog */}
      {user && (
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>{selectedEvent?.description}</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attendees">Attendees</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div className="flex gap-2">
                  <Badge>{selectedEvent.category}</Badge>
                  <Badge variant="secondary">{selectedEvent.location_type}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedEvent.event_date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{selectedEvent.registered_count} registered{selectedEvent.capacity ? ` / ${selectedEvent.capacity} capacity` : ''}</span>
                  </div>
                </div>
                <Button onClick={() => { setShowEventDetails(false); handleRegister(selectedEvent.id); }} className="w-full">
                  Register for Event
                </Button>
                {user && (
                  <Button onClick={() => { setShowEventDetails(false); setShowFollowUp(true); }} variant="outline" className="w-full gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Send Follow-Up to Attendees
                  </Button>
                )}
              </TabsContent>
              <TabsContent value="attendees">
                {loadingAttendees ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EventAttendeeList attendees={attendees} capacity={selectedEvent.capacity} />
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
      )}

      {/* Registration Dialog */}
      {user && (
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for {selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && user && (
            <EventRegistrationForm 
              eventId={selectedEvent.id}
              eventTitle={selectedEvent.title}
              userEmail={user.email}
              userName={user.fullName || ''}
              onSuccess={() => {
                setShowRegistration(false);
                loadEvents(); // Reload events to update registration count
                if (selectedEvent) {
                  loadAttendees(selectedEvent.id); // Reload attendees list
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      )}

      {/* Create Event Dialog */}
      {user && (
      <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Networking Event</DialogTitle>
            <DialogDescription>Create a new event for your chapter members</DialogDescription>
          </DialogHeader>
          <EventCreationForm onSuccess={() => {
            setShowCreateEvent(false);
            loadEvents(); // Reload events to show the newly created event
          }} />
        </DialogContent>
      </Dialog>
      )}

      {/* Follow-Up Dialog */}
      {user && (
      <Dialog open={showFollowUp} onOpenChange={setShowFollowUp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Follow-Up Message</DialogTitle>
            <DialogDescription>Send a message to all event attendees</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Thank you for attending! Here are the key takeaways..."
              value={followUpMessage}
              onChange={(e) => setFollowUpMessage(e.target.value)}
              rows={6}
            />
            <Button onClick={handleSendFollowUp} className="w-full">Send to All Attendees</Button>
          </div>
        </DialogContent>
      </Dialog>
      )}

      {user && (
      <>
      <SavedSearchesDialog
        open={showSavedSearches}
        onOpenChange={setShowSavedSearches}
        onApplySearch={(savedFilters) => setFilters(savedFilters)}
        section="events"
      />

      <SearchHistoryDialog
        open={showSearchHistory}
        onOpenChange={setShowSearchHistory}
        onApplySearch={(query) => setFilters({ ...filters, search: query })}
        section="events"
      />
      </>
      )}
    </div>
  );
}

