import type { SearchResult, SearchCategory } from './types';

const ENTITY_MAP: Record<string, string> = {
  music: 'song',
  album: 'album',
  podcast: 'podcast',
};

interface iTunesItem {
  trackId?: number;
  collectionId?: number;
  trackName?: string;
  collectionName?: string;
  artistName?: string;
  artworkUrl100?: string;
  releaseDate?: string;
}

export async function searchiTunes(
  query: string,
  category: 'music' | 'album' | 'podcast'
): Promise<SearchResult[]> {
  const entity = ENTITY_MAP[category];
  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=${entity}&limit=20`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((item: iTunesItem) => ({
    id: `${category}_${item.trackId || item.collectionId}`,
    category: category as SearchCategory,
    title: item.trackName || item.collectionName,
    externalId: String(item.trackId || item.collectionId),
    subtitle: item.artistName,
    imageUrl: item.artworkUrl100?.replace('100x100bb', '200x200bb'),
    year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : undefined,
  }));
}
