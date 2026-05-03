'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { SearchResult, SearchCategory } from '@/lib/search/types';
import FormMessage from './FormMessage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: SearchResult) => void;
  category: string; // The category label (e.g. 'music', 'books')
}

// Map the UI category labels to the search categories
const CATEGORY_MAP: Record<string, SearchCategory> = {
  music: 'music',
  songs: 'music',
  books: 'book',
  reading: 'book',
  literature: 'book',
  films: 'movie',
  movies: 'movie',
  cinema: 'movie',
  'tv shows': 'tv',
  tv: 'tv',
  shows: 'tv',
  podcasts: 'podcast',
  listening: 'podcast',
  albums: 'album',
  discography: 'album',
  games: 'game',
  gaming: 'game',
  videogames: 'game',
};

export default function SearchModal({ isOpen, onClose, onSelect, category }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Robust category matching
  const getSearchCategory = (label: string): SearchCategory | null => {
    const clean = label.toLowerCase().trim();
    if (CATEGORY_MAP[clean]) return CATEGORY_MAP[clean];
    
    // Try singular version
    const singular = clean.replace(/s$/, '');
    if (CATEGORY_MAP[singular]) return CATEGORY_MAP[singular];

    // Try finding a keyword match
    for (const [key, value] of Object.entries(CATEGORY_MAP)) {
      if (clean.includes(key) || key.includes(clean)) return value;
    }

    return null;
  };

  const searchCategory = getSearchCategory(category);

  useEffect(() => {
    if (isOpen) {
      console.log('[SearchModal] Opening for category label:', category);
      console.log('[SearchModal] Resolved search category:', searchCategory || 'all (no specific map found)');
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setError('');
    }
  }, [isOpen, category, searchCategory]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      // If we don't have a specific category mapping, search all (empty categories param)
      const categoriesParam = searchCategory ? `&categories=${searchCategory}` : '';
      const url = `/api/search?q=${encodeURIComponent(query)}${categoriesParam}`;
      
      console.log('[SearchModal] Searching with URL:', url);
      
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'search failed');
      setResults(data.results || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'search failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    onSelect(result);
    // Note: FeaturedItem handles closing the modal after its async update
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-app-nav border border-app-border rounded-app shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
          >
            <div className="p-4 border-b border-app-border bg-zinc-50/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-bold text-app-font lowercase opacity-40 tracking-[0.2em] ml-1">
                  adding to {category.toLowerCase()}
                </h2>
                <button 
                  onClick={onClose}
                  className="text-app-font opacity-20 hover:opacity-100 transition-opacity p-1"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`search for ${category.toLowerCase()}...`}
                  className="flex-1 px-4 py-2 bg-white border border-app-border rounded-app text-sm focus:ring-2 focus:ring-app-accent outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-app-accent text-white rounded-app text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {loading ? '...' : 'go'}
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <FormMessage message={error} type="error" className="m-2" />

              <div className="space-y-1">
                {results.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-zinc-100 rounded-app transition-colors text-left group"
                  >
                    {item.imageUrl && (
                      <div className="relative w-12 h-16 flex-shrink-0 shadow-sm overflow-hidden rounded-sm">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] bg-zinc-200 px-1.5 py-0.5 rounded-sm lowercase opacity-60">
                          {item.category}
                        </span>
                        <h3 className="text-sm font-bold text-app-font truncate group-hover:text-app-accent transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-app-font opacity-60 truncate">
                          {item.subtitle}
                        </p>
                      )}
                      {item.year && (
                        <p className="text-[10px] text-app-font opacity-40">
                          {item.year}
                        </p>
                      )}
                    </div>
                  </button>
                ))}

                {!loading && results.length === 0 && query && (
                  <p className="text-sm text-app-font opacity-40 text-center py-8">
                    no results found for &quot;{query}&quot;
                  </p>
                )}

                {!query && (
                  <p className="text-sm text-app-font opacity-40 text-center py-8">
                    type something to start searching
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 bg-zinc-50 border-t border-app-border flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs text-app-font hover:opacity-60 transition-opacity lowercase font-medium"
              >
                close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
