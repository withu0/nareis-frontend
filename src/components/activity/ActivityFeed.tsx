import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ActivityItem from './ActivityItem';
import ActivityFilters from './ActivityFilters';
import { TrendingUp, Settings } from 'lucide-react';

// Mock data
const mockActivities = [
  {
    id: '1',
    type: 'certification' as const,
    member: { name: 'Sarah Johnson', avatar: '', tier: 'Professional Member' },
    content: 'Earned the Real Estate Investment Fundamentals certification! 🎓',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 24,
    comments: [
      { id: '1', author: 'Mike Chen', text: 'Congratulations Sarah!', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) }
    ],
    isLiked: false
  },
  {
    id: '2',
    type: 'event' as const,
    member: { name: 'Michael Rodriguez', avatar: '', tier: 'Investor Member' },
    content: 'Attended the Commercial Real Estate Investment Summit in Chicago. Great insights on market trends!',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 18,
    comments: [],
    isLiked: true
  },
  {
    id: '3',
    type: 'resource' as const,
    member: { name: 'Emily Chen', avatar: '', tier: 'Professional Member' },
    content: 'Shared a new market analysis report: "Q4 2024 Multifamily Investment Trends"',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 32,
    comments: [
      { id: '1', author: 'David Lee', text: 'Thanks for sharing!', timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000) },
      { id: '2', author: 'Anna Smith', text: 'Very insightful data', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) }
    ],
    isLiked: false
  },
  {
    id: '4',
    type: 'forum' as const,
    member: { name: 'David Thompson', avatar: '', tier: 'Executive Member' },
    content: 'Started a discussion: "Best practices for ESG integration in real estate portfolios"',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    likes: 15,
    comments: [],
    isLiked: false
  },
  {
    id: '5',
    type: 'referral' as const,
    member: { name: 'Jennifer Martinez', avatar: '', tier: 'Investor Member' },
    content: 'Reached Silver Referral status by referring 5 new members! 🌟',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 28,
    comments: [],
    isLiked: false
  }
];

export default function ActivityFeed() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showPersonalized, setShowPersonalized] = useState(true);

  const filteredActivities = selectedFilter === 'all'
    ? mockActivities
    : mockActivities.filter(a => a.type === selectedFilter);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <CardTitle>Member Activity Feed</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="personalized"
                  checked={showPersonalized}
                  onCheckedChange={setShowPersonalized}
                />
                <Label htmlFor="personalized" className="text-sm">Personalized Feed</Label>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Stay connected with your network and discover what members are achieving
          </p>
        </CardHeader>
        <CardContent>
          <ActivityFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredActivities.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No activities found for this filter</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
