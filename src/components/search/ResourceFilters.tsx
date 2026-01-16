import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Save, Download, History, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { toast } from 'sonner';

interface ResourceFilters {
  search: string;
  type: string;
  topic: string;
  dateRange: string;
  sortBy: string;
}

interface Props {
  filters: ResourceFilters;
  onFilterChange: (filters: ResourceFilters) => void;
  onExport: () => void;
  onOpenSaved: () => void;
  onOpenHistory: () => void;
}

export const ResourceFilters = ({ filters, onFilterChange, onExport, onOpenSaved, onOpenHistory }: Props) => {
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const { saveSearch, addToHistory } = useSearch();

  const handleSearch = (value: string) => {
    onFilterChange({ ...filters, search: value });
    if (value.length > 2) {
      addToHistory(value, 'resources');
    }
  };

  const handleSaveSearch = () => {
    if (saveName.trim()) {
      saveSearch(saveName, 'resources', filters);
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
            placeholder="Search resources..."
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
        <Select value={filters.type} onValueChange={(v) => onFilterChange({ ...filters, type: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="guide">Guides</SelectItem>
            <SelectItem value="template">Templates</SelectItem>
            <SelectItem value="whitepaper">Whitepapers</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.topic} onValueChange={(v) => onFilterChange({ ...filters, topic: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="management">Management</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.dateRange} onValueChange={(v) => onFilterChange({ ...filters, dateRange: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="quarter">Past Quarter</SelectItem>
            <SelectItem value="year">Past Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={(v) => onFilterChange({ ...filters, sortBy: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="downloads">Most Downloads</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
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
