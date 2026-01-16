import { Button } from '@/components/ui/button';
import { Award, Calendar, FileText, MessageCircle, Users, TrendingUp } from 'lucide-react';

interface ActivityFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: 'all', label: 'All Activity', icon: TrendingUp },
  { id: 'certification', label: 'Certifications', icon: Award },
  { id: 'event', label: 'Events', icon: Calendar },
  { id: 'resource', label: 'Resources', icon: FileText },
  { id: 'forum', label: 'Forum Posts', icon: MessageCircle },
  { id: 'referral', label: 'Referrals', icon: Users }
];

export default function ActivityFilters({ selectedFilter, onFilterChange }: ActivityFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => {
        const Icon = filter.icon;
        return (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
