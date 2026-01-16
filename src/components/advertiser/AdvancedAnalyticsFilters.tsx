import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface AdvancedAnalyticsFiltersProps {
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  selectedAds: string[];
  onAdsChange: (ads: string[]) => void;
  availableAds: any[];
}

export function AdvancedAnalyticsFilters({
  dateRange,
  onDateRangeChange,
  selectedAds,
  onAdsChange,
  availableAds
}: AdvancedAnalyticsFiltersProps) {
  const presets = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 }
  ];

  const applyPreset = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onDateRangeChange({ from, to });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex gap-2">
        {presets.map(preset => (
          <Button key={preset.days} variant="outline" size="sm" onClick={() => applyPreset(preset.days)}>
            {preset.label}
          </Button>
        ))}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd, yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="range" selected={{ from: dateRange.from, to: dateRange.to }} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
