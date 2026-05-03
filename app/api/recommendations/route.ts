import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { searchOMDb } from '@/lib/search/omdb';
import { searchiTunes } from '@/lib/search/itunes';
import { searchGames } from '@/lib/search/rawg';
import { searchBooks } from '@/lib/search/openlibrary';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ─── Image fetchers per category ─────────────────────────────────────────────

async function getImageUrl(
  title: string,
  category: string,
  subtitle?: string
): Promise<string | undefined> {
  try {
    // Don't include subtitle in query for better results
    const query = title;
    console.log(`[ImageFetch] Searching ${category}: "${query}"`);
    
    switch (category) {
      case 'movie': {
        const results = await searchOMDb(query, 'movie');
        const imageUrl = results[0]?.imageUrl;
        console.log(`[ImageFetch] OMDb movie results: ${results.length}, has image: ${!!imageUrl}`);
        return imageUrl;
      }
      case 'tv-show': {
        const results = await searchOMDb(query, 'series');
        const imageUrl = results[0]?.imageUrl;
        console.log(`[ImageFetch] OMDb series results: ${results.length}, has image: ${!!imageUrl}`);
        return imageUrl;
      }
      case 'music': {
        const results = await searchiTunes(query, 'music');
        return results[0]?.imageUrl;
      }
      case 'album': {
        const results = await searchiTunes(query, 'album');
        return results[0]?.imageUrl;
      }
      case 'podcast': {
        const results = await searchiTunes(query, 'podcast');
        return results[0]?.imageUrl;
      }
      case 'game': {
        const results = await searchGames(query);
        return results[0]?.imageUrl;
      }
      case 'book': {
        const results = await searchBooks(query);
        return results[0]?.imageUrl;
      }
      default:
        return undefined;
    }
  } catch (err) {
    console.error(`[ImageFetch] Error fetching image for ${title}:`, err);
    return undefined;
  }
}

