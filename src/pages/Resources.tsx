import { useState, useMemo } from 'react';

import { BackButton } from '@/components/ui/back-button';
import { resourcesData, categories, resourceTypes } from '@/data/resourcesData';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { ResourceUploadForm } from '@/components/resources/ResourceUploadForm';
import { ResourceAnalytics } from '@/components/resources/ResourceAnalytics';
import { ResourceFilters } from '@/components/search/ResourceFilters';
import { SavedSearchesDialog } from '@/components/search/SavedSearchesDialog';
import { SearchHistoryDialog } from '@/components/search/SearchHistoryDialog';
import { Resource } from '@/types/resource';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Star, Download, Calendar, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Resources() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    topic: 'all',
    dateRange: 'all',
    sortBy: 'popularity',
  });
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('library');

  const isChapterLeader = user?.role === 'admin' || user?.role === 'chapter_leader';

  const filteredResources = useMemo(() => {
    let results = resourcesData.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           resource.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                           resource.topics.some(t => t.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesType = filters.type === 'all' || resource.type === filters.type;
      const matchesTopic = filters.topic === 'all' || resource.topics.some(t => t.toLowerCase().includes(filters.topic));
      return matchesSearch && matchesType && matchesTopic;
    });

    if (filters.sortBy === 'popularity') results.sort((a, b) => b.downloads - a.downloads);
    else if (filters.sortBy === 'recent') results.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    else if (filters.sortBy === 'title') results.sort((a, b) => a.title.localeCompare(b.title));
    
    return results;
  }, [filters]);

  const handleExport = () => {
    const csv = [
      ['Title', 'Type', 'Category', 'Downloads', 'Rating', 'Upload Date'].join(','),
      ...filteredResources.map(r => 
        [r.title, r.type, r.category, r.downloads, r.rating, new Date(r.uploadDate).toLocaleDateString()].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resources-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Resources exported successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8" data-tour="resources">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Resource Library</h1>
        <p className="text-muted-foreground">Access industry reports, templates, guides, and educational materials</p>
      </div>


      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="library">Resource Library</TabsTrigger>
          {isChapterLeader && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          <ResourceFilters
            filters={filters}
            onFilterChange={setFilters}
            onExport={handleExport}
            onOpenSaved={() => setShowSavedSearches(true)}
            onOpenHistory={() => setShowSearchHistory(true)}
          />

          {isChapterLeader && (
            <div className="flex justify-end">
              <Button onClick={() => setShowUploadDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resource
              </Button>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Showing {filteredResources.length} resources
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} onView={setSelectedResource} />
            ))}
          </div>
        </TabsContent>

        {isChapterLeader && (
          <TabsContent value="analytics">
            <ResourceAnalytics />
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
          </DialogHeader>
          {selectedResource && (
            <div className="space-y-4">
              <img src={selectedResource.imageUrl} alt={selectedResource.title} className="w-full h-64 object-cover rounded-lg" />
              <div className="flex items-center gap-4">
                <Badge>{selectedResource.type}</Badge>
                <Badge variant="outline">{selectedResource.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{selectedResource.rating}</span>
                  <span className="text-muted-foreground">({selectedResource.reviewCount} reviews)</span>
                </div>
              </div>
              <p className="text-muted-foreground">{selectedResource.description}</p>
              <div className="flex flex-wrap gap-2">
                {selectedResource.topics.map(topic => (
                  <Badge key={topic} variant="secondary">{topic}</Badge>
                ))}
              </div>
              <Card>
                <CardContent className="pt-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span className="text-muted-foreground">Uploaded by:</span>
                    <span className="font-medium">{selectedResource.uploadedBy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{new Date(selectedResource.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Download className="h-4 w-4" />
                    <span className="text-muted-foreground">Downloads:</span>
                    <span className="font-medium">{selectedResource.downloads}</span>
                  </div>
                </CardContent>
              </Card>
              <Button className="w-full" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Download Resource ({selectedResource.fileSize})
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Resource</DialogTitle>
          </DialogHeader>
          <ResourceUploadForm onClose={() => setShowUploadDialog(false)} />
        </DialogContent>
      </Dialog>

      <SavedSearchesDialog
        open={showSavedSearches}
        onOpenChange={setShowSavedSearches}
        onApplySearch={(savedFilters) => setFilters(savedFilters)}
        section="resources"
      />

      <SearchHistoryDialog
        open={showSearchHistory}
        onOpenChange={setShowSearchHistory}
        onApplySearch={(query) => setFilters({ ...filters, search: query })}
        section="resources"
      />
    </div>
  );
}
