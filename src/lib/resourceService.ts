import { supabase } from './supabase';
import { Resource } from '@/types/resource';
import { resourcesData } from '@/data/resourcesData';

export interface SupabaseResource {
  id: string;
  title: string;
  description: string | null;
  resource_type: string | null;
  category: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  author_id: string | null;
  download_count: number;
  view_count: number;
  is_premium: boolean;
  tags: string[] | null;
  created_at: string;
}

const defaultThumbnail = 'https://d64gsuwffb70l.cloudfront.net/default-resource.webp';

export function transformSupabaseResource(resource: SupabaseResource): Resource {
  return {
    id: resource.id,
    title: resource.title,
    description: resource.description || '',
    type: (resource.resource_type as Resource['type']) || 'guide',
    category: resource.category || 'General',
    topics: resource.tags || ['Insulation'],
    imageUrl: resource.thumbnail_url || defaultThumbnail,
    fileUrl: resource.file_url || '',
    fileSize: '2.5 MB',
    downloads: resource.download_count,
    rating: 4.5,
    reviewCount: Math.floor(resource.view_count / 10) || 5,
    uploadedBy: 'NAREIS',
    uploadDate: resource.created_at,
    isPremium: resource.is_premium
  };
}

export async function fetchResources(): Promise<{ data: Resource[]; fromDatabase: boolean }> {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('download_count', { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      return { data: data.map(transformSupabaseResource), fromDatabase: true };
    }
    return { data: resourcesData, fromDatabase: false };
  } catch (error) {
    console.error('Error fetching resources:', error);
    return { data: resourcesData, fromDatabase: false };
  }
}

export async function trackDownload(resourceId: string, customerId?: string): Promise<void> {
  try {
    // Increment download count
    await supabase.rpc('increment_download_count', { resource_id: resourceId });
    
    // Track individual download if user is logged in
    if (customerId) {
      await supabase
        .from('resource_downloads')
        .insert({ resource_id: resourceId, customer_id: customerId });
    }
  } catch (error) {
    console.error('Error tracking download:', error);
  }
}

export async function fetchResourceById(id: string): Promise<Resource | null> {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (data) return transformSupabaseResource(data);
    return resourcesData.find(r => r.id === id) || null;
  } catch {
    return resourcesData.find(r => r.id === id) || null;
  }
}