async function enrichWithImages<T extends { title: string; [key: string]: string }>(
  items: T[],
  category: string,
  subtitleKey?: keyof T
): Promise<(T & { imageUrl?: string })[]> {
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      imageUrl: await getImageUrl(
        item.title,
        category,
        subtitleKey ? item[subtitleKey] : undefined
      ),
    }))
  );
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: currentItems, error: dbError } = await supabase
      .from('v_current_items')
      .select('title, description, category_slug, category_label')
      .eq('user_id', user.id);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    if (!currentItems || currentItems.length === 0) {
      return NextResponse.json({
        recommendations: {
          songs: [],
          books: [],
          movies: [],
          tv_shows: [],
          games: [],
          podcasts: [],
          albums: [],
        },
      });
    }

    const interestsSummary = currentItems
      .map(
        (item) =>
          `${item.category_label}: ${item.title}${item.description ? ` — ${item.description}` : ''}`
      )
      .join('\n');

    const userSlugs = new Set(currentItems.map((i) => i.category_slug));

    // ── Groq ──────────────────────────────────────────────────────────────────
    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1500,
        messages: [
          {
            role: 'system',
            content: `You are a recommendation engine. Based on a user's current interests, suggest 7 items for each category that appears in their interests.
Only include categories the user actually has — do not invent new ones.
Always respond with ONLY valid JSON, no explanation, no markdown, no backticks.
Use this exact structure (only include the keys relevant to the user's categories):
{
  "songs": [{ "title": "", "artist": "", "year": "" }],
  "books": [{ "title": "", "author": "", "year": "" }],
  "movies": [{ "title": "", "director": "", "year": "" }],
  "tv_shows": [{ "title": "", "network": "", "year": "" }],
  "games": [{ "title": "", "studio": "", "year": "" }],
  "podcasts": [{ "title": "", "host": "", "year": "" }],
  "albums": [{ "title": "", "artist": "", "year": "" }]
}`,
          },
          {
            role: 'user',
            content: `Here is what I'm currently into:\n${interestsSummary}\n\nOnly recommend categories I have above. Recommend things I would love.`,
          },
        ],
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      return NextResponse.json({ error: `Groq error: ${err}` }, { status: 500 });
    }

    const groqData = await groqRes.json();
    const raw = groqData.choices?.[0]?.message?.content ?? '{}';

    let recommendations;
    try {
      recommendations = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    // ── Enrich with real images in parallel ───────────────────────────────────
    console.log('[Recommendations] Enriching with images for categories:', Array.from(userSlugs));
    const [songs, books, movies, tv_shows, games, podcasts, albums] = await Promise.all([
      userSlugs.has('music')
        ? enrichWithImages(recommendations.songs ?? [], 'music', 'artist')
        : [],
      userSlugs.has('book') ? enrichWithImages(recommendations.books ?? [], 'book', 'author') : [],
      userSlugs.has('movie')
        ? enrichWithImages(recommendations.movies ?? [], 'movie', 'director')
        : [],
      userSlugs.has('tv-show')
        ? enrichWithImages(recommendations.tv_shows ?? [], 'tv-show', 'network')
        : [],
      userSlugs.has('game') ? enrichWithImages(recommendations.games ?? [], 'game', 'studio') : [],
      userSlugs.has('podcast')
        ? enrichWithImages(recommendations.podcasts ?? [], 'podcast', 'host')
        : [],
      userSlugs.has('album')
        ? enrichWithImages(recommendations.albums ?? [], 'album', 'artist')
        : [],
    ]);

    console.log('[Recommendations] Movies enriched:', movies.slice(0, 2));
    console.log('[Recommendations] TV shows enriched:', tv_shows.slice(0, 2));

    const enriched = { songs, books, movies, tv_shows, games, podcasts, albums };

    // ── Persist to DB ─────────────────────────────────────────────────────────
    const { data: categories } = await supabase
      .from('categories')
      .select('id, slug')
      .in('slug', ['music', 'book', 'movie', 'tv-show', 'game', 'podcast', 'album']);

    const categoryMap = Object.fromEntries(
      (categories ?? []).map((c: { id: string; slug: string }) => [c.slug, c.id])
    );

    const toInsert = [
      ...songs.map((s) => ({
        user_id: user.id,
        category_id: categoryMap['music'],
        title: s.title,
        image_url: s.imageUrl,
        reason: `By ${s.artist}`,
      })),
      ...books.map((b) => ({
        user_id: user.id,
        category_id: categoryMap['book'],
        title: b.title,
        image_url: b.imageUrl,
        reason: `By ${b.author}`,
      })),
      ...movies.map((m) => ({
        user_id: user.id,
        category_id: categoryMap['movie'],
        title: m.title,
        image_url: m.imageUrl,
        reason: `Directed by ${m.director}`,
      })),
      ...tv_shows.map((t) => ({
        user_id: user.id,
        category_id: categoryMap['tv-show'],
        title: t.title,
        image_url: t.imageUrl,
        reason: `${t.network} — ${t.year}`,
      })),
      ...games.map((g) => ({
        user_id: user.id,
        category_id: categoryMap['game'],
        title: g.title,
        image_url: g.imageUrl,
        reason: `By ${g.studio}`,
      })),
      ...podcasts.map((p) => ({
        user_id: user.id,
        category_id: categoryMap['podcast'],
        title: p.title,
        image_url: p.imageUrl,
        reason: `Hosted by ${p.host}`,
      })),
      ...albums.map((a) => ({
        user_id: user.id,
        category_id: categoryMap['album'],
        title: a.title,
        image_url: a.imageUrl,
        reason: `By ${a.artist}`,
      })),
    ].filter((r) => r.category_id);

    if (toInsert.length > 0) {
      await supabase
        .from('recommendations')
        .update({ dismissed: true })
        .eq('user_id', user.id)
        .eq('dismissed', false);

      await supabase.from('recommendations').insert(toInsert);
    }

    return NextResponse.json({ recommendations: enriched });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
