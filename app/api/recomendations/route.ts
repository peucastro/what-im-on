import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies, headers } from 'next/headers';


const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch current items via v_current_items view
    const { data: currentItems, error: dbError } = await supabase
      .from("v_current_items")
      .select("title, description, category_slug, category_label")
      .eq("user_id", user.id);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    if (!currentItems || currentItems.length === 0) {
      return NextResponse.json({
        recommendations: { songs: [], books: [], movies: [], tv_shows: [], games: [], podcasts: [] },
      });
    }

    const interestsSummary = currentItems
      .map(
        (item) =>
          `${item.category_label}: ${item.title}${item.description ? ` — ${item.description}` : ""}`
      )
      .join("\n");

    // Build the list of category slugs the user actually has
    const userSlugs = new Set(currentItems.map((i) => i.category_slug));

    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1500,
        messages: [
          {
            role: "system",
            content: `You are a recommendation engine. Based on a user's current interests, suggest 5 items for each category that appears in their interests.
Only include categories the user actually has — do not invent new ones.
Always respond with ONLY valid JSON, no explanation, no markdown, no backticks.
Use this exact structure (only include the keys relevant to the user's categories):
{
  "songs": [{ "title": "", "artist": "", "year": "" }],
  "books": [{ "title": "", "author": "", "year": "" }],
  "movies": [{ "title": "", "director": "", "year": "" }],
  "tv_shows": [{ "title": "", "network": "", "year": "" }],
  "games": [{ "title": "", "studio": "", "year": "" }],
  "podcasts": [{ "title": "", "host": "", "year": "" }]
}`,
          },
          {
            role: "user",
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
    const raw = groqData.choices?.[0]?.message?.content ?? "{}";

    let recommendations;
    try {
      recommendations = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Fetch category IDs for all supported slugs
    const { data: categories } = await supabase
      .from("categories")
      .select("id, slug")
      .in("slug", ["music", "book", "movie", "tv-show", "game", "podcast"]);

    const categoryMap = Object.fromEntries(
      (categories ?? []).map((c: { id: string; slug: string }) => [c.slug, c.id])
    );

    const toInsert = [
      ...(userSlugs.has("music") ? (recommendations.songs ?? []).map((s: { title: string; artist: string; year: string }) => ({
        user_id: user.id,
        category_id: categoryMap["music"],
        title: s.title,
        reason: `By ${s.artist}`,
      })) : []),
      ...(userSlugs.has("book") ? (recommendations.books ?? []).map((b: { title: string; author: string; year: string }) => ({
        user_id: user.id,
        category_id: categoryMap["book"],
        title: b.title,
        reason: `By ${b.author}`,
      })) : []),
      ...(userSlugs.has("movie") ? (recommendations.movies ?? []).map((m: { title: string; director: string; year: string }) => ({
        user_id: user.id,
        category_id: categoryMap["movie"],
        title: m.title,
        reason: `Directed by ${m.director}`,
      })) : []),
      ...(userSlugs.has("tv-show") ? (recommendations.tv_shows ?? []).map((t: { title: string; network: string; year: string }) => ({
        user_id: user.id,
        category_id: categoryMap["tv-show"],
        title: t.title,
        reason: `${t.network} — ${t.year}`,
      })) : []),
      ...(userSlugs.has("game") ? (recommendations.games ?? []).map((g: { title: string; studio: string; year: string }) => ({
        user_id: user.id,
        category_id: categoryMap["game"],
        title: g.title,
        reason: `By ${g.studio}`,
      })) : []),
      ...(userSlugs.has("podcast") ? (recommendations.podcasts ?? []).map((p: { title: string; host: string; year: string }) => ({
        user_id: user.id,
        category_id: categoryMap["podcast"],
        title: p.title,
        reason: `Hosted by ${p.host}`,
      })) : []),
    ].filter((r: { category_id?: string }) => r.category_id);

    if (toInsert.length > 0) {
      await supabase
        .from("recommendations")
        .update({ dismissed: true })
        .eq("user_id", user.id)
        .eq("dismissed", false);

      await supabase.from("recommendations").insert(toInsert);
    }

    return NextResponse.json({ recommendations });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}