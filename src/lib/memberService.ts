import { supabase } from './supabase';
import { Member } from '@/types/member';
import { membersDirectory } from '@/data/membersDirectory';

export interface SupabaseMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  phone: string | null;
  website: string | null;
  role: string | null;
  bio: string | null;
  membership_tier: string | null;
  membership_status: string | null;
  approval_status: string | null;
  city: string | null;
  state: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  property_types: string[] | null;
  investment_strategies: string[] | null;
  membership_start_date: string | null;
  onboarding_completed: boolean | null;
  created_at: string | null;
}

const defaultAvatar = 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761065663220_a70ec0c0.webp';

export function transformSupabaseMember(member: SupabaseMember): Member {
  const name = [member.first_name, member.last_name].filter(Boolean).join(' ') || 'Unknown Member';
  const expertise = [...(member.property_types || []), ...(member.investment_strategies || [])];
  const tier = (member.membership_tier || 'foundation') as Member['membershipTier'];
  
  return {
    id: member.id,
    name,
    title: member.role || 'Member',
    company: member.company || 'Independent',
    location: [member.city, member.state].filter(Boolean).join(', ') || 'Location not specified',
    state: member.state || 'Unknown',
    industry: member.property_types?.[0] || 'Insulation',
    expertise: expertise.length > 0 ? expertise : ['General Insulation'],
    membershipTier: tier,
    bio: member.bio || 'No bio available.',
    email: member.email || '',
    phone: member.phone || '',
    website: member.website || undefined,
    linkedin: member.linkedin_url || undefined,
    image: member.avatar_url || defaultAvatar,
    joinedDate: member.membership_start_date || member.created_at || new Date().toISOString(),
    isAvailableForNetworking: true
  };
}

export async function fetchMembers(): Promise<{ data: Member[]; fromDatabase: boolean }> {
  try {
    // Supabase is being migrated to Node.js backend
    // For now, always return mock data
    // TODO: Implement members API in Node.js backend if needed
    console.log('[Members] Using mock data (backend members API not yet implemented)');
    return { data: membersDirectory, fromDatabase: false };
  } catch (error) {
    console.error('Error fetching members:', error);
    return { data: membersDirectory, fromDatabase: false };
  }
}

export async function fetchMembersRaw(): Promise<{ data: SupabaseMember[]; error: string | null; tableExists: boolean }> {
  try {
    // Returning empty data during migration to Node.js backend
    return { 
      data: [], 
      error: 'Migrating to Node.js backend - using mock data', 
      tableExists: false 
    };
  } catch (err: any) {
    console.error('Fetch error:', err);
    return { data: [], error: err.message || 'Network error', tableExists: false };
  }
}


export async function fetchMemberById(id: string): Promise<Member | null> {
  try {
    // Return from mock data during migration
    return membersDirectory.find(m => m.id === id) || null;
  } catch {
    return membersDirectory.find(m => m.id === id) || null;
  }
}
