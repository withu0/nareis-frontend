import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ApplicationFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  tierFilter: string;
  setTierFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export default function ApplicationFilters({
  searchTerm,
  setSearchTerm,
  tierFilter,
  setTierFilter,
  sortBy,
  setSortBy
}: ApplicationFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="relative flex-1 min-w-[250px]">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name, email, company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={tierFilter} onValueChange={setTierFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Tiers" />
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
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="name">Name A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
