'use client';

import { useState } from 'react';
import ItemCard from '@/components/ItemCard';
import ProfileHeader from '@/components/ProfileHeader';
import VibeButton from '@/components/VibeButton';
import ProfileThemeOverride from '@/components/ProfileThemeOverride';
import { UserPreferences } from '@/utils/themes';
import { ALL_CATEGORIES, type SearchCategory } from '@/lib/search/index';
import CategorySelectionModal from '@/components/CategorySelectionModal';
import SearchModal from '@/components/SearchModal';
import type { SearchResult } from '@/lib/search/types';

// Default preferences fallback
const DEFAULT_PREFERENCES: UserPreferences = {
  theme_id: 'default',
  border_radius: 'low',
  font_family: 'sans',
  pet_id: 'none',
};

interface ItemGroup {
  category_label: string;
  category_icon?: string;
  items: {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    category_id?: string;
  }[];
}

interface ProfileData {
  username: string;
  itemGroups: ItemGroup[];
  isOwner: boolean;
  preferences: Record<string, unknown> | null;
}

export default function ProfileClientWrapper({ profile }: { profile: ProfileData }) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Calculate missing categories with robust label mapping
  const normalizeLabel = (label: string) => {
    // Convert to lowercase and remove common plural 's'
    const normalized = label.toLowerCase().replace(/s$/, '');
    return normalized;
  };

  const labelToCategory: Record<string, SearchCategory> = {
    movie: 'movie',
    tv: 'tv',
    show: 'tv', // Handle 'TV Shows' -> 'show'
    book: 'book', // Handle 'Books' -> 'book'
    podcast: 'podcast',
    album: 'album',
    music: 'music',
    game: 'game',
  };

  const userCategoryLabels = profile.itemGroups.map((group) => {
    const normalized = normalizeLabel(group.category_label);
    const mapped = labelToCategory[normalized];

    // Fallback to 'movie' if category is unknown (with warning in development)
    if (!mapped && process.env.NODE_ENV === 'development') {
      console.warn(`Unknown category label: "${group.category_label}" -> "${normalized}"`);
    }

    return mapped || 'movie';
  });

  const missingCategories = ALL_CATEGORIES.filter(
    (category) => !userCategoryLabels.includes(category)
  );

  const handleAddSomething = () => {
    setIsCategoryModalOpen(true);
  };

  const handleSelectCategory = (category: SearchCategory) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(false);
    setIsSearchModalOpen(true);
  };

  const handleSelectSearchResult = (result: SearchResult) => {
    // TODO: Implement logic to add the selected item to user's profile
    console.log('Selected item to add:', result);
    setIsSearchModalOpen(false);
    // In production, you would call an API here to add the item
    // Then refresh the profile data
  };

  return (
    <div className="space-y-12 mb-24 w-full mx-auto md:max-w-sm">
      {!profile.isOwner && (
        <ProfileThemeOverride
          preferences={
            profile.preferences
              ? (profile.preferences as unknown as UserPreferences)
              : DEFAULT_PREFERENCES
          }
        />
      )}
      <div className="mt-8">
        <ProfileHeader
          username={profile.username}
          isOwner={profile.isOwner}
          preferences={
            profile.preferences
              ? (profile.preferences as unknown as UserPreferences)
              : DEFAULT_PREFERENCES
          }
        />
      </div>

      {profile.itemGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 text-center space-y-2 px-4">
          <div className="space-y-2">
            {!profile.isOwner && (
              <p className="text-app-font lowercase">no current interests yet</p>
            )}
            {profile.isOwner && (
              <p className="text-app-font lowercase">your profile is looking a bit empty...</p>
            )}
          </div>

          {profile.isOwner && (
            <VibeButton
              variant="outline"
              className="hover:opacity-100"
              onClick={handleAddSomething}
            >
              ➕ &nbsp; add something
            </VibeButton>
          )}
        </div>
      ) : profile.itemGroups.length === ALL_CATEGORIES.length ? (
        <div className="space-y-8 sm:px-6 px-0">
          {profile.itemGroups.map((group) => (
            <div key={group.category_label}>
              <div className="mb-4 flex items-center gap-2 px-4 sm:px-0">
                {group.category_icon && <span className="text-2xl">{group.category_icon}</span>}
                <h2 className="text-xl font-semibold text-app-font">{group.category_label}</h2>
              </div>
              <div className="border-b border-app-border pb-6">
                {group.items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-8 sm:px-6 px-0">
            {profile.itemGroups.map((group) => (
              <div key={group.category_label}>
                <div className="mb-4 flex items-center gap-2 px-4 sm:px-0">
                  {group.category_icon && <span className="text-2xl">{group.category_icon}</span>}
                  <h2 className="text-xl font-semibold text-app-font">{group.category_label}</h2>
                </div>
                <div className="border-b border-app-border pb-6">
                  {group.items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {profile.isOwner && (
            <div className="flex justify-center mt-6">
              <VibeButton
                variant="outline"
                className="hover:opacity-100"
                onClick={handleAddSomething}
              >
                ➕ &nbsp; add something
              </VibeButton>
            </div>
          )}
        </>
      )}

      {/* Category Selection Modal */}
      <CategorySelectionModal
        availableCategories={missingCategories}
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Search Modal */}
      {selectedCategory && (
        <SearchModal
          category={selectedCategory}
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onSelect={handleSelectSearchResult}
        />
      )}
    </div>
  );
}
