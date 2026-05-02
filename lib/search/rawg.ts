import type { SearchResult } from './types';

const BASE_URL = 'https://api.rawg.io/api';

interface RAWGGame {
  id: number;
  name: string;
  released?: string;
  background_image?: string;
}

export async function searchGames(query: string): Promise<SearchResult[]> {
  const res = await fetch(
    `${BASE_URL}/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=20`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((item: RAWGGame) => ({
    id: `game_${item.id}`,
    category: 'game' as const,
    title: item.name,
    externalId: String(item.id),
    subtitle: item.released?.split('-')[0],
    imageUrl: item.background_image,
    year: item.released ? new Date(item.released).getFullYear() : undefined,
  }));
}
