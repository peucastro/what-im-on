export type SearchCategory = 'movie' | 'tv' | 'book' | 'podcast' | 'album' | 'music' | 'game';

export interface SearchResult {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  year?: number;
  description?: string;
  externalId: string;
}
