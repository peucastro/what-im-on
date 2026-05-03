'use client';

import React from 'react';
import type { SearchCategory } from '@/lib/search/types';

interface CategorySelectionModalProps {
  availableCategories: SearchCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: SearchCategory) => void;
}

export default function CategorySelectionModal({
  availableCategories,
  isOpen,
  onClose,
  onSelectCategory,
}: CategorySelectionModalProps) {
  if (!isOpen) return null;

  // Category display names and icons
  const categoryData: Record<SearchCategory, { label: string; icon: string }> = {
    movie: { label: 'Movies', icon: '🎬' },
    tv: { label: 'TV Shows', icon: '📺' },
    book: { label: 'Books', icon: '📚' },
    podcast: { label: 'Podcasts', icon: '🎙️' },
    album: { label: 'Albums', icon: '💿' },
    music: { label: 'Music', icon: '🎵' },
    game: { label: 'Games', icon: '🎮' },
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-app border border-app-border bg-app-nav p-6 shadow-2xl relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-app-overlay" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-app-font lowercase">add to your profile</h2>
            <button
              onClick={onClose}
              className="text-app-font hover:opacity-70 transition-opacity text-xl"
              aria-label="Close modal"
            >
              x
            </button>
          </div>

          <p className="text-sm text-zinc-500 mb-4 lowercase">
            select a category to add your current obsession:
          </p>

          {availableCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500 lowercase">you have all categories!</p>
              <p className="text-sm text-zinc-400 mt-2">great job completing your profile 🎉</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {availableCategories.map((category) => {
                const { label, icon } = categoryData[category];

                return (
                  <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className="p-4 border border-app-border rounded-app hover:bg-zinc-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{icon}</span>
                      <span className="font-medium lowercase">{label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
