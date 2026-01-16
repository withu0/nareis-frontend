import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Template {
  id: string;
  title: string;
  message: string;
  category: string;
}

const templates: Template[] = [
  {
    id: '1',
    title: 'Welcome New Members',
    message: 'Welcome to NAREI! We\'re excited to have you join our community of real estate investors and entrepreneurs.',
    category: 'Welcome'
  },
  {
    id: '2',
    title: 'Event Reminder',
    message: 'Don\'t forget! Our upcoming networking event is tomorrow at 6 PM. We look forward to seeing you there!',
    category: 'Events'
  },
  {
    id: '3',
    title: 'Certification Launch',
    message: 'New certification program now available! Enhance your credentials with our professional certification courses.',
    category: 'Education'
  },
  {
    id: '4',
    title: 'Membership Renewal',
    message: 'Your membership is expiring soon. Renew today to continue enjoying all member benefits and resources.',
    category: 'Membership'
  },
  {
    id: '5',
    title: 'New Resource Available',
    message: 'Check out our latest market report and industry insights now available in the Resources section.',
    category: 'Resources'
  },
  {
    id: '6',
    title: 'Chapter Meeting',
    message: 'Your local chapter is hosting a meeting this week. Join us to connect with fellow members in your area.',
    category: 'Chapters'
  }
];

interface NotificationTemplatesProps {
  onSelect: (template: Template) => void;
}

export function NotificationTemplates({ onSelect }: NotificationTemplatesProps) {
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Notification Templates</h2>
      {templates.map((template) => (
        <Card key={template.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{template.title}</h3>
                <Badge variant="secondary">{template.category}</Badge>
              </div>
              <p className="text-sm text-gray-600">{template.message}</p>
            </div>
            <Button onClick={() => onSelect(template)} variant="outline" size="sm">Use Template</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
