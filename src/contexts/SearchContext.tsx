import React, { createContext, useContext, useState, useEffect } from 'react';

interface SavedSearch {
  id: string;
  name: string;
  section: 'members' | 'resources' | 'events' | 'forums';
  filters: any;
  createdAt: string;
}

interface SearchHistory {
  id: string;
  query: string;
  section: string;
  timestamp: string;
}

interface SearchContextType {
  savedSearches: SavedSearch[];
  searchHistory: SearchHistory[];
  saveSearch: (name: string, section: string, filters: any) => void;
  deleteSavedSearch: (id: string) => void;
  addToHistory: (query: string, section: string) => void;
  clearHistory: () => void;
  getSuggestions: (section: string) => string[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedSearches');
    const history = localStorage.getItem('searchHistory');
    if (saved) setSavedSearches(JSON.parse(saved));
    if (history) setSearchHistory(JSON.parse(history));
  }, []);

  const saveSearch = (name: string, section: any, filters: any) => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      section,
      filters,
      createdAt: new Date().toISOString(),
    };
    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
  };

  const deleteSavedSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
  };

  const addToHistory = (query: string, section: string) => {
    const newHistory: SearchHistory = {
      id: Date.now().toString(),
      query,
      section,
      timestamp: new Date().toISOString(),
    };
    const updated = [newHistory, ...searchHistory].slice(0, 20);
    setSearchHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const getSuggestions = (section: string) => {
    return searchHistory
      .filter(h => h.section === section)
      .map(h => h.query)
      .slice(0, 5);
  };

  return (
    <SearchContext.Provider value={{
      savedSearches,
      searchHistory,
      saveSearch,
      deleteSavedSearch,
      addToHistory,
      clearHistory,
      getSuggestions,
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
  return context;
};
