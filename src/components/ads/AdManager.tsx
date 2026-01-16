import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AdCard } from './AdCard';
import { AdBanner } from './AdBanner';

interface AdManagerProps {
  placement: string;
  type?: 'banner' | 'card';
  maxAds?: number;
}

export function AdManager({ placement, type = 'card', maxAds = 1 }: AdManagerProps) {
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
        type === 'banner' ? (
          <AdBanner key={ad.id} ad={ad} />
        ) : (
          <AdCard key={ad.id} ad={ad} placement={placement} />
        )
      ))}
    </div>
  );
}
