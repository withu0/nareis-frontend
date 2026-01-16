import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

export const GlobalSearch: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 2) {
      // Simulate search across all content
      const mockResults = [
        { type: 'Event', title: 'Annual Conference 2025', path: '/events' },
        { type: 'Resource', title: 'Market Analysis Report', path: '/resources' },
        { type: 'Member', title: 'John Smith', path: '/member-directory' },
        { type: 'Forum', title: 'Investment Strategies', path: '/forums' },
      ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()));
      setResults(mockResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="flex items-center gap-2 border-b pb-4">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search events, resources, members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((result, i) => (
            <button
              key={i}
              onClick={() => handleSelect(result.path)}
              className="w-full text-left p-3 hover:bg-accent rounded-lg"
            >
              <div className="text-xs text-muted-foreground">{result.type}</div>
              <div className="font-medium">{result.title}</div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
