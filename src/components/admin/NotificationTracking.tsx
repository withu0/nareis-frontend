import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Send, CheckCheck, Clock } from 'lucide-react';

const notifications = [
  {
    id: '1',
    title: 'Welcome New Members',
    sentDate: '2024-01-15',
    recipients: 45,
    delivered: 45,
    read: 38,
    status: 'sent'
  },
  {
    id: '2',
    title: 'Event Reminder - Networking Night',
    sentDate: '2024-01-14',
    recipients: 234,
    delivered: 230,
    read: 198,
    status: 'sent'
  },
  {
    id: '3',
    title: 'New Certification Program Launch',
    sentDate: '2024-01-13',
    recipients: 1234,
    delivered: 1230,
    read: 987,
    status: 'sent'
  },
  {
    id: '4',
    title: 'Membership Renewal Reminder',
    sentDate: '2024-01-20',
    recipients: 156,
    delivered: 0,
    read: 0,
    status: 'scheduled'
  }
];

export function NotificationTracking() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notification Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Send className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold">1,513</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCheck className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold">1,505</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Eye className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Read</p>
              <p className="text-2xl font-bold">1,223</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold">1</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card key={notif.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{notif.title}</h3>
                <p className="text-sm text-gray-600">Sent: {notif.sentDate}</p>
              </div>
              <Badge variant={notif.status === 'sent' ? 'default' : 'secondary'}>
                {notif.status}
              </Badge>
            </div>
            
            {notif.status === 'sent' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Delivery Rate</span>
                  <span className="font-semibold">{((notif.delivered / notif.recipients) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(notif.delivered / notif.recipients) * 100} />
                
                <div className="flex justify-between text-sm mt-2">
                  <span>Read Rate</span>
                  <span className="font-semibold">{((notif.read / notif.delivered) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(notif.read / notif.delivered) * 100} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
