import type { SearchCategory, SearchResult } from './types';
import { searchTMDB } from './tmdb';
import { searchBooks } from './google-books';
import { searchiTunes } from './itunes';
import { searchGames } from './rawg';

export const ALL_CATEGORIES: SearchCategory[] = [
  'movie',
  'tv',
  'book',
  'music',
  'album',
  'podcast',
  'game',
];

export async function searchAll(
  query: string,
  categories?: SearchCategory[]
): Promise<SearchResult[]> {
  const cats = categories?.length ? categories : ALL_CATEGORIES;
  const promises: Promise<SearchResult[]>[] = [];

  if (cats.includes('movie')) promises.push(searchTMDB(query, 'movie'));
  if (cats.includes('tv')) promises.push(searchTMDB(query, 'tv'));
  if (cats.includes('book')) promises.push(searchBooks(query));
  if (cats.includes('music')) promises.push(searchiTunes(query, 'music'));
  if (cats.includes('album')) promises.push(searchiTunes(query, 'album'));
  if (cats.includes('podcast')) promises.push(searchiTunes(query, 'podcast'));
  if (cats.includes('game')) promises.push(searchGames(query));

  const results = await Promise.all(promises);
  return results.flat();
}
