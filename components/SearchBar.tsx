'use client';

import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import type { SearchResult } from '@/lib/search/types';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
  { value: 'book', label: 'Books' },
  { value: 'podcast', label: 'Podcasts' },
  { value: 'album', label: 'Albums' },
  { value: 'music', label: 'Music' },
  { value: 'game', label: 'Games' },
];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const url = `/api/search?q=${encodeURIComponent(query)}${
        selectedCategory !== 'all' ? `&categories=${selectedCategory}` : ''
      }`;
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

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-zinc-300 rounded-md text-sm lowercase"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search..."
          className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-sm lowercase"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded-md text-sm lowercase hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? 'searching...' : 'search'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-3">
        {results.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 border border-zinc-200 rounded-md"
          >
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={48}
                height={48}
                className="object-cover rounded"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-zinc-200 px-2 py-0.5 rounded lowercase">
                  {item.category}
                </span>
                <h3 className="text-sm font-medium lowercase">{item.title}</h3>
              </div>
              {item.subtitle && <p className="text-xs text-zinc-500 lowercase">{item.subtitle}</p>}
              {item.year && <p className="text-xs text-zinc-400">{item.year}</p>}
            </div>
          </div>
        ))}
        {!loading && results.length === 0 && query && (
          <p className="text-sm text-zinc-500 text-center">no results found</p>
        )}
      </div>
    </div>
  );
}
