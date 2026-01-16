import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MousePointerClick, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ActivityEvent {
  id: string;
  event_type: string;
  ad_title: string;
  timestamp: string;
  device_type: string;
  country: string;
}

interface RealTimeAnalyticsProps {
  advertiserId?: string;
}

export function RealTimeAnalytics({ advertiserId }: RealTimeAnalyticsProps) {

  const [liveImpressions, setLiveImpressions] = useState(0);
  const [liveClicks, setLiveClicks] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);
  const [ctr, setCtr] = useState(0);

  useEffect(() => {
    loadInitialData();
    const channel = subscribeToEvents();
    return () => { supabase.removeChannel(channel); };
  }, [advertiserId]);

  const loadInitialData = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let query = supabase
      .from('analytics_events')
      .select('*, advertisements(title)')
      .gte('timestamp', today.toISOString())
      .order('timestamp', { ascending: false })
      .limit(10);
    
    if (advertiserId) {
      query = query.eq('advertiser_id', advertiserId);
    }
    
    const { data } = await query;


    if (data) {
      const impressions = data.filter(e => e.event_type === 'impression').length;
      const clicks = data.filter(e => e.event_type === 'click').length;
      setLiveImpressions(impressions);
      setLiveClicks(clicks);
      setCtr(impressions > 0 ? (clicks / impressions) * 100 : 0);
      setRecentActivity(data.map(e => ({
        id: e.id,
        event_type: e.event_type,
        ad_title: e.advertisements?.title || 'Unknown Ad',
        timestamp: e.timestamp,
        device_type: e.device_type,
        country: e.country
      })));
    }
  };

  const subscribeToEvents = () => {
    const channel = supabase.channel('analytics_realtime');
    
    if (advertiserId) {
      channel.on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'analytics_events', filter: `advertiser_id=eq.${advertiserId}` },
        (payload) => handleNewEvent(payload.new)
      );
    } else {
      channel.on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'analytics_events' },
        (payload) => handleNewEvent(payload.new)
      );
    }
    
    return channel.subscribe();
  };


  const handleNewEvent = (event: any) => {
    if (event.event_type === 'impression') {
      setLiveImpressions(prev => prev + 1);
    } else if (event.event_type === 'click') {
      setLiveClicks(prev => prev + 1);
    }
    setCtr(prev => liveImpressions > 0 ? (liveClicks / liveImpressions) * 100 : 0);
    
    setRecentActivity(prev => [{
      id: event.id,
      event_type: event.event_type,
      ad_title: 'New Ad',
      timestamp: event.timestamp,
      device_type: event.device_type,
      country: event.country
    }, ...prev.slice(0, 9)]);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Live Impressions</p>
              <p className="text-2xl font-bold">{liveImpressions}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Live Clicks</p>
              <p className="text-2xl font-bold">{liveClicks}</p>
            </div>
            <MousePointerClick className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Live CTR</p>
              <p className="text-2xl font-bold">{ctr.toFixed(2)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Now</p>
              <p className="text-2xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-500 animate-pulse" />
                Live
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {recentActivity.map(activity => (
            <div key={activity.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <Badge variant={activity.event_type === 'click' ? 'default' : 'secondary'}>
                  {activity.event_type}
                </Badge>
                <span className="text-sm">{activity.ad_title}</span>
              </div>
              <div className="text-xs text-gray-500 flex gap-2">
                <span>{activity.device_type}</span>
                <span>{activity.country}</span>
                <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
