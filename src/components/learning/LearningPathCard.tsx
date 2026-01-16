import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Module {
  id: string;
  title: string;
  completed: boolean;
  locked: boolean;
  link: string;
}

interface LearningPathCardProps {
  title: string;
  description: string;
  modules: Module[];
  progress: number;
}

export default function LearningPathCard({ title, description, modules, progress }: LearningPathCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                module.locked ? 'opacity-50' : 'hover:bg-accent cursor-pointer'
              }`}
              onClick={() => !module.locked && navigate(module.link)}
            >
              {module.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              ) : module.locked ? (
                <Lock className="h-5 w-5 text-gray-400 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
              )}
              <span className="text-sm flex-1">{module.title}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
