import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MousePointerClick, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  // Real-time analytics not implemented with Node.js backend yet
  // Using mock data for display purposes
  const [liveImpressions] = useState(0);
  const [liveClicks] = useState(0);
  const [recentActivity] = useState<ActivityEvent[]>([]);
  const [ctr] = useState(0);

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Real-time analytics are not yet implemented with the Node.js backend. This feature will be available in a future update.
        </AlertDescription>
      </Alert>

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
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-2xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Not Available</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No real-time activity data available</p>
            </div>
          ) : (
            recentActivity.map(activity => (
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
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
