import type { SearchResult } from './types';

interface OpenLibraryItem {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_id?: number;
  cover_edition_key?: string;
  isbn?: string[];
}

export async function searchBooks(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
    );
    if (!res.ok) return [];

    const data = await res.json();
    const normalizedQuery = query.toLowerCase().trim();

    return (data.docs || [])
      .map((item: OpenLibraryItem) => {
        const imageUrl = item.cover_id
          ? `https://covers.openlibrary.org/b/id/${item.cover_id}-M.jpg`
          : item.cover_edition_key
            ? `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`
            : item.isbn?.[0]
              ? `https://covers.openlibrary.org/b/isbn/${item.isbn[0]}-M.jpg`
              : undefined;

        return {
          id: `book_${item.key}`,
          category: 'book' as const,
          title: item.title,
          externalId: item.key,
          subtitle: item.author_name?.join(', '),
          imageUrl,
          year: item.first_publish_year,
        };
      })
      .sort((left: SearchResult, right: SearchResult) => {
        const leftTitle = left.title.toLowerCase();
        const rightTitle = right.title.toLowerCase();

        const leftExact = leftTitle === normalizedQuery ? 1 : 0;
        const rightExact = rightTitle === normalizedQuery ? 1 : 0;

        if (leftExact !== rightExact) return rightExact - leftExact;

        const leftHasAuthor = left.subtitle ? 1 : 0;
        const rightHasAuthor = right.subtitle ? 1 : 0;
        if (leftHasAuthor !== rightHasAuthor) return rightHasAuthor - leftHasAuthor;

        return (right.imageUrl ? 1 : 0) - (left.imageUrl ? 1 : 0);
      })
      .filter((item: SearchResult) => Boolean(item.imageUrl))
      .slice(0, 7);
  } catch {
    return [];
  }
}
