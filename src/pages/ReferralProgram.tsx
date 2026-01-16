import { useState } from 'react';
import { BackButton } from '@/components/ui/back-button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReferralStatsCard } from '@/components/referral/ReferralStatsCard';
import { ReferralInviteForm } from '@/components/referral/ReferralInviteForm';
import { ReferralHistory } from '@/components/referral/ReferralHistory';
import { ReferralTiers } from '@/components/referral/ReferralTiers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { topReferrers } from '@/data/referralData';
import { Trophy, Medal, Award } from 'lucide-react';

export default function ReferralProgram() {
  const currentUserStats = {
    totalReferrals: 8,
    completedReferrals: 6,
    pendingReferrals: 2,
    totalPoints: 150,
    tier: 'Silver'
  };

  const rankIcons = [
    <Trophy className="h-5 w-5 text-yellow-500" />,
    <Medal className="h-5 w-5 text-gray-400" />,
    <Award className="h-5 w-5 text-amber-600" />
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <BackButton />

      <div>
        <h1 className="text-3xl font-bold mb-2">Referral Rewards Program</h1>
        <p className="text-muted-foreground">
          Invite colleagues and earn rewards. Help grow the NAREIS community!
        </p>
      </div>


      <ReferralStatsCard {...currentUserStats} />

      <Tabs defaultValue="invite" className="space-y-6">
        <TabsList>
          <TabsTrigger value="invite">Invite Members</TabsTrigger>
          <TabsTrigger value="history">My Referrals</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="tiers">Tiers & Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="invite">
          <ReferralInviteForm />
        </TabsContent>

        <TabsContent value="history">
          <ReferralHistory />
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Our most active community advocates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Total Referrals</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Tier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topReferrers.map((referrer) => (
                    <TableRow key={referrer.memberId}>
                      <TableCell className="flex items-center gap-2">
                        {referrer.rank <= 3 && rankIcons[referrer.rank - 1]}
                        <span className="font-bold">#{referrer.rank}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{referrer.memberName}</div>
                          <div className="text-sm text-muted-foreground">{referrer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{referrer.totalReferrals}</TableCell>
                      <TableCell>{referrer.completedReferrals}</TableCell>
                      <TableCell className="font-bold">{referrer.totalPoints}</TableCell>
                      <TableCell>
                        <Badge>{referrer.tier}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiers">
          <ReferralTiers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
