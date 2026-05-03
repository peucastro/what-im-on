'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import SearchModal from './SearchModal';
import type { SearchResult } from '@/lib/search/types';

interface Item {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category_id?: string;
}

interface FeaturedItemProps {
  item: Item;
  categoryLabel: string;
  isOwner?: boolean;
  externalOpenSearch?: boolean;
  onSearchClose?: () => void;
}

export default function FeaturedItem({
  item,
  categoryLabel,
  isOwner,
  externalOpenSearch = false,
  onSearchClose,
}: FeaturedItemProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClient();

  // Sync internal modal state with external trigger in render phase to avoid lint errors
  const [prevExternalOpenSearch, setPrevExternalOpenSearch] = useState(externalOpenSearch);
  if (externalOpenSearch !== prevExternalOpenSearch) {
    setPrevExternalOpenSearch(externalOpenSearch);
    if (externalOpenSearch) {
      setIsModalOpen(true);
    }
  }

  const { title, description, image_url: imageUrl } = item;

  const label = categoryLabel.toLowerCase();

  // Aspect ratio based on category
  let aspectClass = 'aspect-square'; // Default 1:1
  if (
    label.includes('film') ||
    label.includes('movie') ||
    label.includes('book') ||
    label.includes('show')
  ) {
    aspectClass = 'aspect-[2/3]'; // Portrait for movies/books
  }

  const isPortrait = aspectClass !== 'aspect-square';

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onSearchClose) onSearchClose();
  };

  const handleSelectResult = async (result: SearchResult) => {
    if (!isOwner || !item.category_id) return;

    setIsUpdating(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('not authenticated');

      // 1. Archive previous current item for this category
      await supabase
        .from('items')
        .update({ is_current: false, ended_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('category_id', item.category_id)
        .eq('is_current', true);

      // 2. Insert new current item
      const { error } = await supabase.from('items').insert({
        user_id: user.id,
        category_id: item.category_id,
        title: result.title,
        description: result.subtitle || result.description,
        image_url: result.imageUrl,
        external_url: null,
        is_current: true,
      });

      if (error) throw error;

      handleCloseModal();
      router.refresh();
    } catch (err) {
      console.error('Failed to update featured item:', err);
      alert('Failed to update: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContainerClick = () => {
    if (isOwner && !isUpdating) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {/* The Shelf / Dock Effect */}
      <div
        onClick={handleContainerClick}
        className={`flex items-center justify-center gap-2 mb-4 w-full h-[120px] min-w-max px-4 ${isOwner ? 'cursor-pointer group/shelf' : ''}`}
      >
        {/* Extra Far Left - 50px */}
        {isPortrait && (
          <div
            className={`h-[50px] ${aspectClass} bg-app-accent opacity-[0.05] rounded-app flex-shrink-0 transition-transform duration-300 ${isOwner ? 'group-hover/shelf:-translate-x-1' : ''}`}
          />
        )}

        {/* Far Left - 65px */}
        <div
          className={`h-[65px] ${aspectClass} bg-app-accent opacity-20 rounded-app flex-shrink-0 transition-transform duration-300 ${isOwner ? 'group-hover/shelf:-translate-x-0.5' : ''}`}
        />

        {/* Mid Left - 75px */}
        <div
          className={`h-[75px] ${aspectClass} bg-app-accent opacity-40 rounded-app flex-shrink-0`}
        />

        {/* Main Featured Image - 100px */}
        <div
          className={`relative z-10 h-[100px] ${aspectClass} rounded-app overflow-hidden border-2 border-app-accent bg-app-nav flex-shrink-0 transition-all duration-300 ${isOwner ? 'group-hover/shelf:scale-105 group-hover/shelf:border-app-font' : ''}`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className={`object-cover transition-opacity duration-300 ${isUpdating ? 'opacity-40' : 'opacity-100'}`}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-app-font opacity-20 bg-app-accent/10">
              ?
            </div>
          )}

          {isOwner && (
            <div className="absolute inset-0 bg-black/0 group-hover/shelf:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover/shelf:opacity-100 transition-opacity text-white text-[10px] font-bold uppercase tracking-widest">
                {isUpdating ? '...' : 'change'}
              </span>
            </div>
          )}
        </div>

        {/* Mid Right - 75px */}
        <div
          className={`h-[75px] ${aspectClass} bg-app-accent opacity-40 rounded-app flex-shrink-0`}
        />

        {/* Far Right - 65px */}
        <div
          className={`h-[65px] ${aspectClass} bg-app-accent opacity-20 rounded-app flex-shrink-0 transition-transform duration-300 ${isOwner ? 'group-hover/shelf:translate-x-0.5' : ''}`}
        />

        {/* Extra Far Right - 50px */}
        {isPortrait && (
          <div
            className={`h-[50px] ${aspectClass} bg-app-accent opacity-[0.05] rounded-app flex-shrink-0 transition-transform duration-300 ${isOwner ? 'group-hover/shelf:translate-x-1' : ''}`}
          />
        )}
      </div>

      {/* Title and Author/Artist */}
      <div className="text-center px-4">
        <h3 className="text-lg font-bold text-app-font tracking-tight leading-tight">{title}</h3>
        {description && (
          <p className="text-xs text-app-font opacity-60 mt-1 font-medium">{description}</p>
        )}
      </div>

      {isOwner && (
        <SearchModal
          category={categoryLabel}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSelect={handleSelectResult}
        />
      )}
    </div>
  );
}
