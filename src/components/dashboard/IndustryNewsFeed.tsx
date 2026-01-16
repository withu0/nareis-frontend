import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const news = [
  { id: 1, title: 'New Housing Regulations Announced', category: 'Policy', time: '2h ago' },
  { id: 2, title: 'Real Estate Market Trends Q4 2024', category: 'Market', time: '5h ago' },
  { id: 3, title: 'Sustainable Building Practices Guide', category: 'Sustainability', time: '1d ago' },
  { id: 4, title: 'Tax Benefits for Property Investors', category: 'Finance', time: '2d ago' },
];

export default function IndustryNewsFeed() {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Industry News</h3>
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="pb-4 border-b last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-sm flex-1">{item.title}</h4>
              <Badge variant="outline" className="ml-2">{item.category}</Badge>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {item.time}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
