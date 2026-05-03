import type { SearchCategory, SearchResult } from './types';

const BASE_URL = 'https://www.omdbapi.com/';

type OmdbType = 'movie' | 'series';

interface OmdbSearchItem {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: OmdbType;
}

interface OmdbSearchResponse {
  Search?: OmdbSearchItem[];
  Response: 'True' | 'False';
  Error?: string;
}

export async function searchOMDb(query: string, type: OmdbType): Promise<SearchResult[]> {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    console.warn('[OMDb] Missing OMDB_API_KEY');
    return [];
  }

  try {
    const res = await fetch(
      `${BASE_URL}?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=${type}&r=json`
    );

    if (!res.ok) {
      console.warn(`[OMDb] Request failed with status ${res.status} for ${type}: ${query}`);
      return [];
    }

    const data = (await res.json()) as OmdbSearchResponse;
    if (data.Response !== 'True' || !data.Search) {
      return [];
    }

    return data.Search.map((item) => ({
      id: `${type}_${item.imdbID}`,
      category: (type === 'movie' ? 'movie' : 'tv') as SearchCategory,
      title: item.Title,
      externalId: item.imdbID,
      subtitle: item.Year,
      imageUrl: item.Poster && item.Poster !== 'N/A' ? item.Poster : undefined,
      year: item.Year ? Number.parseInt(item.Year, 10) : undefined,
    }));
  } catch (err) {
    console.error('[OMDb] Error:', err);
    return [];
  }
}
