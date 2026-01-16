import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Save, Download, History, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { toast } from 'sonner';

interface MemberFilters {
  search: string;
  location: string;
  expertise: string;
  companySize: string;
  membershipTier: string;
}

interface Props {
  filters: MemberFilters;
  onFilterChange: (filters: MemberFilters) => void;
  onExport: () => void;
  onOpenSaved: () => void;
  onOpenHistory: () => void;
}

export const MemberDirectoryFilters = ({ filters, onFilterChange, onExport, onOpenSaved, onOpenHistory }: Props) => {
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const { saveSearch, addToHistory } = useSearch();

  const handleSearch = (value: string) => {
    onFilterChange({ ...filters, search: value });
    if (value.length > 2) {
      addToHistory(value, 'members');
    }
  };

  const handleSaveSearch = () => {
    if (saveName.trim()) {
      saveSearch(saveName, 'members', filters);
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
            placeholder="Search members..."
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
        <Select value={filters.location} onValueChange={(v) => onFilterChange({ ...filters, location: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="northeast">Northeast</SelectItem>
            <SelectItem value="southeast">Southeast</SelectItem>
            <SelectItem value="midwest">Midwest</SelectItem>
            <SelectItem value="west">West</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.expertise} onValueChange={(v) => onFilterChange({ ...filters, expertise: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Expertise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Expertise</SelectItem>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
            <SelectItem value="property-management">Property Management</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.companySize} onValueChange={(v) => onFilterChange({ ...filters, companySize: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Company Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            <SelectItem value="1-10">1-10 employees</SelectItem>
            <SelectItem value="11-50">11-50 employees</SelectItem>
            <SelectItem value="51-200">51-200 employees</SelectItem>
            <SelectItem value="200+">200+ employees</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.membershipTier} onValueChange={(v) => onFilterChange({ ...filters, membershipTier: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Membership Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="foundation">Foundation Member</SelectItem>
            <SelectItem value="growth">Growth Member</SelectItem>
            <SelectItem value="professional">Professional Member</SelectItem>
            <SelectItem value="enterprise">Enterprise Member</SelectItem>
            <SelectItem value="founding-lifetime">Founding Lifetime Member</SelectItem>
            <SelectItem value="service-partner">Service Partner Member</SelectItem>
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
