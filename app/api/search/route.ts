import { searchAll } from '@/lib/search';
import type { SearchCategory } from '@/lib/search/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const categoriesParam = searchParams.get('categories');

  if (!q) {
    return Response.json({ error: 'Missing q parameter' }, { status: 400 });
  }

  const categories = categoriesParam?.split(',').filter(Boolean) as SearchCategory[] | undefined;
  const results = await searchAll(q, categories);

  return Response.json({ results });
}
