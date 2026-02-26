import { supabase } from './supabase';
import { Member } from '@/types/member';
import { membersDirectory } from '@/data/membersDirectory';
import { membersAPI, getFileUrl } from './api';

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

// User interface matching backend response
export interface BackendUser {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  role: 'member' | 'admin';
  membershipTier: string;
  membershipStatus?: string;
  approvalStatus?: string;
  onboardingCompleted?: boolean;
  emailVerified?: boolean;
  profilePictureUrl?: string;
  chapterId?: string;
  interests?: string[];
  state?: string;
  city?: string;
  industry?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  createdAt: string;
  updatedAt: string;
}

// Transform backend User to Member format
export function transformUserToMember(user: BackendUser): Member {
  // Combine city and state for location
  const locationParts = [user.city, user.state].filter(Boolean);
  const location = locationParts.length > 0 
    ? locationParts.join(', ') 
    : 'Location not specified';
  
  // Use interests as expertise, with default
  const expertise = (user.interests && user.interests.length > 0) 
    ? user.interests 
    : ['General Insulation'];
  
  // Get profile picture URL, using default if missing
  let imageUrl = defaultAvatar;
  if (user.profilePictureUrl) {
    imageUrl = getFileUrl(user.profilePictureUrl);
  }
  
  // Ensure membershipTier is valid
  const validTiers: Member['membershipTier'][] = [
    'foundation',
    'growth',
    'professional',
    'enterprise',
    'founding-lifetime',
    'service-partner'
  ];
  const tier = validTiers.includes(user.membershipTier as Member['membershipTier'])
    ? (user.membershipTier as Member['membershipTier'])
    : 'foundation';
  
  return {
    id: user.id,
    name: user.fullName || 'Unknown Member',
    title: user.jobTitle || 'Member',
    company: user.organization || 'Independent',
    location,
    state: user.state || 'Unknown',
    industry: user.industry || 'Insulation',
    expertise,
    membershipTier: tier,
    bio: user.bio || 'No bio available.',
    email: user.email || '',
    phone: user.phone || '',
    website: user.website || undefined,
    linkedin: user.linkedin || undefined,
    image: imageUrl,
    joinedDate: user.createdAt || new Date().toISOString(),
    isAvailableForNetworking: true,
  };
}

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
    // Try to fetch from backend API
    const response = await membersAPI.getMembers();
    
    if (response.error) {
      console.error('[Members] API error:', response.error);
      // Fall back to mock data
      return { data: membersDirectory, fromDatabase: false };
    }
    
    if (response.data && response.data.members) {
      // Transform backend users to Member format
      const members = response.data.members.map((user: BackendUser) => transformUserToMember(user));
      console.log(`[Members] Loaded ${members.length} members from database`);
      return { data: members, fromDatabase: true };
    }
    
    // If no data structure matches, fall back to mock
    console.warn('[Members] Unexpected API response format, using mock data');
    return { data: membersDirectory, fromDatabase: false };
  } catch (error) {
    console.error('[Members] Error fetching members:', error);
    // Fall back to mock data on error
    return { data: membersDirectory, fromDatabase: false };
  }
}

export async function fetchMembersRaw(): Promise<{ data: SupabaseMember[]; error: string | null; tableExists: boolean }> {
  try {
    // Returning empty data during migration to Node.js backend
    // Using mock data from membersDirectory instead
    return { 
      data: [], 
      error: null, 
      tableExists: false 
    };
  } catch (err: any) {
    console.error('Fetch error:', err);
    return { data: [], error: null, tableExists: false };
  }
}


export async function fetchMemberById(id: string): Promise<Member | null> {
  try {
    // Try to fetch from backend API
    const response = await membersAPI.getMemberById(id);
    
    if (response.error) {
      console.error('[Member] API error:', response.error);
      // Fall back to mock data
      return membersDirectory.find(m => m.id === id) || null;
    }
    
    if (response.data && response.data.member) {
      // Transform backend user to Member format
      return transformUserToMember(response.data.member);
    }
    
    // If no data structure matches, fall back to mock
    return membersDirectory.find(m => m.id === id) || null;
  } catch (error) {
    console.error('[Member] Error fetching member:', error);
    // Fall back to mock data on error
    return membersDirectory.find(m => m.id === id) || null;
  }
}
