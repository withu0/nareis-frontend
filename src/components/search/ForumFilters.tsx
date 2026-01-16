import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Save, Download, History, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { toast } from 'sonner';

interface ForumFilters {
  search: string;
  topic: string;
  activity: string;
  status: string;
  sortBy: string;
}

interface Props {
  filters: ForumFilters;
  onFilterChange: (filters: ForumFilters) => void;
  onExport: () => void;
  onOpenSaved: () => void;
  onOpenHistory: () => void;
}

export const ForumFilters = ({ filters, onFilterChange, onExport, onOpenSaved, onOpenHistory }: Props) => {
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const { saveSearch, addToHistory } = useSearch();

  const handleSearch = (value: string) => {
    onFilterChange({ ...filters, search: value });
    if (value.length > 2) {
      addToHistory(value, 'forums');
    }
  };

  const handleSaveSearch = () => {
    if (saveName.trim()) {
      saveSearch(saveName, 'forums', filters);
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
            placeholder="Search discussions..."
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
        <Select value={filters.topic} onValueChange={(v) => onFilterChange({ ...filters, topic: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            <SelectItem value="general">General Discussion</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.activity} onValueChange={(v) => onFilterChange({ ...filters, activity: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Activity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activity</SelectItem>
            <SelectItem value="today">Active Today</SelectItem>
            <SelectItem value="week">Active This Week</SelectItem>
            <SelectItem value="month">Active This Month</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => onFilterChange({ ...filters, status: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="solved">Solved</SelectItem>
            <SelectItem value="unsolved">Unsolved</SelectItem>
            <SelectItem value="answered">Answered</SelectItem>
            <SelectItem value="unanswered">Unanswered</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={(v) => onFilterChange({ ...filters, sortBy: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="replies">Most Replies</SelectItem>
            <SelectItem value="views">Most Views</SelectItem>
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
