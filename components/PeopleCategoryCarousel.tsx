'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Recommendation {
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  score: number;
  shared_items: number;
  shared_item_titles: string[];
  shared_categories: number;
  matching_categories: string[];
}

interface PeopleCategoryCarouselProps {
  title: string;
  recommendations: Recommendation[];
}

export default function PeopleCategoryCarousel({
  title,
  recommendations,
}: PeopleCategoryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(recommendations.length / 2));

  if (recommendations.length === 0) return null;

  const getStyles = (distance: number) => {
    if (distance === 0)
      return 'w-[120px] h-[120px] md:w-[150px] md:h-[150px] opacity-100 z-30 scale-110 shadow-xl';
    if (distance === 1) return 'w-[100px] h-[100px] md:w-[120px] md:h-[120px] opacity-70 z-20';
    if (distance === 2) return 'w-[80px] h-[80px] md:w-[100px] md:h-[100px] opacity-40 z-10';
    if (distance === 3) return 'w-[60px] h-[60px] md:w-[80px] md:h-[80px] opacity-20 z-0';
    return 'w-0 h-0 opacity-0 pointer-events-none hidden';
  };

  const activeRec = recommendations[activeIndex];

  return (
    <div className="w-full py-8">
      <h2 className="text-xl font-bold mb-8 lowercase text-app-font tracking-tight">
        similar <span className="text-app-font">{title}</span> taste
      </h2>

      <div className="relative flex items-center justify-center">
        <div className="flex items-center justify-center gap-2 md:gap-4 h-[180px] w-full">
          {recommendations.map((rec, index) => {
            const distance = Math.abs(index - activeIndex);
            return (
              <div
                key={rec.user_id}
                onClick={() => setActiveIndex(index)}
                className={`${getStyles(distance)} bg-app-nav rounded-app shrink-0 cursor-pointer overflow-hidden relative transition-all duration-500 ease-in-out border border-app-border`}
              >
                {rec.avatar_url ? (
                  <Image
                    src={rec.avatar_url}
                    alt={rec.username}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-app-border">
                    <span className="text-2xl font-bold text-app-font opacity-30">
                      {rec.display_name
                        ? rec.display_name[0].toUpperCase()
                        : rec.username[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            );
          })}
        </div>
      </div>

      {activeRec && (
        <div className="text-center mt-6 h-16">
          <Link href={`/${activeRec.username}`} className="hover:underline">
            <p className="text-lg font-bold text-app-font leading-tight">
              {activeRec.display_name || activeRec.username}
            </p>
          </Link>
          <p className="text-sm text-app-font opacity-60">@{activeRec.username}</p>
          <p className="text-xs text-app-font opacity-40 italic mt-1">
            shares {activeRec.shared_items} items with you
          </p>
        </div>
      )}
    </div>
  );
}
