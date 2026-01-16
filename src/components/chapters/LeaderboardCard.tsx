import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ChapterRanking } from '@/data/chapterLeaderboard';

interface LeaderboardCardProps {
  chapter: ChapterRanking;
}

export function LeaderboardCard({ chapter }: LeaderboardCardProps) {
  const rankChange = chapter.previousRank - chapter.rank;
  const medalImages = {
    1: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761069430181_7d971ee6.webp',
    2: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761069430995_e5c71c26.webp',
    3: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761069431799_188ae307.webp'
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {chapter.rank <= 3 && (
            <img src={medalImages[chapter.rank as 1 | 2 | 3]} alt={`Rank ${chapter.rank}`} className="w-12 h-12" />
          )}
          {chapter.rank > 3 && (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600">
              {chapter.rank}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold">{chapter.chapterName}</h3>
            <p className="text-sm text-gray-600">{chapter.location}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{chapter.totalScore}</div>
          <div className="flex items-center gap-1 text-sm">
            {rankChange > 0 && <><TrendingUp className="w-4 h-4 text-green-600" /><span className="text-green-600">+{rankChange}</span></>}
            {rankChange < 0 && <><TrendingDown className="w-4 h-4 text-red-600" /><span className="text-red-600">{rankChange}</span></>}
            {rankChange === 0 && <><Minus className="w-4 h-4 text-gray-400" /><span className="text-gray-400">-</span></>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{chapter.engagementScore}</div>
          <div className="text-xs text-gray-600">Engagement</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{chapter.eventAttendance}</div>
          <div className="text-xs text-gray-600">Events</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{chapter.memberGrowth}</div>
          <div className="text-xs text-gray-600">Growth</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{chapter.resourceUsage}</div>
          <div className="text-xs text-gray-600">Resources</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {chapter.achievements.map(achievement => (
          <Badge key={achievement.id} variant="secondary" className="text-xs">
            {achievement.icon} {achievement.name}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
