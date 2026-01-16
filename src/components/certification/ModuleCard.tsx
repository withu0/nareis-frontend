import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Lock } from 'lucide-react';
import { CertificationModule } from '@/data/certificationData';

interface ModuleCardProps {
  module: CertificationModule;
  onStart: (moduleId: string) => void;
  locked?: boolean;
}

export function ModuleCard({ module, onStart, locked = false }: ModuleCardProps) {
  return (
    <Card className={locked ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{module.title}</CardTitle>
            <CardDescription className="mt-2">{module.description}</CardDescription>
          </div>
          {module.completed && (
            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
          )}
          {locked && <Lock className="h-6 w-6 text-gray-400 flex-shrink-0" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{module.durationHours} hours</span>
            </div>
            {module.required && <Badge variant="secondary">Required</Badge>}
            {module.completed && module.score && (
              <Badge variant="default">Score: {module.score}%</Badge>
            )}
          </div>
          <Button 
            onClick={() => onStart(module.id)} 
            disabled={locked}
            variant={module.completed ? 'outline' : 'default'}
          >
            {module.completed ? 'Review' : locked ? 'Locked' : 'Start Module'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
