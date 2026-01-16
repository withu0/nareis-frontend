import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, Clock, Trophy } from 'lucide-react';

interface ReferralStatsCardProps {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalPoints: number;
  tier: string;
}

const tierImages: Record<string, string> = {
  Bronze: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761069782066_63a5915b.webp',
  Silver: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761069782972_3359cc0a.webp',
  Gold: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761069784109_b6f6422d.webp',
  Platinum: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761069785715_01cef218.webp'
};

export function ReferralStatsCard({ totalReferrals, completedReferrals, pendingReferrals, totalPoints, tier }: ReferralStatsCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReferrals}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedReferrals}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingReferrals}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          <Trophy className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPoints}</div>
          <Badge className="mt-2">{tier}</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
