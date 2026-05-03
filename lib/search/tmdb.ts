import type { SearchResult, SearchCategory } from './types';

const BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
  overview?: string;
}

export async function searchTMDB(query: string, category: 'movie' | 'tv'): Promise<SearchResult[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return [];
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search/${category}?api_key=${apiKey}&query=${encodeURIComponent(query)}`
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return (data.results || []).map((item: TMDBItem) => ({
      id: `${category}_${item.id}`,
      category: category as SearchCategory,
      title: category === 'movie' ? item.title : item.name,
      externalId: String(item.id),
      subtitle:
        category === 'movie'
          ? item.release_date?.split('-')[0]
          : item.first_air_date?.split('-')[0],
      imageUrl: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : undefined,
      year: item.release_date ? new Date(item.release_date).getFullYear() : undefined,
      description: item.overview,
    }));
  } catch (err) {
    console.error('[TMDB] Error:', err);
    return [];
  }
}
