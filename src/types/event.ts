export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  end_date?: string;
  location: string;
  location_type: 'in-person' | 'virtual' | 'hybrid';
  virtual_link?: string;
  capacity?: number;
  waitlist_enabled: boolean;
  registration_deadline?: string;
  image_url: string;
  category: string;
  tier_access: 'all' | 'basic' | 'professional' | 'executive';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  created_by: string;
  created_at: string;
  updated_at: string;
  registered_count?: number;
  waitlist_count?: number;
  isFree: boolean;
  price?: number;
  memberOnly: boolean;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_email: string;
  user_name: string;
  registration_status: 'confirmed' | 'waitlist' | 'cancelled';
  waitlist_position?: number;
  registration_date: string;
  dietary_requirements?: string;
  special_requests?: string;
  guests_count: number;
  check_in_status: boolean;
  check_in_time?: string;
}
