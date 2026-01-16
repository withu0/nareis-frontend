import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';

interface SurveyCardProps {
  title: string;
  description: string;
  onTake: () => void;
}

export const SurveyCard: React.FC<SurveyCardProps> = ({ title, description, onTake }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button onClick={onTake}>Take Survey</Button>
      </CardContent>
    </Card>
  );
};
