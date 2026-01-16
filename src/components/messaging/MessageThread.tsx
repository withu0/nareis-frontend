import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface MessageThreadProps {
  id: string;
  participant: {
    name: string;
    avatar?: string;
    company?: string;
  };
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isActive: boolean;
  onClick: () => void;
}

export function MessageThread({
  participant,
  lastMessage,
  timestamp,
  unreadCount,
  isActive,
  onClick
}: MessageThreadProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 flex items-start gap-3 hover:bg-accent transition-colors text-left ${
        isActive ? 'bg-accent' : ''
      }`}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={participant.avatar} alt={participant.name} />
        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-sm truncate">{participant.name}</h4>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </span>
        </div>
        {participant.company && (
          <p className="text-xs text-muted-foreground mb-1">{participant.company}</p>
        )}
        <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
      </div>
      {unreadCount > 0 && (
        <Badge variant="default" className="ml-2">{unreadCount}</Badge>
      )}
    </button>
  );
}