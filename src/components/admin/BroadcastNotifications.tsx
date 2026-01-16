import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, Eye, Clock, Users, FileText, Link as LinkIcon } from 'lucide-react';
import { NotificationTemplates } from './NotificationTemplates';
import { NotificationPreview } from './NotificationPreview';
import { NotificationTracking } from './NotificationTracking';

export default function BroadcastNotifications() {
  const [recipient, setRecipient] = useState('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSend = () => {
    console.log('Sending notification:', { recipient, title, message, link, scheduleDate });
    alert('Notification sent successfully!');
  };

  return (
    <Tabs defaultValue="compose" className="space-y-6">
      <TabsList>
        <TabsTrigger value="compose"><Bell className="h-4 w-4 mr-2" />Compose</TabsTrigger>
        <TabsTrigger value="templates"><FileText className="h-4 w-4 mr-2" />Templates</TabsTrigger>
        <TabsTrigger value="tracking"><Users className="h-4 w-4 mr-2" />Tracking</TabsTrigger>
      </TabsList>

      <TabsContent value="compose">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Broadcast Notification</h2>
          
          <div className="space-y-6">
            <div>
              <Label>Recipients</Label>
              <Select value={recipient} onValueChange={setRecipient}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="bronze">Bronze Tier</SelectItem>
                  <SelectItem value="silver">Silver Tier</SelectItem>
                  <SelectItem value="gold">Gold Tier</SelectItem>
                  <SelectItem value="platinum">Platinum Tier</SelectItem>
                  <SelectItem value="chapter">By Chapter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" />
            </div>

            <div>
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Notification message" />
            </div>

            <div>
              <Label>Link (Optional)</Label>
              <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
            </div>

            <div>
              <Label>Schedule (Optional)</Label>
              <Input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setShowPreview(true)} variant="outline"><Eye className="h-4 w-4 mr-2" />Preview</Button>
              <Button onClick={handleSend}><Send className="h-4 w-4 mr-2" />Send Now</Button>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="templates">
        <NotificationTemplates onSelect={(template) => {
          setTitle(template.title);
          setMessage(template.message);
        }} />
      </TabsContent>

      <TabsContent value="tracking">
        <NotificationTracking />
      </TabsContent>

      {showPreview && <NotificationPreview title={title} message={message} link={link} onClose={() => setShowPreview(false)} />}
    </Tabs>
  );
}
