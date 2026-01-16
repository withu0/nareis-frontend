import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate('/')}
      className="mb-4"
    >
      <Home className="h-4 w-4 mr-2" />
      Back to Main Page
    </Button>
  );
}
