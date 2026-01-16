import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferencesProps {
  onBack: () => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    messages: { email: true, push: true, inApp: true },
    events: { email: true, push: true, inApp: true },
    forums: { email: false, push: true, inApp: true },
    resources: { email: false, push: false, inApp: true },
    certifications: { email: true, push: true, inApp: true },
    referrals: { email: true, push: true, inApp: true },
    announcements: { email: true, push: true, inApp: true },
  });

  const handleToggle = (category: keyof typeof preferences, type: 'email' | 'push' | 'inApp') => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type]
      }
    }));
  };

  const handleSave = () => {
    // Save preferences to backend
    toast({
      title: 'Preferences Saved',
      description: 'Your notification preferences have been updated.',
    });
  };

  const categories = [
    { key: 'messages', label: 'Direct Messages' },
    { key: 'events', label: 'Event Reminders' },
    { key: 'forums', label: 'Forum Replies' },
    { key: 'resources', label: 'Resource Updates' },
    { key: 'certifications', label: 'Certification Milestones' },
    { key: 'referrals', label: 'Referral Rewards' },
    { key: 'announcements', label: 'Admin Announcements' },
  ];

  return (
    <div className="mt-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>

      <div className="space-y-6">
        {categories.map(({ key, label }) => (
          <div key={key}>
            <h4 className="font-medium mb-3">{label}</h4>
            <div className="space-y-3 ml-4">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${key}-email`}>Email</Label>
                <Switch
                  id={`${key}-email`}
                  checked={preferences[key as keyof typeof preferences].email}
                  onCheckedChange={() => handleToggle(key as keyof typeof preferences, 'email')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor={`${key}-push`}>Push</Label>
                <Switch
                  id={`${key}-push`}
                  checked={preferences[key as keyof typeof preferences].push}
                  onCheckedChange={() => handleToggle(key as keyof typeof preferences, 'push')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor={`${key}-app`}>In-App</Label>
                <Switch
                  id={`${key}-app`}
                  checked={preferences[key as keyof typeof preferences].inApp}
                  onCheckedChange={() => handleToggle(key as keyof typeof preferences, 'inApp')}
                />
              </div>
            </div>
            <Separator className="mt-4" />
          </div>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full mt-6">
        Save Preferences
      </Button>
    </div>
  );
};

export default NotificationPreferences;
