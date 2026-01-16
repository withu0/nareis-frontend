import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Video, Download, ExternalLink } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'Video' | 'Report' | 'Guide';
  category: string;
  date: string;
  downloads: number;
}

export default function RecentResourcesCard() {
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Real Estate Investment Guide 2025',
      type: 'PDF',
      category: 'Investment',
      date: '2 days ago',
      downloads: 234
    },
    {
      id: '2',
      title: 'Market Analysis Report Q1 2025',
      type: 'Report',
      category: 'Market Research',
      date: '1 week ago',
      downloads: 189
    },
    {
      id: '3',
      title: 'Property Valuation Masterclass',
      type: 'Video',
      category: 'Education',
      date: '2 weeks ago',
      downloads: 456
    },
    {
      id: '4',
      title: 'Tax Planning for Real Estate Investors',
      type: 'Guide',
      category: 'Finance',
      date: '3 weeks ago',
      downloads: 312
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <Video className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Resources</CardTitle>
        <CardDescription>Latest materials added to the library</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {resources.map((resource) => (
          <div key={resource.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="mt-1">{getIcon(resource.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">{resource.title}</h4>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{resource.category}</span>
                <span>•</span>
                <span>{resource.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {resource.downloads}
                </span>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="shrink-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
