import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Settings, UserCheck, Shield, Bell, Save, Loader2 } from 'lucide-react';

interface AdminSettingsState {
  autoApproval: boolean;
  requireEmailVerification: boolean;
  sendWelcomeEmail: boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettingsState>({
    autoApproval: false,
    requireEmailVerification: true,
    sendWelcomeEmail: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['auto_approval', 'email_verification', 'welcome_email']);

      if (error) throw error;

      if (data && data.length > 0) {
        const newSettings = { ...settings };
        data.forEach(row => {
          if (row.setting_key === 'auto_approval') newSettings.autoApproval = row.setting_value?.enabled ?? false;
          if (row.setting_key === 'email_verification') newSettings.requireEmailVerification = row.setting_value?.enabled ?? true;
          if (row.setting_key === 'welcome_email') newSettings.sendWelcomeEmail = row.setting_value?.enabled ?? true;
        });
        setSettings(newSettings);
      }
    } catch (err) {
      // Fallback to localStorage
      const saved = localStorage.getItem('nareis_admin_settings');
      if (saved) setSettings(JSON.parse(saved));
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const updates = [
        { setting_key: 'auto_approval', setting_value: { enabled: settings.autoApproval, send_welcome_email: settings.sendWelcomeEmail }, description: 'Auto-approve members after payment' },
        { setting_key: 'email_verification', setting_value: { enabled: settings.requireEmailVerification }, description: 'Require email verification' },
        { setting_key: 'welcome_email', setting_value: { enabled: settings.sendWelcomeEmail }, description: 'Send welcome email on approval' }
      ];

      for (const update of updates) {
        await supabase.from('admin_settings').upsert(update, { onConflict: 'setting_key' });
      }

      localStorage.setItem('nareis_admin_settings', JSON.stringify(settings));
      setHasChanges(false);
      toast({ title: 'Settings Saved', description: 'Admin settings updated successfully.' });
    } catch (err) {
      localStorage.setItem('nareis_admin_settings', JSON.stringify(settings));
      setHasChanges(false);
      toast({ title: 'Settings Saved Locally', description: 'Settings saved to local storage.' });
    }
    setSaving(false);
  };


  const handleToggle = (key: keyof AdminSettingsState) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  if (loading) {
    return <Card className="p-8"><div className="flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div></Card>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>Member Approval Settings</CardTitle>
              <CardDescription>Configure how new member applications are processed</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <Label htmlFor="auto-approval" className="text-base font-semibold">Auto-Approve After Payment</Label>
                <p className="text-sm text-gray-600 mt-1">Automatically approve new members when their payment is successful</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={settings.autoApproval ? "default" : "secondary"}>{settings.autoApproval ? 'Enabled' : 'Disabled'}</Badge>
              <Switch id="auto-approval" checked={settings.autoApproval} onCheckedChange={() => handleToggle('autoApproval')} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <Label htmlFor="email-verify" className="text-base font-semibold">Require Email Verification</Label>
                <p className="text-sm text-gray-600 mt-1">Members must verify their email before accessing features</p>
              </div>
            </div>
            <Switch id="email-verify" checked={settings.requireEmailVerification} onCheckedChange={() => handleToggle('requireEmailVerification')} />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-purple-600" />
              <div>
                <Label htmlFor="welcome-email" className="text-base font-semibold">Send Welcome Email</Label>
                <p className="text-sm text-gray-600 mt-1">Send a welcome email when a member is approved</p>
              </div>
            </div>
            <Switch id="welcome-email" checked={settings.sendWelcomeEmail} onCheckedChange={() => handleToggle('sendWelcomeEmail')} />
          </div>

          <div className="pt-4 border-t">
            <Button onClick={saveSettings} disabled={saving || !hasChanges} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
