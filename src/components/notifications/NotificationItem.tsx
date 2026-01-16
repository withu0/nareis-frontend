import React from 'react';
import { Bell, MessageSquare, Calendar, FileText, Award, Gift, Megaphone, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export interface Notification {
  id: string;
  type: 'message' | 'event' | 'forum' | 'resource' | 'certification' | 'referral' | 'announcement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onClick: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead, 
  onMarkAsUnread,
  onClick 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'event': return <Calendar className="w-5 h-5 text-green-600" />;
      case 'forum': return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'resource': return <FileText className="w-5 h-5 text-orange-600" />;
      case 'certification': return <Award className="w-5 h-5 text-yellow-600" />;
      case 'referral': return <Gift className="w-5 h-5 text-pink-600" />;
      case 'announcement': return <Megaphone className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div 
      className={`p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
      onClick={() => onClick(notification)}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
            {!notification.read && <Badge variant="default" className="text-xs">New</Badge>}
          </div>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-2">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
