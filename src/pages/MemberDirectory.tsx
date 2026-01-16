import { useState, useMemo, useEffect } from 'react';

import { Navigation } from '@/components/narei/Navigation';
import Footer from '@/components/narei/Footer';
import { MemberDirectoryCard } from '@/components/directory/MemberDirectoryCard';
import { MemberDirectoryFilters } from '@/components/search/MemberDirectoryFilters';
import { SavedSearchesDialog } from '@/components/search/SavedSearchesDialog';
import { SearchHistoryDialog } from '@/components/search/SearchHistoryDialog';
import { fetchMembers } from '@/lib/memberService';
import { Member } from '@/types/member';
import { Users, Database, HardDrive } from 'lucide-react';
import { toast } from 'sonner';
import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';


export default function MemberDirectory() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromDatabase, setFromDatabase] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: 'all',
    expertise: 'all',
    companySize: 'all',
    membershipTier: 'all',
  });
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      console.log('Loading members...');
      const result = await fetchMembers();
      console.log('Members loaded:', result.data.length, 'fromDatabase:', result.fromDatabase);
      setMembers(result.data);
      setFromDatabase(result.fromDatabase);
      if (result.fromDatabase) {
        toast.success(`Loaded ${result.data.length} members from database`);
      } else {
        toast.info('Showing sample data - run seed scripts to populate database');
      }
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };


  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.expertise.some(e => e.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesLocation = filters.location === 'all' || member.state.toLowerCase().includes(filters.location);
      const matchesExpertise = filters.expertise === 'all' || member.expertise.some(e => e.toLowerCase().includes(filters.expertise));
      const matchesTier = filters.membershipTier === 'all' || member.membershipTier.toLowerCase() === filters.membershipTier.toLowerCase();

      return matchesSearch && matchesLocation && matchesExpertise && matchesTier;
    });
  }, [filters, members]);

  const handleExport = () => {
    const csv = [
      ['Name', 'Company', 'State', 'Industry', 'Membership Tier', 'Expertise'].join(','),
      ...filteredMembers.map(m => 
        [m.name, m.company, m.state, m.industry, m.membershipTier, m.expertise.join('; ')].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `member-directory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Member directory exported successfully');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20" data-tour="directory">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-10 w-10" />
              <h1 className="text-4xl font-bold">Member Directory</h1>
            </div>
            <p className="text-xl text-blue-100">
              Connect with insulation professionals across the nation
            </p>
            <div className="mt-4">
              <Badge variant={fromDatabase ? "default" : "secondary"} className="gap-2">
                {fromDatabase ? <Database className="h-3 w-3" /> : <HardDrive className="h-3 w-3" />}
                {fromDatabase ? 'Live Database' : 'Sample Data'}
              </Badge>
            </div>
          </div>
        </div>


        <div className="container mx-auto px-4 py-12">
          <BackButton />

          <MemberDirectoryFilters
            filters={filters}
            onFilterChange={setFilters}
            onExport={handleExport}
            onOpenSaved={() => setShowSavedSearches(true)}
            onOpenHistory={() => setShowSearchHistory(true)}
          />

          <div className="mt-6 mb-4 text-sm text-muted-foreground">
            Showing {filteredMembers.length} of {members.length} members
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-6 border rounded-lg">
                  <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map(member => (
                <MemberDirectoryCard key={member.id} member={member} />
              ))}
            </div>
          )}

          {!isLoading && filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No members found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </main>

      <SavedSearchesDialog
        open={showSavedSearches}
        onOpenChange={setShowSavedSearches}
        onApplySearch={(savedFilters) => setFilters(savedFilters)}
        section="members"
      />

      <SearchHistoryDialog
        open={showSearchHistory}
        onOpenChange={setShowSearchHistory}
        onApplySearch={(query) => setFilters({ ...filters, search: query })}
        section="members"
      />

      <Footer />
    </div>
  );
}

