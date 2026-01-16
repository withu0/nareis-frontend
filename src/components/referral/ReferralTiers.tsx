import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { referralTiers } from '@/data/referralData';
import { Trophy, Star, Award, Crown } from 'lucide-react';

const tierIcons = {
  Bronze: Trophy,
  Silver: Star,
  Gold: Award,
  Platinum: Crown
};

const tierImages: Record<string, string> = {
  Bronze: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761069782066_63a5915b.webp',
  Silver: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761069782972_3359cc0a.webp',
  Gold: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761069784109_b6f6422d.webp',
  Platinum: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761069785715_01cef218.webp'
};

export function ReferralTiers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Referrer Tiers & Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {referralTiers.map((tier) => {
            const Icon = tierIcons[tier.name as keyof typeof tierIcons];
            return (
              <div key={tier.name} className="border rounded-lg p-4 text-center space-y-3">
                <img src={tierImages[tier.name]} alt={tier.name} className="w-16 h-16 mx-auto" />
                <div>
                  <h3 className="font-bold text-lg">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tier.minReferrals}-{tier.maxReferrals === Infinity ? '+' : tier.maxReferrals} referrals
                  </p>
                </div>
                <Badge className={tier.color}>{tier.points} pts/referral</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
