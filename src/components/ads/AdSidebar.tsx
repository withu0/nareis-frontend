import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AdCard } from './AdCard';

interface AdSidebarProps {
  placement: string;
  maxAds?: number;
}

export function AdSidebar({ placement, maxAds = 3 }: AdSidebarProps) {
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    fetchAds();
  }, [placement]);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('placement', placement)
        .eq('status', 'active')
        .lte('start_date', new Date().toISOString())
        .gte('end_date', new Date().toISOString())
        .limit(maxAds);

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  if (ads.length === 0) return null;

  return (
    <div className="space-y-4">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} placement={placement} />
      ))}
    </div>
  );
}
