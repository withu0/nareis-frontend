import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, TrendingUp } from 'lucide-react';

interface CertificationProgressProps {
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  progress: number;
  certificationDate?: string;
  expirationDate?: string;
  certificateNumber?: string;
}

export function CertificationProgress({ 
  status, 
  progress, 
  certificationDate, 
  expirationDate,
  certificateNumber 
}: CertificationProgressProps) {
  const statusColors = {
    pending: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
    expired: 'bg-orange-500'
  };

  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Certified',
    expired: 'Expired'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certification Status
          </CardTitle>
          <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {certificateNumber && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Certificate #:</span>
            <span className="font-mono font-semibold">{certificateNumber}</span>
          </div>
        )}

        {certificationDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Certified:</span>
            <span className="font-medium">{new Date(certificationDate).toLocaleDateString()}</span>
          </div>
        )}

        {expirationDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Expires:</span>
            <span className="font-medium">{new Date(expirationDate).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
