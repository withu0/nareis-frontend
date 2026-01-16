import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Users, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BenefitUsage {
  name: string;
  used: number;
  total: number;
  icon: React.ReactNode;
  link: string;
}

export default function BenefitsUsageCard() {
  const navigate = useNavigate();
  
  const benefits: BenefitUsage[] = [
    {
      name: 'Event Registrations',
      used: 3,
      total: 12,
      icon: <Calendar className="h-4 w-4 text-blue-600" />,
      link: '/events'
    },
    {
      name: 'Resource Downloads',
      used: 18,
      total: 50,
      icon: <BookOpen className="h-4 w-4 text-green-600" />,
      link: '/resources'
    },
    {
      name: 'Networking Connections',
      used: 24,
      total: 100,
      icon: <Users className="h-4 w-4 text-purple-600" />,
      link: '/member-directory'
    },
    {
      name: 'Advocacy Submissions',
      used: 2,
      total: 5,
      icon: <FileText className="h-4 w-4 text-orange-600" />,
      link: '/advocacy'
    }
  ];

  const unusedBenefits = benefits.filter(b => (b.used / b.total) < 0.3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Benefits Usage Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Track your membership benefit utilization</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {benefits.map((benefit, idx) => {
          const percentage = (benefit.used / benefit.total) * 100;
          const isUnderused = percentage < 30;
          
          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {benefit.icon}
                  <span className="text-sm font-medium">{benefit.name}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {benefit.used}/{benefit.total}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
              {isUnderused && (
                <div className="flex items-center justify-between text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Underutilized - {benefit.total - benefit.used} remaining
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs"
                    onClick={() => navigate(benefit.link)}
                  >
                    Use Now
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        
        {unusedBenefits.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-sm text-blue-900 mb-2">
              💡 Maximize Your Membership Value
            </h4>
            <p className="text-xs text-blue-700">
              You have {unusedBenefits.length} underutilized benefit{unusedBenefits.length > 1 ? 's' : ''}. 
              Take advantage of all your membership perks to get the most value!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

