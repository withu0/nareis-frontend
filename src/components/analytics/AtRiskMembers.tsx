import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Mail, Phone, TrendingDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const atRiskMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    lastLogin: '28 days ago',
    engagementScore: 23,
    riskLevel: 'high',
    reasons: ['No logins in 28 days', 'Zero event attendance', 'No forum activity'],
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    lastLogin: '21 days ago',
    engagementScore: 35,
    riskLevel: 'high',
    reasons: ['Declining engagement', 'Missed renewal reminder', 'No resource downloads'],
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    lastLogin: '15 days ago',
    engagementScore: 48,
    riskLevel: 'medium',
    reasons: ['Reduced forum participation', 'Event attendance dropped'],
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.k@example.com',
    lastLogin: '12 days ago',
    engagementScore: 52,
    riskLevel: 'medium',
    reasons: ['No recent event registrations', 'Profile incomplete'],
  },
];

const getRiskColor = (level: string) => {
  switch (level) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
};

export function AtRiskMembers() {
  const handleContact = (memberId: number, method: string) => {
    console.log(`Contacting member ${memberId} via ${method}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            At-Risk Members (Predictive Analytics)
          </CardTitle>
          <Button variant="outline" size="sm">
            Export List
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {atRiskMembers.map((member) => (
            <div key={member.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Last login: {member.lastLogin}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getRiskColor(member.riskLevel)}>
                    {member.riskLevel.toUpperCase()} RISK
                  </Badge>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="font-semibold">{member.engagementScore}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Risk Factors:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {member.reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleContact(member.id, 'email')}>
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleContact(member.id, 'phone')}>
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="default">
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
