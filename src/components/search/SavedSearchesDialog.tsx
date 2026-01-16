import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/contexts/SearchContext';
import { Trash2, Search, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SavedSearchesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplySearch: (filters: any) => void;
  section?: string;
}

export const SavedSearchesDialog = ({ open, onOpenChange, onApplySearch, section }: SavedSearchesDialogProps) => {
  const { savedSearches, deleteSavedSearch } = useSearch();

  const filteredSearches = section 
    ? savedSearches.filter(s => s.section === section)
    : savedSearches;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Saved Searches</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {filteredSearches.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No saved searches yet</p>
          ) : (
            filteredSearches.map((search) => (
              <div key={search.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">{search.name}</h3>
                      <Badge variant="outline">{search.section}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(search.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        onApplySearch(search.filters);
                        onOpenChange(false);
                      }}
                    >
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteSavedSearch(search.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
