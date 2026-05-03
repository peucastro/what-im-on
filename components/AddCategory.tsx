'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VibeButton from './VibeButton';
import SearchModal from './SearchModal';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { SearchResult } from '@/lib/search/types';

interface Category {
  id: string;
  label: string;
  icon: string | null;
}

interface AddCategoryProps {
  categories: Category[];
}

export default function AddCategory({ categories }: AddCategoryProps) {
  const [isSelectingCategory, setIsSelectingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsSelectingCategory(false);
  };

  const handleSearchSelect = async (result: SearchResult) => {
    if (!selectedCategory) return;

    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('not authenticated');

      // 1. Archive previous current items for this category (if any)
      await supabase
        .from('items')
        .update({ is_current: false, ended_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('category_id', selectedCategory.id)
        .eq('is_current', true);

      // 2. Insert new current item
      const { error } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          category_id: selectedCategory.id,
          title: result.title,
          description: result.subtitle || result.description,
          image_url: result.imageUrl,
          is_current: true,
        });

      if (error) throw error;

      setSelectedCategory(null);
      router.refresh();
    } catch (err) {
      console.error('Failed to add category item:', err);
      alert('Failed to add: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {!isSelectingCategory && !selectedCategory && (
        <VibeButton 
          variant="outline" 
          onClick={() => setIsSelectingCategory(true)}
          className="hover:opacity-100 px-6 py-3"
        >
          ➕ &nbsp; add category
        </VibeButton>
      )}

      <AnimatePresence>
        {isSelectingCategory && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-xs grid grid-cols-2 gap-2 p-4 bg-app-nav border border-app-border rounded-app shadow-sm"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className="px-3 py-2 text-xs font-medium text-app-font border border-app-border rounded-app hover:bg-app-accent hover:text-white transition-colors lowercase truncate"
              >
                {cat.icon && <span className="mr-1">{cat.icon}</span>}
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => setIsSelectingCategory(false)}
              className="col-span-2 mt-2 py-2 text-[10px] uppercase font-bold tracking-widest text-app-font opacity-40 hover:opacity-100"
            >
              cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedCategory && (
        <SearchModal
          isOpen={!!selectedCategory}
          category={selectedCategory.label}
          onClose={() => setSelectedCategory(null)}
          onSelect={handleSearchSelect}
        />
      )}

      {isUpdating && (
        <div className="fixed inset-0 z-[110] bg-white/40 backdrop-blur-sm flex items-center justify-center">
          <div className="text-app-font font-bold animate-pulse lowercase">adding...</div>
        </div>
      )}
    </div>
  );
}
