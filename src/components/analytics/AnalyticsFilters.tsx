import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';

interface AnalyticsFiltersProps {
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  onExport: (format: 'csv' | 'pdf' | 'xlsx') => void;
  selectedChapter?: string;
  onChapterChange?: (chapter: string) => void;
}

export function AnalyticsFilters({ dateRange, onDateRangeChange, onExport, selectedChapter, onChapterChange }: AnalyticsFiltersProps) {
  const presets = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
    { label: 'Last Year', days: 365 },
  ];

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
      <div className="flex gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => {
              const to = new Date();
              const from = new Date(to.getTime() - preset.days * 24 * 60 * 60 * 1000);
              onDateRangeChange({ from, to });
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" />
          </PopoverContent>
        </Popover>

        <Select value={selectedChapter} onValueChange={onChapterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Chapters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>
            <SelectItem value="northeast">Northeast</SelectItem>
            <SelectItem value="southeast">Southeast</SelectItem>
            <SelectItem value="midwest">Midwest</SelectItem>
            <SelectItem value="west">West</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => onExport(val as 'csv' | 'pdf' | 'xlsx')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Export" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">Export CSV</SelectItem>
            <SelectItem value="pdf">Export PDF</SelectItem>
            <SelectItem value="xlsx">Export Excel</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
