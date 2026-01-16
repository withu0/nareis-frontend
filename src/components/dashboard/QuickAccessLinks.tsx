import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Megaphone, BookOpen, Calendar, FileText, Settings, CreditCard, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickAccessLinks() {
  const navigate = useNavigate();

  const quickLinks = [
    { 
      icon: <Users className="h-5 w-5" />, 
      label: 'Member Directory', 
      description: 'Connect with members',
      action: () => navigate('/find-local-chapter')
    },
    { 
      icon: <Megaphone className="h-5 w-5" />, 
      label: 'Advocacy Tools', 
      description: 'Voice your concerns',
      action: () => navigate('/advocacy')
    },
    { 
      icon: <BookOpen className="h-5 w-5" />, 
      label: 'Resources', 
      description: 'Access materials',
      action: () => navigate('/resources')
    },
    { 
      icon: <Calendar className="h-5 w-5" />, 
      label: 'Events', 
      description: 'Register for events',
      action: () => navigate('/events')
    },
    { 
      icon: <CreditCard className="h-5 w-5" />, 
      label: 'Billing', 
      description: 'Manage payments',
      action: () => navigate('/billing')
    },
    { 
      icon: <Settings className="h-5 w-5" />, 
      label: 'Settings', 
      description: 'Manage account',
      action: () => navigate('/profile')
    },
    { 
      icon: <Mail className="h-5 w-5" />, 
      label: 'Contact Support', 
      description: 'Get help',
      action: () => navigate('/contact')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Access</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((link, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="h-auto flex flex-col items-center gap-2 p-4 hover:bg-blue-50 hover:border-blue-300"
              onClick={link.action}
            >
              <div className="text-blue-600">{link.icon}</div>
              <div className="text-center">
                <div className="font-medium text-sm">{link.label}</div>
                <div className="text-xs text-gray-500">{link.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
