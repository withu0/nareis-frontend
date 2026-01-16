import { useState } from 'react';
import { BackButton } from '@/components/ui/back-button';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Award, TrendingUp, Users, Calendar, BookOpen } from 'lucide-react';
import { LeaderboardCard } from '@/components/chapters/LeaderboardCard';
import { chapterLeaderboardData, chapterAchievements } from '@/data/chapterLeaderboard';

export default function ChapterLeaderboard() {
  const [selectedMetric, setSelectedMetric] = useState<'total' | 'engagement' | 'events' | 'growth' | 'resources'>('total');

  const sortedChapters = [...chapterLeaderboardData].sort((a, b) => {
    switch (selectedMetric) {
      case 'engagement': return b.engagementScore - a.engagementScore;
      case 'events': return b.eventAttendance - a.eventAttendance;
      case 'growth': return b.memberGrowth - a.memberGrowth;
      case 'resources': return b.resourceUsage - a.resourceUsage;
      default: return b.totalScore - a.totalScore;
    }
  });

  const hallOfFameChapters = chapterLeaderboardData.filter(c => 
    c.achievements.some(a => a.id === 'hall-of-fame')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <BackButton />
        <div className="text-center mb-12">

          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h1 className="text-4xl font-bold">Chapter Leaderboard</h1>
          </div>
          <p className="text-xl text-gray-600">Celebrating excellence across NAREIS chapters</p>
        </div>

        <Tabs defaultValue="leaderboard" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="leaderboard">Rankings</TabsTrigger>
            <TabsTrigger value="awards">Monthly Awards</TabsTrigger>
            <TabsTrigger value="hall-of-fame">Hall of Fame</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="flex justify-center gap-2 flex-wrap mb-6">
              <Badge 
                variant={selectedMetric === 'total' ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2"
                onClick={() => setSelectedMetric('total')}
              >
                <Trophy className="w-4 h-4 mr-2" /> Overall
              </Badge>
              <Badge 
                variant={selectedMetric === 'engagement' ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2"
                onClick={() => setSelectedMetric('engagement')}
              >
                <TrendingUp className="w-4 h-4 mr-2" /> Engagement
              </Badge>
              <Badge 
                variant={selectedMetric === 'events' ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2"
                onClick={() => setSelectedMetric('events')}
              >
                <Calendar className="w-4 h-4 mr-2" /> Events
              </Badge>
              <Badge 
                variant={selectedMetric === 'growth' ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2"
                onClick={() => setSelectedMetric('growth')}
              >
                <Users className="w-4 h-4 mr-2" /> Growth
              </Badge>
              <Badge 
                variant={selectedMetric === 'resources' ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2"
                onClick={() => setSelectedMetric('resources')}
              >
                <BookOpen className="w-4 h-4 mr-2" /> Resources
              </Badge>
            </div>

            <div className="space-y-4">
              {sortedChapters.map((chapter, index) => (
                <LeaderboardCard key={chapter.chapterId} chapter={{...chapter, rank: index + 1}} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="awards" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                Monthly Award Winners
              </h2>
              <div className="space-y-6">
                {['March 2025', 'February 2025', 'January 2025'].map((month, idx) => (
                  <div key={month} className="border-l-4 border-blue-500 pl-6 py-4">
                    <h3 className="text-lg font-semibold mb-2">{month}</h3>
                    <div className="space-y-2">
                      {chapterLeaderboardData.filter(c => c.monthlyAwards.includes(month)).map(chapter => (
                        <div key={chapter.chapterId} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <span className="font-medium">{chapter.chapterName}</span>
                          <Badge variant="secondary">Score: {chapter.totalScore}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="hall-of-fame" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                Hall of Fame - Consistent Excellence
              </h2>
              <p className="text-gray-600 mb-6">Chapters that have maintained top 3 rankings for 6+ consecutive months</p>
              <div className="grid gap-4">
                {hallOfFameChapters.length > 0 ? hallOfFameChapters.map(chapter => (
                  <div key={chapter.chapterId} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{chapter.chapterName}</h3>
                        <p className="text-gray-600">{chapter.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-yellow-600">{chapter.totalScore}</div>
                        <div className="text-sm text-gray-600">Overall Score</div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {chapter.achievements.map(achievement => (
                        <Badge key={achievement.id} variant="secondary">
                          {achievement.icon} {achievement.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-8">No chapters have achieved Hall of Fame status yet. Keep striving for excellence!</p>
                )}
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Available Achievements</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {chapterAchievements.map(achievement => (
                  <div key={achievement.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div>
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
