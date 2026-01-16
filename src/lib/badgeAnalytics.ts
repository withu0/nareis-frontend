import { supabase } from './supabase';

export interface BadgeDownloadData {
  userId: string;
  badgeType: 'custom' | 'pre-made';
  colorScheme?: string;
  badgeFormat: 'social' | 'website' | 'print';
  companyName?: string;
  memberSince?: number;
  certificationLevel?: string;
}

export interface BadgeAnalyticsRecord {
  id: string;
  user_id: string;
  badge_type: 'custom' | 'pre-made';
  color_scheme?: string;
  badge_format: 'social' | 'website' | 'print';
  company_name?: string;
  member_since?: number;
  certification_level?: string;
  downloaded_at: string;
  created_at: string;
}

export async function trackBadgeDownload(data: BadgeDownloadData) {
  try {
    const { error } = await supabase
      .from('badge_analytics')
      .insert({
        user_id: data.userId,
        badge_type: data.badgeType,
        color_scheme: data.colorScheme,
        badge_format: data.badgeFormat,
        company_name: data.companyName,
        member_since: data.memberSince,
        certification_level: data.certificationLevel,
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking badge download:', error);
  }
}

export async function getBadgeAnalytics(): Promise<BadgeAnalyticsRecord[]> {
  try {
    const { data, error } = await supabase
      .from('badge_analytics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching badge analytics:', error);
    return [];
  }
}

export async function getUserBadgeAnalytics(userId: string): Promise<BadgeAnalyticsRecord[]> {
  try {
    const { data, error } = await supabase
      .from('badge_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user badge analytics:', error);
    return [];
  }
}

export function subscribeToBadgeAnalytics(callback: (payload: any) => void) {
  const subscription = supabase
    .channel('badge_analytics_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'badge_analytics' },
      callback
    )
    .subscribe();

  return subscription;
}
