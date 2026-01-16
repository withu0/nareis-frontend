import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Save, Download, History, Bookmark, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { toast } from 'sonner';

interface EventFilters {
  search: string;
  dateRange: string;
  location: string;
  type: string;
  cost: string;
}

interface Props {
  filters: EventFilters;
  onFilterChange: (filters: EventFilters) => void;
  onExport: () => void;
  onOpenSaved: () => void;
  onOpenHistory: () => void;
}

export const EventFilters = ({ filters, onFilterChange, onExport, onOpenSaved, onOpenHistory }: Props) => {
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const { saveSearch, addToHistory } = useSearch();

  const handleSearch = (value: string) => {
    onFilterChange({ ...filters, search: value });
    if (value.length > 2) {
      addToHistory(value, 'events');
    }
  };

  const handleSaveSearch = () => {
    if (saveName.trim()) {
      saveSearch(saveName, 'events', filters);
      toast.success('Search saved successfully');
      setSaveName('');
      setShowSaveInput(false);
    }
  };

  return (
    <div className="space-y-4 bg-card p-6 rounded-lg border">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" onClick={onOpenHistory}>
          <History className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onOpenSaved}>
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select value={filters.dateRange} onValueChange={(v) => onFilterChange({ ...filters, dateRange: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.location} onValueChange={(v) => onFilterChange({ ...filters, location: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="virtual">Virtual</SelectItem>
            <SelectItem value="in-person">In-Person</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.type} onValueChange={(v) => onFilterChange({ ...filters, type: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="conference">Conference</SelectItem>
            <SelectItem value="webinar">Webinar</SelectItem>
            <SelectItem value="networking">Networking</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.cost} onValueChange={(v) => onFilterChange({ ...filters, cost: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Cost" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="member">Member Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        {!showSaveInput ? (
          <Button variant="outline" onClick={() => setShowSaveInput(true)}>
            <Save className="h-4 w-4 mr-2" />
            Save Search
          </Button>
        ) : (
          <div className="flex gap-2 flex-1">
            <Input
              placeholder="Search name..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveSearch}>Save</Button>
            <Button variant="ghost" onClick={() => setShowSaveInput(false)}>Cancel</Button>
          </div>
        )}
        <Button variant="outline" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </Button>
      </div>
    </div>
  );
};
