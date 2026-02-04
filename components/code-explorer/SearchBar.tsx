'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/shared/ui/input';
import { Button } from '@/components/shared/ui/button';
import { Search, Loader2, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
  path: string;
  matches: Array<{
    lineNumber: number;
    line: string;
  }>;
}

interface SearchBarProps {
  onFileSelect: (path: string) => void;
}

export function SearchBar({ onFileSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string>('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 500); // 500ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  async function performSearch(searchQuery: string) {
    setIsSearching(true);
    setError('');

    try {
      const response = await fetch(`/api/code-explorer/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setResults(data.results || []);
      setShowResults(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }

  function handleResultClick(path: string) {
    onFileSelect(path);
    setShowResults(false);
    setQuery('');
  }

  function clearSearch() {
    setQuery('');
    setResults([]);
    setShowResults(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search files and code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        {query && !isSearching && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-popover shadow-lg z-50 max-h-96 overflow-y-auto">
          {error && (
            <div className="p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {!error && results.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No results found for &quot;{query}&quot;
            </div>
          )}

          {!error && results.length > 0 && (
            <div className="py-2">
              {results.map((result, index) => (
                <div key={index} className="border-b last:border-b-0">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-accent transition-colors"
                    onClick={() => handleResultClick(result.path)}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm truncate">{result.path}</div>
                        <div className="mt-1 space-y-1">
                          {result.matches.slice(0, 2).map((match, matchIndex) => (
                            <div key={matchIndex} className="text-xs text-muted-foreground">
                              <span className="font-mono">Line {match.lineNumber}:</span>{' '}
                              <span className="truncate">{match.line}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
