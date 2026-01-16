import { Resource } from '@/types/resource';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Star, Bookmark, BookmarkCheck, Clock } from 'lucide-react';
import { useState } from 'react';

interface ResourceCardProps {
  resource: Resource;
  onView: (resource: Resource) => void;
}

export function ResourceCard({ resource, onView }: ResourceCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [downloads, setDownloads] = useState(resource.downloads);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloads(prev => prev + 1);
    // Simulate download
    window.open(resource.fileUrl, '_blank');
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => onView(resource)}>
      <div className="relative">
        <img 
          src={resource.imageUrl} 
          alt={resource.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge className="absolute top-2 left-2">{resource.type}</Badge>
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2"
          onClick={handleBookmark}
        >
          {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </Button>
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{resource.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {resource.topics.slice(0, 3).map(topic => (
            <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{resource.rating}</span>
            <span>({resource.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{downloads}</span>
          </div>
          {resource.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{resource.duration}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-xs text-muted-foreground">{resource.fileSize}</span>
        <Button size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
