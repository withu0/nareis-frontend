export interface Referral {
  id: string;
  referrerName: string;
  referrerEmail: string;
  refereeEmail: string;
  refereeName?: string;
  status: 'pending' | 'registered' | 'completed' | 'expired';
  pointsAwarded: number;
  createdAt: string;
  completedAt?: string;
}

export interface ReferrerStats {
  memberId: string;
  memberName: string;
  email: string;
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  rank: number;
  joinedDate: string;
}

export const referralTiers = [
  { name: 'Bronze', minReferrals: 1, maxReferrals: 4, points: 10, color: 'bg-amber-600' },
  { name: 'Silver', minReferrals: 5, maxReferrals: 9, points: 25, color: 'bg-gray-400' },
  { name: 'Gold', minReferrals: 10, maxReferrals: 19, points: 50, color: 'bg-yellow-500' },
  { name: 'Platinum', minReferrals: 20, maxReferrals: Infinity, points: 100, color: 'bg-purple-600' }
];

export const topReferrers: ReferrerStats[] = [
  {
    memberId: '1',
    memberName: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    totalReferrals: 24,
    completedReferrals: 22,
    pendingReferrals: 2,
    totalPoints: 550,
    tier: 'Platinum',
    rank: 1,
    joinedDate: '2024-01-15'
  },
  {
    memberId: '2',
    memberName: 'Michael Chen',
    email: 'mchen@example.com',
    totalReferrals: 18,
    completedReferrals: 16,
    pendingReferrals: 2,
    totalPoints: 400,
    tier: 'Gold',
    rank: 2,
    joinedDate: '2024-02-20'
  },
  {
    memberId: '3',
    memberName: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    totalReferrals: 15,
    completedReferrals: 14,
    pendingReferrals: 1,
    totalPoints: 350,
    tier: 'Gold',
    rank: 3,
    joinedDate: '2024-03-10'
  }
];
