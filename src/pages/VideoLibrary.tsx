import { BackButton } from '@/components/ui/back-button';
import { Card } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Play, Clock, Users } from 'lucide-react';

const videos = [
  { id: 1, title: 'Property Management Fundamentals', duration: '45 min', views: 1234, category: 'Training', thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761067780407_0eb0d0bd.webp' },
  { id: 2, title: 'Legal Compliance Workshop', duration: '60 min', views: 892, category: 'Legal', thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761067780407_0eb0d0bd.webp' },
  { id: 3, title: 'Sustainable Development Practices', duration: '38 min', views: 1567, category: 'Development', thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761067780407_0eb0d0bd.webp' },
  { id: 4, title: 'Marketing Your Properties', duration: '52 min', views: 2103, category: 'Marketing', thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761067780407_0eb0d0bd.webp' },
  { id: 5, title: 'Financial Planning for Real Estate', duration: '70 min', views: 945, category: 'Finance', thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761067780407_0eb0d0bd.webp' },
  { id: 6, title: 'Tenant Relations Best Practices', duration: '42 min', views: 1678, category: 'Management', thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761067780407_0eb0d0bd.webp' },
];

export default function VideoLibrary() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <BackButton />
        <h1 className="text-4xl font-bold mb-8">Video Library</h1>


        
        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="relative">
                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="p-4">
                <Badge className="mb-2">{video.category}</Badge>
                <h3 className="font-bold mb-2">{video.title}</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {video.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {video.views} views
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
