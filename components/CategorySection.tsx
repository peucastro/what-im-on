'use client';

import React, { useState } from 'react';
import CategoryMenu from './CategoryMenu';
import FeaturedItem from './FeaturedItem';
import ItemCard from './ItemCard';

interface Item {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category_id?: string;
}

interface CategorySectionProps {
  categoryLabel: string;
  items: Item[];
  isOwner?: boolean;
}

export default function CategorySection({ categoryLabel, items, isOwner }: CategorySectionProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const featuredItem = items[0];
  const remainingItems = items.slice(1);
  const categoryId = featuredItem?.category_id;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 sm:px-0">
        <h2 className="text-xl font-semibold text-app-font lowercase">
          {categoryLabel}
        </h2>
        {isOwner && categoryId && (
          <CategoryMenu 
            categoryLabel={categoryLabel} 
            categoryId={categoryId} 
            onEdit={() => setIsSearchOpen(true)}
          />
        )}
      </div>
      
      {featuredItem && (
        <FeaturedItem 
          item={featuredItem} 
          categoryLabel={categoryLabel} 
          isOwner={isOwner}
          externalOpenSearch={isSearchOpen}
          onSearchClose={() => setIsSearchOpen(false)}
        />
      )}

      <div className="border-b border-app-border pb-6">
        {remainingItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
