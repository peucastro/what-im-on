'use client';

import React from 'react';

interface Item {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
}

interface FeaturedItemProps {
  item: Item;
  categoryLabel: string;
}

export default function FeaturedItem({ item, categoryLabel }: FeaturedItemProps) {
  const { title, description, image_url: imageUrl } = item;
  
  const label = categoryLabel.toLowerCase();
  
  // Aspect ratio based on category
  let aspectClass = 'aspect-square'; // Default 1:1
  if (label.includes('film') || label.includes('movie') || label.includes('book') || label.includes('show')) {
    aspectClass = 'aspect-[2/3]'; // Portrait for movies/books
  }

  const isPortrait = aspectClass !== 'aspect-square';

  return (
    <div className="flex flex-col items-center w-full py-6 overflow-hidden">
      {/* The Shelf / Dock Effect */}
      {/* min-w-max ensures the flex container stays wide enough for all items to be centered, 
          while overflow-hidden on the parent crops them if they exceed the screen width */}
      <div className="flex items-center justify-center gap-2 mb-4 w-full h-[120px] min-w-max px-4">
        {/* Extra Far Left - 50px (only for non-1:1) */}
        {isPortrait && (
          <div className={`h-[50px] ${aspectClass} bg-app-accent opacity-[0.05] rounded-app flex-shrink-0`} />
        )}

        {/* Far Left - 65px */}
        <div className={`h-[65px] ${aspectClass} bg-app-accent opacity-20 rounded-app flex-shrink-0`} />
        
        {/* Mid Left - 75px */}
        <div className={`h-[75px] ${aspectClass} bg-app-accent opacity-40 rounded-app flex-shrink-0`} />
        
        {/* Main Featured Image - 100px */}
        <div className={`relative z-10 h-[100px] ${aspectClass} shadow-2xl rounded-app overflow-hidden border-2 border-app-accent bg-app-nav flex-shrink-0`}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-app-font opacity-20 bg-app-accent/10">
              ?
            </div>
          )}
        </div>
        
        {/* Mid Right - 75px */}
        <div className={`h-[75px] ${aspectClass} bg-app-accent opacity-40 rounded-app flex-shrink-0`} />
        
        {/* Far Right - 65px */}
        <div className={`h-[65px] ${aspectClass} bg-app-accent opacity-20 rounded-app flex-shrink-0`} />

        {/* Extra Far Right - 50px (only for non-1:1) */}
        {isPortrait && (
          <div className={`h-[50px] ${aspectClass} bg-app-accent opacity-[0.05] rounded-app flex-shrink-0`} />
        )}
      </div>

      {/* Title and Author/Artist */}
      <div className="text-center px-4 mt-2">
        <h3 className="text-lg font-bold text-app-font lowercase tracking-tight leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-app-font opacity-60 lowercase mt-1 font-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
