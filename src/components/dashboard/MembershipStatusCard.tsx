import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MembershipStatusCardProps {
  tier: string;
  renewalDate: string;
  status: 'active' | 'expiring' | 'expired';
}

export default function MembershipStatusCard({ tier, renewalDate, status }: MembershipStatusCardProps) {
  const navigate = useNavigate();
  
  const tierColors = {
    'Investor': 'bg-purple-100 text-purple-800 border-purple-300',
    'Affiliate': 'bg-blue-100 text-blue-800 border-blue-300',
    'Associate': 'bg-green-100 text-green-800 border-green-300'
  };

  const statusColors = {
    'active': 'bg-green-500',
    'expiring': 'bg-yellow-500',
    'expired': 'bg-red-500'
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Membership Status
          </CardTitle>
          <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Current Tier</p>
          <Badge className={tierColors[tier as keyof typeof tierColors] || tierColors.Associate}>
            {tier} Member
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">Renewal Date</p>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{renewalDate}</span>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Full Access to Resources</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Event Registration Priority</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Member Directory Listing</span>
          </div>
        </div>

        <Button 
          className="w-full mt-4" 
          variant="outline"
          onClick={() => navigate('/member-benefits')}
        >
          View All Benefits
        </Button>
      </CardContent>
    </Card>
  );
}
