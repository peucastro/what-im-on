import type { SearchResult } from './types';

export async function searchBooks(query: string): Promise<SearchResult[]> {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items || []).map((item: any) => ({
    id: `book_${item.id}`,
    category: 'book' as const,
    title: item.volumeInfo.title,
    externalId: item.id,
    subtitle: item.volumeInfo.authors?.join(', '),
    imageUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://'),
    year: item.volumeInfo.publishedDate
      ? new Date(item.volumeInfo.publishedDate).getFullYear()
      : undefined,
    description: item.volumeInfo.description,
  }));
}
