import React, { useState, useEffect } from 'react';
import { X, Settings, CheckCheck, Archive, Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationItem, { Notification } from './NotificationItem';
import NotificationPreferences from './NotificationPreferences';
import { useNavigate } from 'react-router-dom';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Mock notifications - replace with API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'message',
        title: 'New Message from John Smith',
        message: 'Hi, I wanted to discuss the upcoming project...',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
      },
      {
        id: '2',
        type: 'event',
        title: 'Event Reminder: Industry Conference',
        message: 'Your event starts in 2 hours',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        actionUrl: '/events'
      },
      {
        id: '3',
        type: 'certification',
        title: 'Certification Milestone Achieved!',
        message: 'You completed Module 3 of E.P.I.C.™ Certification',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
        actionUrl: '/certification'
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  const filteredNotifications = filterType === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filterType);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notifications</span>
            <Button variant="ghost" size="icon" onClick={() => setShowPreferences(!showPreferences)}>
              <Settings className="w-4 h-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {showPreferences ? (
          <NotificationPreferences onBack={() => setShowPreferences(false)} />
        ) : (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">{unreadCount} unread</p>
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="all" onClick={() => setFilterType('all')}>All</TabsTrigger>
                <TabsTrigger value="unread" onClick={() => setFilterType('unread')}>Unread</TabsTrigger>
                <TabsTrigger value="message" onClick={() => setFilterType('message')}>Messages</TabsTrigger>
                <TabsTrigger value="event" onClick={() => setFilterType('event')}>Events</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-200px)] mt-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No notifications</p>
                  </div>
                ) : (
                  filteredNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAsUnread={(id) => setNotifications(prev => 
                        prev.map(n => n.id === id ? { ...n, read: false } : n)
                      )}
                      onClick={handleNotificationClick}
                    />
                  ))
                )}
              </ScrollArea>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
