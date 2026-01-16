import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Trophy, Target } from 'lucide-react';

const badges = [
  { id: 1, name: 'Early Adopter', icon: Star, color: 'text-yellow-500', earned: true },
  { id: 2, name: 'Active Participant', icon: Trophy, color: 'text-blue-500', earned: true },
  { id: 3, name: 'Resource Contributor', icon: Award, color: 'text-green-500', earned: false },
  { id: 4, name: 'Event Organizer', icon: Target, color: 'text-purple-500', earned: false },
];

export default function MemberBadges() {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Your Badges</h3>
      <div className="grid grid-cols-2 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                badge.earned
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-gray-50 opacity-50'
              }`}
            >
              <Icon className={`h-8 w-8 mx-auto mb-2 ${badge.color}`} />
              <p className="font-semibold text-sm">{badge.name}</p>
              {badge.earned && (
                <Badge variant="secondary" className="mt-2">Earned</Badge>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
