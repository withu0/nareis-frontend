import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, MapPin, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initiatives = [
  { id: 1, title: 'Capitol Hill Day 2025', type: 'Event', date: '2025-11-08', location: 'Washington, DC', participants: 234, capacity: 300, actions: ['Meet Representatives', 'Attend Briefing', 'Group Advocacy'] },
  { id: 2, title: 'Local Town Hall Campaign', type: 'Ongoing', date: 'Multiple Dates', location: 'Nationwide', participants: 1247, capacity: 2000, actions: ['Attend Town Halls', 'Ask Questions', 'Share Stories'] },
  { id: 3, title: 'Social Media Awareness Week', type: 'Campaign', date: '2025-10-28', location: 'Online', participants: 3421, capacity: 5000, actions: ['Share Posts', 'Use Hashtags', 'Tag Representatives'] },
  { id: 4, title: 'Letter Writing Campaign', type: 'Ongoing', date: 'Continuous', location: 'Remote', participants: 892, capacity: 1500, actions: ['Write Letters', 'Send Emails', 'Make Calls'] },
];

export const GrassrootsInitiatives: React.FC = () => {
  const { toast } = useToast();

  const handleParticipate = (title: string) => {
    toast({ title: 'Registration Confirmed!', description: `You're registered for: ${title}` });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Grassroots Initiatives</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {initiatives.map(initiative => {
          const progress = (initiative.participants / initiative.capacity) * 100;
          return (
            <Card key={initiative.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold flex-1">{initiative.title}</h3>
                <Badge>{initiative.type}</Badge>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{initiative.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{initiative.location}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" />Participants</span>
                    <span className="font-semibold">{initiative.participants} / {initiative.capacity}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Action Items:</p>
                  <ul className="space-y-1">
                    {initiative.actions.map((action, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button className="w-full" onClick={() => handleParticipate(initiative.title)}>Participate</Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
