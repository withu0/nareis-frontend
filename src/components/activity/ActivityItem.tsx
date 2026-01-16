import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Award, Calendar, FileText, Users, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'certification' | 'event' | 'resource' | 'forum' | 'referral';
  member: { name: string; avatar?: string; tier: string };
  content: string;
  timestamp: Date;
  likes: number;
  comments: Array<{ id: string; author: string; text: string; timestamp: Date }>;
  isLiked: boolean;
}

interface ActivityItemProps {
  activity: Activity;
}

const activityIcons = {
  certification: Award,
  event: Calendar,
  resource: FileText,
  forum: MessageCircle,
  referral: Users
};

const activityColors = {
  certification: 'text-yellow-600 bg-yellow-50',
  event: 'text-blue-600 bg-blue-50',
  resource: 'text-green-600 bg-green-50',
  forum: 'text-purple-600 bg-purple-50',
  referral: 'text-pink-600 bg-pink-50'
};

export default function ActivityItem({ activity }: ActivityItemProps) {
  const [isLiked, setIsLiked] = useState(activity.isLiked);
  const [likes, setLikes] = useState(activity.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(activity.comments);
  const [newComment, setNewComment] = useState('');

  const Icon = activityIcons[activity.type];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        id: Date.now().toString(),
        author: 'You',
        text: newComment,
        timestamp: new Date()
      }]);
      setNewComment('');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={activity.member.avatar} />
            <AvatarFallback>{activity.member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{activity.member.name}</span>
                  <span className="text-xs text-muted-foreground">• {activity.member.tier}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${activityColors[activity.type]}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-gray-700">{activity.content}</p>

            <div className="flex items-center gap-4 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={isLiked ? 'text-red-600' : ''}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                {comments.length}
              </Button>
            </div>

            {showComments && (
              <div className="mt-4 space-y-3">
                {comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                ))}
                
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button onClick={handleComment}>Post</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
