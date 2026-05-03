'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { SearchResult, SearchCategory } from '@/lib/search/types';
import FormMessage from './FormMessage';

interface SearchModalProps {
  category: SearchCategory;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: SearchResult) => void;
}

export default function SearchModal({ category, isOpen, onClose, onSelect }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const url = `/api/search?q=${encodeURIComponent(query)}&categories=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');
      setResults(data.results || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    onSelect(result);
    onClose();
  };

  const handleClose = () => {
    // Reset state when closing
    setQuery('');
    setResults([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  // Get category label for display
  const categoryLabels: Record<SearchCategory, string> = {
    movie: 'Movies',
    tv: 'TV Shows',
    book: 'Books',
    podcast: 'Podcasts',
    album: 'Albums',
    music: 'Music',
    game: 'Games',
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-app border border-app-border bg-app-nav p-6 shadow-2xl relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-app-overlay" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-app-font lowercase">
              Search {categoryLabels[category]}
            </h2>
            <button
              onClick={handleClose}
              className="text-app-font hover:opacity-70 transition-opacity text-xl"
              aria-label="Close modal"
            >
              x
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${categoryLabels[category].toLowerCase()}...`}
              className="flex-1 px-3 py-2 border border-app-border rounded-app text-sm lowercase"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-app-accent text-white rounded-app text-sm lowercase hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'searching...' : 'search'}
            </button>
          </form>

          <FormMessage message={error} type="error" className="mb-4" />

          <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectResult(item)}
                className="w-full text-left p-3 border border-app-border rounded-app hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-zinc-200 px-2 py-0.5 rounded lowercase">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-medium lowercase truncate">{item.title}</h3>
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-zinc-500 lowercase truncate">{item.subtitle}</p>
                    )}
                    {item.year && <p className="text-xs text-zinc-400">{item.year}</p>}
                  </div>
                </div>
              </button>
            ))}

            {!loading && results.length === 0 && query && (
              <p className="text-sm text-zinc-500 text-center py-4">no results found</p>
            )}

            {!loading && results.length === 0 && !query && (
              <p className="text-sm text-zinc-500 text-center py-4">Enter a search term above</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
