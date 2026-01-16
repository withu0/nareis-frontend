import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Check, CheckCheck, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  isOwn: boolean;
  sender: {
    name: string;
    avatar?: string;
  };
  isRead?: boolean;
  attachment?: {
    url: string;
    name: string;
  };
}

export function MessageBubble({
  content,
  timestamp,
  isOwn,
  sender,
  isRead,
  attachment
}: MessageBubbleProps) {
  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={sender.avatar} alt={sender.name} />
        <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
          {attachment && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-start"
              onClick={() => window.open(attachment.url, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              {attachment.name}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <span>{format(timestamp, 'h:mm a')}</span>
          {isOwn && (
            isRead ? (
              <CheckCheck className="h-3 w-3 text-blue-500" />
            ) : (
              <Check className="h-3 w-3" />
            )
          )}
        </div>
      </div>
    </div>
  );
}