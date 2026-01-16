import { useState } from 'react';
import { MessageThread } from '@/components/messaging/MessageThread';
import { ConversationView } from '@/components/messaging/ConversationView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PenSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackButton } from '@/components/ui/back-button';


// Mock data - will be replaced with real Supabase data
const mockConversations = [
  {
    id: '1',
    participant: { id: 'u1', name: 'Sarah Johnson', avatar: '', company: 'Johnson Realty' },
    lastMessage: 'Thanks for the information about the property!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 2
  },
  {
    id: '2',
    participant: { id: 'u2', name: 'Michael Chen', avatar: '', company: 'Chen Investments' },
    lastMessage: 'Can we schedule a meeting next week?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0
  }
];

const mockMessages = [
  {
    id: 'm1',
    content: 'Hi! I wanted to discuss the upcoming property listing.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    senderId: 'u1',
    isRead: true
  },
  {
    id: 'm2',
    content: 'Sure! I have some details I can share with you.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    senderId: 'current',
    isRead: true
  },
  {
    id: 'm3',
    content: 'Thanks for the information about the property!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    senderId: 'u1',
    isRead: false
  }
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleSendMessage = (content: string, file?: File) => {
    console.log('Sending message:', content, file);
    // Will integrate with Supabase
  };

  const handleArchive = () => {
    console.log('Archiving conversation');
  };

  const handleBlock = () => {
    console.log('Blocking user');
  };

  const selectedConv = mockConversations.find(c => c.id === selectedConversation);

  return (

    <div className="container mx-auto py-8">
      <BackButton />
      <div className="mb-6">

        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Connect with other NAREI members</p>
      </div>

      <Card className="h-[calc(100vh-250px)] flex">
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b space-y-3">
            <Button className="w-full">
              <PenSquare className="h-4 w-4 mr-2" />
              New Message
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full rounded-none">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
              <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="flex-1 overflow-auto mt-0">
              {mockConversations.map(conv => (
                <MessageThread
                  key={conv.id}
                  {...conv}
                  isActive={selectedConversation === conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                />
              ))}
            </TabsContent>
            <TabsContent value="unread" className="flex-1 overflow-auto mt-0">
              {mockConversations.filter(c => c.unreadCount > 0).map(conv => (
                <MessageThread
                  key={conv.id}
                  {...conv}
                  isActive={selectedConversation === conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                />
              ))}
            </TabsContent>
            <TabsContent value="archived" className="flex-1 overflow-auto mt-0">
              <div className="p-4 text-center text-muted-foreground">
                No archived conversations
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1">
          {selectedConv ? (
            <ConversationView
              participant={selectedConv.participant}
              messages={mockMessages}
              currentUserId="current"
              onSendMessage={handleSendMessage}
              onArchive={handleArchive}
              onBlock={handleBlock}
              isTyping={false}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}