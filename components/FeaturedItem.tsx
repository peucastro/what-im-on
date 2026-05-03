'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  item?: Item;
  items?: Item[];
  categoryLabel: string;
  isOwner?: boolean;
  externalOpenSearch?: boolean;
  onSearchClose?: () => void;
  href?: string;
  forceSquare?: boolean;
  className?: string;
}

export default function FeaturedItem({
  item,
  items,
  categoryLabel,
  isOwner,
  externalOpenSearch = false,
  onSearchClose,
  href,
  forceSquare = false,
  className = 'w-full',
}: FeaturedItemProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    items && items.length > 0 ? Math.floor(items.length / 2) : 0
  );
  const [prevExternalOpenSearch, setPrevExternalOpenSearch] = useState(externalOpenSearch);
  const supabase = createClient();

  const activeItem = items ? items[activeIndex] : item;

  // Sync internal modal state with external trigger in render phase to avoid lint errors
  if (externalOpenSearch !== prevExternalOpenSearch) {
    setPrevExternalOpenSearch(externalOpenSearch);
    if (externalOpenSearch) {
      setIsModalOpen(true);
    }
  }

  const handleScroll = useCallback(() => {
    if (!items || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;

    const itemsContainer = container.querySelector('.items-list-container') as HTMLDivElement;
    if (!itemsContainer) return;

    // Use getBoundingClientRect for more accurate positions
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    const itemElements = itemsContainer.children;
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < itemElements.length; i++) {
      const rect = itemElements[i].getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - itemCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  }, [items, activeIndex]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const listener = () => {
        // Use requestAnimationFrame for smoother updates and better sync
        requestAnimationFrame(handleScroll);
      };
      container.addEventListener('scroll', listener, { passive: true });
      return () => container.removeEventListener('scroll', listener);
    }
  }, [handleScroll]);

  // Center the middle item on mount if there are items
  useEffect(() => {
    if (items && items.length > 0 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const initialIndex = Math.floor(items.length / 2);

      const scrollToCenter = () => {
        const itemsContainer = container.querySelector('.items-list-container') as HTMLDivElement;
        if (itemsContainer && itemsContainer.children[initialIndex]) {
          const targetItem = itemsContainer.children[initialIndex] as HTMLElement;
          targetItem.scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
            inline: 'center',
          });
          setActiveIndex(initialIndex);
        }
      };

      // Try multiple times to ensure layout is ready
      const timer1 = setTimeout(scrollToCenter, 50);
      const timer2 = setTimeout(scrollToCenter, 150);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [items]);

  if (!activeItem) return null;

  const { title, description, image_url: imageUrl } = activeItem;

  const label = categoryLabel.toLowerCase();

  // Aspect ratio based on category
  let aspectClass = 'aspect-square'; // Default 1:1
  if (
    !forceSquare &&
    (label.includes('film') ||
      label.includes('movie') ||
      label.includes('book') ||
      label.includes('show'))
  ) {
    aspectClass = 'aspect-[2/3]'; // Portrait for movies/books
  }

  const isPortrait = aspectClass !== 'aspect-square';
  const halfWidth = isPortrait ? (100 * 2) / 3 / 2 : 50;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onSearchClose) onSearchClose();
  };

  const handleSelectResult = async (result: SearchResult) => {
    if (!isOwner || !activeItem.category_id) return;

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
        .eq('category_id', activeItem.category_id)
        .eq('is_current', true);

      // 2. Insert new current item
      const { error } = await supabase.from('items').insert({
        user_id: user.id,
        category_id: activeItem.category_id,
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

  const handleContainerClick = (e: React.MouseEvent) => {
    if (isOwner && !isUpdating) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const renderImage = (
    imgUrl?: string,
    imgTitle?: string,
    isLink?: boolean,
    customHref?: string,
    distance: number = 0
  ) => {
    let sizeClass = 'h-[100px]';
    let opacityClass = 'opacity-100';

    if (items) {
      if (distance === 0) {
        sizeClass = 'h-[100px]';
        opacityClass = 'opacity-100';
      } else if (distance === 1) {
        sizeClass = 'h-[75px]';
        opacityClass = 'opacity-40';
      } else if (distance === 2) {
        sizeClass = 'h-[65px]';
        opacityClass = 'opacity-20';
      } else if (distance >= 3) {
        sizeClass = 'h-[50px]';
        opacityClass = 'opacity-5';
      }
    }

    const imgContent = (
      <div
        className={`relative z-10 ${sizeClass} ${aspectClass} rounded-app overflow-hidden border-2 border-app-border bg-app-nav flex-shrink-0 transition-all duration-300 ${isOwner || isLink ? 'group-hover/shelf:scale-105 group-hover/shelf:border-app-font' : ''} ${opacityClass}`}
      >
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={imgTitle || ''}
            fill
            className={`object-cover transition-opacity duration-300 ${isUpdating ? 'opacity-40' : 'opacity-100'}`}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-app-font opacity-20 bg-app-secondary-accent/10">
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
    );

    if (isLink && customHref) {
      return (
        <Link
          href={customHref}
          key={customHref}
          className="flex-shrink-0 snap-center h-[100px] flex items-center"
        >
          {imgContent}
        </Link>
      );
    }

    return imgContent;
  };

  const content = (
    <div className={`flex flex-col items-center overflow-hidden ${className}`}>
      {/* The Shelf / Dock Effect */}
      <div
        ref={scrollContainerRef}
        onClick={handleContainerClick}
        className={`flex items-center gap-2 mb-4 w-full h-[120px] overflow-x-auto no-scrollbar snap-x snap-mandatory ${isOwner || href || items ? 'cursor-pointer group/shelf' : ''}`}
        style={
          items
            ? {
                paddingLeft: `calc(50% - ${halfWidth}px)`,
                paddingRight: `calc(50% - ${halfWidth}px)`,
              }
            : undefined
        }
      >
        {/* Decorative Padding Start (Only for single item) */}
        {!items && (
          <div
            className="flex-shrink-0 flex items-center justify-end gap-2"
            style={{ width: `calc(50% - ${halfWidth}px - 8px)` }}
          >
            {/* Extra Far Left - 50px */}
            {isPortrait && (
              <div
                className={`h-[50px] ${aspectClass} bg-app-secondary-accent border border-app-border opacity-[0.05] rounded-app flex-shrink-0 transition-transform duration-300 ${isOwner ? 'group-hover/shelf:-translate-x-1' : ''}`}
              />
            )}

            {/* Far Left - 65px */}
            <div
              className={`h-[65px] ${aspectClass} bg-app-secondary-accent border border-app-border opacity-20 rounded-app flex-shrink-0 transition-transform duration-300 ${isOwner ? 'group-hover/shelf:-translate-x-0.5' : ''}`}
            />

            {/* Mid Left - 75px */}
            <div
              className={`h-[75px] ${aspectClass} bg-app-secondary-accent border border-app-border opacity-40 rounded-app flex-shrink-0`}
            />
          </div>
        )}

        {/* Main Featured Image(s) */}
        {items ? (
          <div className="flex gap-2 items-center items-list-container">
            {items.map((it, idx) =>
              renderImage(
                it.image_url,
                it.title,
                true,
                it.id === it.title ? undefined : `/${it.id}`,
                Math.abs(idx - activeIndex)
              )
            )}
          </div>
        ) : (
          <div className="snap-center">{renderImage(imageUrl, title, !!href, href)}</div>
        )}

        {/* Decorative Padding End (Only for single item) */}
        {!items && (
          <div
            className="flex-shrink-0 flex items-center justify-start gap-2"
            style={{ width: `calc(50% - ${halfWidth}px - 8px)` }}
          >
            {/* Mid Right - 75px */}
            <div
              className={`h-[75px] ${aspectClass} bg-app-secondary-accent opacity-40 border border-app-border rounded-app flex-shrink-0`}
            />

            {/* Far Right - 65px */}
            <div
              className={`h-[65px] ${aspectClass} bg-app-secondary-accent opacity-20 border border-app-border rounded-app flex-shrink-0 transition-transform duration-300 ${isOwner ? 'group-hover/shelf:translate-x-0.5' : ''}`}
            />

            {/* Extra Far Right - 50px */}
            {isPortrait && (
              <div
                className={`h-[50px] ${aspectClass} bg-app-secondary-accent opacity-[0.05] rounded-app border border-app-border flex-shrink-0 transition-transform duration-300 ${isOwner ? 'group-hover/shelf:translate-x-1' : ''}`}
              />
            )}
          </div>
        )}
      </div>

      {/* Title and Author/Artist */}
      <div className="text-center px-4 min-h-[3rem]">
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

  return content;
}
