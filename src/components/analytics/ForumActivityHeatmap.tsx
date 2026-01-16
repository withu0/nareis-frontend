import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ThumbsUp, Eye } from 'lucide-react';

const heatmapData = [
  { day: 'Mon', hours: [2, 3, 5, 8, 12, 18, 25, 32, 28, 22, 15, 10, 8, 6, 5, 7, 12, 18, 22, 20, 15, 10, 5, 3] },
  { day: 'Tue', hours: [3, 4, 6, 9, 14, 20, 28, 35, 30, 25, 18, 12, 10, 8, 6, 8, 14, 20, 25, 22, 17, 12, 6, 4] },
  { day: 'Wed', hours: [2, 3, 5, 10, 15, 22, 30, 38, 32, 27, 20, 14, 11, 9, 7, 9, 15, 22, 27, 24, 18, 13, 7, 4] },
  { day: 'Thu', hours: [3, 4, 6, 11, 16, 23, 31, 40, 34, 28, 21, 15, 12, 10, 8, 10, 16, 23, 28, 25, 19, 14, 8, 5] },
  { day: 'Fri', hours: [2, 3, 5, 9, 13, 19, 26, 33, 29, 24, 18, 13, 10, 8, 6, 8, 13, 19, 24, 21, 16, 11, 6, 4] },
  { day: 'Sat', hours: [1, 2, 3, 5, 8, 12, 16, 20, 18, 15, 12, 9, 7, 6, 5, 6, 9, 13, 16, 14, 11, 8, 5, 3] },
  { day: 'Sun', hours: [1, 2, 3, 4, 7, 10, 14, 18, 16, 13, 10, 8, 6, 5, 4, 5, 8, 11, 14, 12, 9, 7, 4, 2] },
];

const getHeatColor = (value: number) => {
  if (value < 5) return 'bg-blue-100';
  if (value < 10) return 'bg-blue-200';
  if (value < 15) return 'bg-blue-300';
  if (value < 20) return 'bg-blue-400';
  if (value < 25) return 'bg-blue-500';
  if (value < 30) return 'bg-blue-600';
  return 'bg-blue-700';
};

export function ForumActivityHeatmap() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold mt-1">1,847</p>
                <p className="text-sm text-green-600 mt-1">+22.3%</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reactions</p>
                <p className="text-2xl font-bold mt-1">5,234</p>
                <p className="text-sm text-green-600 mt-1">+18.7%</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold mt-1">28,456</p>
                <p className="text-sm text-green-600 mt-1">+15.2%</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Forum Activity Heatmap (Posts per Hour)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex gap-1 mb-2 pl-12">
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="w-6 text-xs text-center text-gray-600">
                    {i}
                  </div>
                ))}
              </div>
              {heatmapData.map((row) => (
                <div key={row.day} className="flex gap-1 mb-1">
                  <div className="w-10 text-sm font-medium text-gray-700 flex items-center">{row.day}</div>
                  {row.hours.map((value, idx) => (
                    <div
                      key={idx}
                      className={`w-6 h-6 ${getHeatColor(value)} rounded transition-all hover:scale-110 cursor-pointer`}
                      title={`${row.day} ${idx}:00 - ${value} posts`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
