import { eventsAPI, BACKEND_URL } from './api';
import { Event } from '@/types/event';
import { networkingEvents } from '@/data/networkingEvents';

export interface BackendEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate?: string;
  location: string;
  virtualLink?: string;
  isVirtual: boolean;
  organizerId: any;
  chapterId?: string;
  maxAttendees?: number;
  registrationDeadline?: string;
  status: string;
  imageUrl?: string;
  isFree: boolean;
  price?: number;
  memberOnly: boolean;
  waitlistEnabled?: boolean;
  registeredCount: number;
  createdAt: string;
  updatedAt: string;
}

export function transformBackendEvent(event: BackendEvent): Event {
  // Convert relative image URL to absolute URL
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) {
      console.log('⚠️ No imageUrl for event:', event.title, '- using placeholder');
      // Use reliable placeholder with event title
      return `https://placehold.co/800x400/e2e8f0/475569?text=${encodeURIComponent(event.title || 'Event')}`;
    }
    // If it's already an absolute URL, return as is
    if (imageUrl.startsWith('http')) {
      console.log('✅ Image URL is absolute:', imageUrl);
      return imageUrl;
    }
    // If it's a relative path, prepend backend URL
    const fullUrl = `${BACKEND_URL}${imageUrl}`;
    console.log('🔄 Transformed image URL:', imageUrl, '->', fullUrl);
    return fullUrl;
  };

  return {
    id: event.id,
    title: event.title,
    description: event.description || '',
    category: event.eventType || 'Networking',
    event_date: event.startDate,
    end_date: event.endDate || undefined,
    location: event.location || 'Online',
    location_type: event.isVirtual ? 'virtual' : 'in-person',
    virtual_link: event.virtualLink || undefined,
    organizer: typeof event.organizerId === 'object' ? event.organizerId.fullName : 'NAREIS',
    capacity: event.maxAttendees || undefined,
    registered_count: event.registeredCount || 0,
    image_url: getImageUrl(event.imageUrl),
    is_featured: false,
    registration_deadline: event.registrationDeadline || undefined,
    status: (event.status as Event['status']) || 'upcoming',
    isFree: event.isFree !== undefined ? event.isFree : true,
    price: event.price,
    memberOnly: event.memberOnly || false,
  };
}

export async function fetchEvents(): Promise<{ data: Event[]; fromDatabase: boolean }> {
  try {
    // Fetch all events (not just upcoming)
    const response = await eventsAPI.getAll();

    if (response.data?.events && response.data.events.length > 0) {
      return {
        data: response.data.events.map(transformBackendEvent),
        fromDatabase: true
      };
    }
    
    return { data: networkingEvents, fromDatabase: false };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { data: networkingEvents, fromDatabase: false };
  }
}

export async function registerForEvent(eventId: string): Promise<boolean> {
  try {
    const response = await eventsAPI.register(eventId);
    return !response.error;
  } catch (error) {
    console.error('Error registering for event:', error);
    return false;
  }
}

export async function cancelEventRegistration(eventId: string): Promise<boolean> {
  try {
    const response = await eventsAPI.cancelRegistration(eventId);
    return !response.error;
  } catch (error) {
    console.error('Error cancelling registration:', error);
    return false;
  }
}

export async function checkEventRegistration(eventId: string): Promise<{ registered: boolean; status: string | null }> {
  try {
    const response = await eventsAPI.checkRegistration(eventId);
    return {
      registered: response.data?.registered || false,
      status: response.data?.status || null
    };
  } catch (error) {
    console.error('Error checking registration:', error);
    return { registered: false, status: null };
  }
}
