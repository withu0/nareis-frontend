import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/contexts/SearchContext';
import { Clock, Trash2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplySearch: (query: string) => void;
  section?: string;
}

export const SearchHistoryDialog = ({ open, onOpenChange, onApplySearch, section }: SearchHistoryDialogProps) => {
  const { searchHistory, clearHistory } = useSearch();

  const filteredHistory = section 
    ? searchHistory.filter(h => h.section === section)
    : searchHistory;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Search History</span>
            {filteredHistory.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {filteredHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No search history yet</p>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer flex items-center justify-between"
                onClick={() => {
                  onApplySearch(item.query);
                  onOpenChange(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span>{item.query}</span>
                  <Badge variant="outline" className="text-xs">{item.section}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
