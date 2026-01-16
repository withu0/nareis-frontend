export interface ChapterAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate?: string;
}

export interface ChapterRanking {
  rank: number;
  chapterId: string;
  chapterName: string;
  location: string;
  totalScore: number;
  engagementScore: number;
  eventAttendance: number;
  memberGrowth: number;
  resourceUsage: number;
  previousRank: number;
  achievements: ChapterAchievement[];
  monthlyAwards: string[];
}

export const chapterAchievements: ChapterAchievement[] = [
  { id: 'growth-champion', name: 'Growth Champion', description: '50+ new members in a quarter', icon: '📈' },
  { id: 'event-master', name: 'Event Master', description: '20+ events hosted in a year', icon: '🎯' },
  { id: 'engagement-elite', name: 'Engagement Elite', description: '95%+ engagement rate', icon: '⭐' },
  { id: 'resource-leader', name: 'Resource Leader', description: 'Highest resource downloads', icon: '📚' },
  { id: 'hall-of-fame', name: 'Hall of Fame', description: 'Top 3 for 6+ consecutive months', icon: '🏆' },
];

export const chapterLeaderboardData: ChapterRanking[] = [
  {
    rank: 1,
    chapterId: 'ny',
    chapterName: 'New York Metro',
    location: 'New York, NY',
    totalScore: 98,
    engagementScore: 96,
    eventAttendance: 95,
    memberGrowth: 88,
    resourceUsage: 92,
    previousRank: 2,
    achievements: chapterAchievements.slice(0, 4),
    monthlyAwards: ['January 2025', 'February 2025', 'March 2025']
  },
  {
    rank: 2,
    chapterId: 'ca',
    chapterName: 'Southern California',
    location: 'Los Angeles, CA',
    totalScore: 95,
    engagementScore: 94,
    eventAttendance: 92,
    memberGrowth: 90,
    resourceUsage: 89,
    previousRank: 1,
    achievements: chapterAchievements.slice(0, 3),
    monthlyAwards: ['December 2024', 'November 2024']
  },
  {
    rank: 3,
    chapterId: 'tx',
    chapterName: 'Texas',
    location: 'Dallas, TX',
    totalScore: 92,
    engagementScore: 91,
    eventAttendance: 88,
    memberGrowth: 85,
    resourceUsage: 87,
    previousRank: 3,
    achievements: chapterAchievements.slice(0, 2),
    monthlyAwards: ['October 2024']
  },
];
