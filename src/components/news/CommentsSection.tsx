import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
}

const CommentsSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Michael Chen',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1760604302877_d0e13d4e.webp',
      content: 'Great insights! This analysis really helps understand the current market dynamics.',
      date: '2 hours ago'
    },
    {
      id: '2',
      author: 'Jennifer Williams',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1760604308588_57b56441.webp',
      content: 'Thanks for sharing this. Looking forward to implementing these strategies.',
      date: '5 hours ago'
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      toast.success('Comment posted successfully!');
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-900" />
        <h3 className="text-xl font-bold">Member Discussion ({comments.length})</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
        />
        <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
          Post Comment
        </Button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <Avatar>
              <AvatarImage src={comment.avatar} />
              <AvatarFallback>{comment.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-sm text-gray-500">{comment.date}</span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
