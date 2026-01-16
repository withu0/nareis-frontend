import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, MoreVertical, Archive, Ban } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  isRead: boolean;
  attachment?: { url: string; name: string };
}

interface ConversationViewProps {
  participant: {
    id: string;
    name: string;
    avatar?: string;
    company?: string;
  };
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, file?: File) => void;
  onArchive: () => void;
  onBlock: () => void;
  isTyping: boolean;
}

export function ConversationView({
  participant,
  messages,
  currentUserId,
  onSendMessage,
  onArchive,
  onBlock,
  isTyping
}: ConversationViewProps) {
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim() || selectedFile) {
      onSendMessage(messageText, selectedFile || undefined);
      setMessageText('');
      setSelectedFile(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={participant.avatar} />
            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{participant.name}</h3>
            {participant.company && (
              <p className="text-sm text-muted-foreground">{participant.company}</p>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onArchive}>
              <Archive className="h-4 w-4 mr-2" />
              Archive Conversation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBlock} className="text-destructive">
              <Ban className="h-4 w-4 mr-2" />
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            content={msg.content}
            timestamp={msg.timestamp}
            isOwn={msg.senderId === currentUserId}
            sender={{
              name: msg.senderId === currentUserId ? 'You' : participant.name,
              avatar: msg.senderId === currentUserId ? undefined : participant.avatar
            }}
            isRead={msg.isRead}
            attachment={msg.attachment}
          />
        ))}
        {isTyping && (
          <div className="text-sm text-muted-foreground italic">
            {participant.name} is typing...
          </div>
        )}
        <div ref={scrollRef} />
      </ScrollArea>

      <div className="border-t p-4">
        {selectedFile && (
          <div className="mb-2 text-sm text-muted-foreground">
            Attached: {selectedFile.name}
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSend}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}