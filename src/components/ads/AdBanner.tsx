import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { trackAdEvent } from '@/lib/adTracking';
import { X } from 'lucide-react';

interface AdBannerProps {
  ad: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    link_url: string;
    impressions: number;
    clicks: number;
    advertiser_id: string;
  };
}


export function AdBanner({ ad }: AdBannerProps) {
  const [visible, setVisible] = useState(true);
  const [tracked, setTracked] = useState(false);

  // Track impression on mount
  useEffect(() => {
    if (!tracked) {
      trackImpression();
    }
  }, []);

  const trackImpression = async () => {
    if (tracked) return;
    try {
      // Track in analytics_events table
      await trackAdEvent(ad.id, ad.advertiser_id, 'impression');
      // Update advertisement counter
      await supabase.from('advertisements').update({ impressions: ad.impressions + 1 }).eq('id', ad.id);
      setTracked(true);
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  const handleClick = async () => {
    try {
      // Track in analytics_events table
      await trackAdEvent(ad.id, ad.advertiser_id, 'click');
      // Update advertisement counter
      await supabase.from('advertisements').update({ clicks: ad.clicks + 1 }).eq('id', ad.id);
      window.open(ad.link_url, '_blank');
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };


  if (!visible) return null;

  return (
    <div 
      className="relative bg-gradient-to-r from-blue-50 to-purple-50 border rounded-lg p-4 mb-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
      onMouseEnter={trackImpression}
    >
      <button
        onClick={(e) => { e.stopPropagation(); setVisible(false); }}
        className="absolute top-2 right-2 p-1 hover:bg-white/50 rounded"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-4">
        {ad.image_url && (
          <img src={ad.image_url} alt={ad.title} className="h-16 w-16 object-cover rounded" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold">{ad.title}</h3>
          {ad.description && <p className="text-sm text-muted-foreground">{ad.description}</p>}
          <span className="text-xs text-muted-foreground">Sponsored</span>
        </div>
      </div>
    </div>
  );
}
