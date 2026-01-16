import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { trackAdEvent } from '@/lib/adTracking';

interface AdCardProps {
  ad: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    link_url: string;
    ad_type: string;
    impressions: number;
    clicks: number;
    advertiser_id: string;
  };
  placement: string;
}

export function AdCard({ ad, placement }: AdCardProps) {
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  // Track impression on mount
  useEffect(() => {
    if (!hasTrackedImpression) {
      trackImpression();
    }
  }, []);

  const trackImpression = async () => {
    if (hasTrackedImpression) return;
    try {
      await trackAdEvent(ad.id, ad.advertiser_id, 'impression');
      await supabase.from('advertisements').update({ impressions: ad.impressions + 1 }).eq('id', ad.id);
      setHasTrackedImpression(true);
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  const handleClick = async () => {
    try {
      await trackAdEvent(ad.id, ad.advertiser_id, 'click');
      await supabase.from('advertisements').update({ clicks: ad.clicks + 1 }).eq('id', ad.id);
      window.open(ad.link_url, '_blank');
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };


  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
      onMouseEnter={trackImpression}
    >
      {ad.image_url && (
        <img src={ad.image_url} alt={ad.title} className="w-full h-auto" />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{ad.title}</h3>
        {ad.description && (
          <p className="text-sm text-muted-foreground">{ad.description}</p>
        )}
        <span className="text-xs text-muted-foreground mt-2 block">Sponsored</span>
      </div>
    </Card>
  );
}
