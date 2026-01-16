import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/lib/emailService';
import { supabase } from '@/lib/supabase';
import { Mail, Send } from 'lucide-react';

export function BulkEmailComponent() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in subject and message',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    try {
      let query = supabase.from('contractors').select('email, full_name');
      
      if (tierFilter !== 'all') {
        query = query.eq('membership_tier', tierFilter);
      }

      const { data: members, error } = await query;

      if (error) throw error;

      const emails = members?.map(m => m.email) || [];
      
      if (emails.length === 0) {
        toast({
          title: 'No Recipients',
          description: 'No members found matching the filter',
          variant: 'destructive'
        });
        setSending(false);
        return;
      }

      await emailService.sendBulkAnnouncement(emails, subject, message);

      toast({
        title: 'Emails Sent',
        description: `Successfully sent to ${emails.length} members`
      });

      setSubject('');
      setMessage('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send emails',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Bulk Email
        </CardTitle>
        <CardDescription>
          Send announcements to all members or specific membership tiers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="tier-filter">Recipient Filter</Label>
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger id="tier-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="basic">Basic Members</SelectItem>
              <SelectItem value="professional">Professional Members</SelectItem>
              <SelectItem value="executive">Executive Members</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
          />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Email message (HTML supported)"
            rows={8}
          />
        </div>

        <Button onClick={handleSend} disabled={sending} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          {sending ? 'Sending...' : 'Send Email'}
        </Button>
      </CardContent>
    </Card>
  );
}