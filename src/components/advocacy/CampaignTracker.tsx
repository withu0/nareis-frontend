import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const campaigns = [
  { id: 1, title: 'Support H.R. 2847 Tax Relief', goal: 10000, current: 7834, participants: 2341, deadline: '2025-11-15', status: 'Active' },
  { id: 2, title: 'Oppose S.B. 1523 Restrictions', goal: 5000, current: 4621, participants: 1547, deadline: '2025-10-30', status: 'Urgent' },
  { id: 3, title: 'Advocate for Depreciation Reform', goal: 8000, current: 3245, participants: 892, deadline: '2025-12-01', status: 'Active' },
  { id: 4, title: 'Short-Term Rental Protection', goal: 15000, current: 12567, participants: 4123, deadline: '2025-11-20', status: 'Active' },
];

export const CampaignTracker: React.FC = () => {
  const { toast } = useToast();

  const handleJoin = (title: string) => {
    toast({ title: 'Campaign Joined!', description: `You've joined: ${title}` });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Active Campaigns</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {campaigns.map(campaign => {
          const progress = (campaign.current / campaign.goal) * 100;
          return (
            <Card key={campaign.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold flex-1">{campaign.title}</h3>
                <Badge variant={campaign.status === 'Urgent' ? 'destructive' : 'default'}>{campaign.status}</Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold">Progress</span>
                    <span className="text-gray-600">{campaign.current.toLocaleString()} / {campaign.goal.toLocaleString()}</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% complete</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-semibold">{campaign.participants.toLocaleString()}</p>
                      <p className="text-gray-600">Participants</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-semibold">{campaign.deadline}</p>
                      <p className="text-gray-600">Deadline</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => handleJoin(campaign.title)}>Join Campaign</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
