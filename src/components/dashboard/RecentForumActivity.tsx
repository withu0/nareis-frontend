import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ForumPost {
  id: string;
  title: string;
  category: string;
  replies: number;
  likes: number;
  views: number;
  lastActivity: string;
  isNew: boolean;
}

export default function RecentForumActivity() {
  const navigate = useNavigate();
  
  const recentPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Best practices for property tax appeals in 2025',
      category: 'Tax Strategy',
      replies: 12,
      likes: 8,
      views: 145,
      lastActivity: '2 hours ago',
      isNew: true
    },
    {
      id: '2',
      title: 'Market outlook: Industrial real estate trends',
      category: 'Market Analysis',
      replies: 24,
      likes: 15,
      views: 289,
      lastActivity: '5 hours ago',
      isNew: true
    },
    {
      id: '3',
      title: 'Financing strategies for multifamily acquisitions',
      category: 'Investment',
      replies: 18,
      likes: 22,
      views: 312,
      lastActivity: '1 day ago',
      isNew: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Forum Activity</span>
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate('/forums')}
            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-medium text-sm flex-1">{post.title}</h4>
              {post.isNew && <Badge variant="secondary">New</Badge>}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="text-blue-600">{post.category}</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {post.replies}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.views}
              </span>
              <span className="ml-auto">{post.lastActivity}</span>
            </div>
          </div>
        ))}
        <button
          onClick={() => navigate('/forums')}
          className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
        >
          View All Forum Discussions →
        </button>
      </CardContent>
    </Card>
  );
}
