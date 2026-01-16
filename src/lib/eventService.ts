import { supabase } from './supabase';
import { Event } from '@/types/event';
import { networkingEvents } from '@/data/networkingEvents';

export interface SupabaseEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  virtual_link: string | null;
  is_virtual: boolean;
  organizer_id: string | null;
  chapter_id: string | null;
  max_attendees: number | null;
  registration_deadline: string | null;
  status: string | null;
  image_url: string | null;
  created_at: string;
}

export function transformSupabaseEvent(event: SupabaseEvent, registeredCount = 0): Event {
  return {
    id: event.id,
    title: event.title,
    description: event.description || '',
    category: event.event_type || 'Networking',
    event_date: event.start_date,
    end_date: event.end_date || undefined,
    location: event.location || 'Online',
    location_type: event.is_virtual ? 'virtual' : 'in-person',
    virtual_link: event.virtual_link || undefined,
    organizer: 'NAREIS',
    capacity: event.max_attendees || undefined,
    registered_count: registeredCount,
    image_url: event.image_url || 'https://d64gsuwffb70l.cloudfront.net/default-event.webp',
    is_featured: false,
    registration_deadline: event.registration_deadline || undefined,
    status: (event.status as Event['status']) || 'upcoming'
  };
}

export async function fetchEvents(): Promise<{ data: Event[]; fromDatabase: boolean }> {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true });

    if (error) throw error;

    if (events && events.length > 0) {
      // Get registration counts
      const eventIds = events.map(e => e.id);
      const { data: regs } = await supabase
        .from('event_registrations')
        .select('event_id')
        .in('event_id', eventIds);

      const regCounts: Record<string, number> = {};
      regs?.forEach(r => {
        regCounts[r.event_id] = (regCounts[r.event_id] || 0) + 1;
      });

      return {
        data: events.map(e => transformSupabaseEvent(e, regCounts[e.id] || 0)),
        fromDatabase: true
      };
    }
    return { data: networkingEvents, fromDatabase: false };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { data: networkingEvents, fromDatabase: false };
  }
}

export async function registerForEvent(eventId: string, customerId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('event_registrations')
      .insert({ event_id: eventId, customer_id: customerId });
    return !error;
  } catch {
    return false;
  }
}
