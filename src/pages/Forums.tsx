import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/ui/back-button';
import { ForumFilters } from '@/components/search/ForumFilters';
import { SavedSearchesDialog } from '@/components/search/SavedSearchesDialog';
import { SearchHistoryDialog } from '@/components/search/SearchHistoryDialog';
import { MessageSquare, Eye, Clock } from 'lucide-react';
import { toast } from 'sonner';

const topics = [
  { id: 1, title: 'Best practices for tenant screening', author: 'John Smith', category: 'Property Management', replies: 24, views: 342, lastActive: '2 hours ago', status: 'unsolved' },
  { id: 2, title: 'New zoning regulations in California', author: 'Sarah Lee', category: 'Regulations', replies: 18, views: 256, lastActive: '5 hours ago', status: 'solved' },
  { id: 3, title: 'Sustainable building materials discussion', author: 'Mike Johnson', category: 'Development', replies: 31, views: 489, lastActive: '1 day ago', status: 'answered' },
  { id: 4, title: 'Marketing strategies for luxury properties', author: 'Emily Chen', category: 'Marketing', replies: 15, views: 198, lastActive: '3 hours ago', status: 'unsolved' },
  { id: 5, title: 'Insurance requirements for commercial properties', author: 'David Park', category: 'Legal', replies: 22, views: 367, lastActive: '6 hours ago', status: 'solved' },
];

export default function Forums() {
  const [filters, setFilters] = useState({
    search: '',
    topic: 'all',
    activity: 'all',
    status: 'all',
    sortBy: 'recent',
  });
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  const filteredTopics = useMemo(() => {
    return topics.filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchesTopic = filters.topic === 'all' || topic.category.toLowerCase().includes(filters.topic);
      const matchesStatus = filters.status === 'all' || topic.status === filters.status;
      return matchesSearch && matchesTopic && matchesStatus;
    });
  }, [filters]);

  const handleExport = () => {
    const csv = [
      ['Title', 'Author', 'Category', 'Replies', 'Views', 'Status'].join(','),
      ...filteredTopics.map(t => [t.title, t.author, t.category, t.replies, t.views, t.status].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forums-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Forum discussions exported successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <BackButton />
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">Discussion Forums</h1>
          <Button>New Topic</Button>
        </div>

        <ForumFilters
          filters={filters}
          onFilterChange={setFilters}
          onExport={handleExport}
          onOpenSaved={() => setShowSavedSearches(true)}
          onOpenHistory={() => setShowSearchHistory(true)}
        />

        <div className="my-6 text-sm text-gray-600">
          Showing {filteredTopics.length} discussions
        </div>

        <div className="space-y-4">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <Badge>{topic.category}</Badge>
                    <Badge variant={topic.status === 'solved' ? 'default' : 'secondary'}>{topic.status}</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-600">Started by {topic.author}</p>
                </div>
                <div className="flex gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> {topic.replies}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" /> {topic.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {topic.lastActive}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <SavedSearchesDialog
          open={showSavedSearches}
          onOpenChange={setShowSavedSearches}
          onApplySearch={(savedFilters) => setFilters(savedFilters)}
          section="forums"
        />

        <SearchHistoryDialog
          open={showSearchHistory}
          onOpenChange={setShowSearchHistory}
          onApplySearch={(query) => setFilters({ ...filters, search: query })}
          section="forums"
        />
      </div>
    </div>
  );
}
