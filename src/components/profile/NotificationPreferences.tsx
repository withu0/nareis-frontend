import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export function NotificationPreferences({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState({
    emailNews: user?.user_metadata?.email_news ?? true,
    emailEvents: user?.user_metadata?.email_events ?? true,
    emailResources: user?.user_metadata?.email_resources ?? true,
    emailAdvocacy: user?.user_metadata?.email_advocacy ?? true,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: { email_news: prefs.emailNews, email_events: prefs.emailEvents, email_resources: prefs.emailResources, email_advocacy: prefs.emailAdvocacy }
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Notification preferences updated' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="emailNews">News & Updates</Label>
        <Switch id="emailNews" checked={prefs.emailNews} onCheckedChange={(checked) => setPrefs({...prefs, emailNews: checked})} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="emailEvents">Event Notifications</Label>
        <Switch id="emailEvents" checked={prefs.emailEvents} onCheckedChange={(checked) => setPrefs({...prefs, emailEvents: checked})} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="emailResources">New Resources</Label>
        <Switch id="emailResources" checked={prefs.emailResources} onCheckedChange={(checked) => setPrefs({...prefs, emailResources: checked})} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="emailAdvocacy">Advocacy Alerts</Label>
        <Switch id="emailAdvocacy" checked={prefs.emailAdvocacy} onCheckedChange={(checked) => setPrefs({...prefs, emailAdvocacy: checked})} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Preferences'}</Button>
    </form>
  );
}
