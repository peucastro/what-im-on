import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import WhoIsIntoWhatYouAreOn from '@/components/WhoIsIntoWhatYouAreOn';
import FeaturedItem from '@/components/FeaturedItem';
import { getDefaultAvatarUrl } from '@/utils/avatar';

interface Recommendation {
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  score: number;
  shared_items: number;
  shared_item_titles: string[];
  shared_categories: number;
  matching_categories: string[];
}

export default async function OthersPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) {
    redirect('/login');
  }

  const { data: recommendations, error: recsError } = await supabase.rpc(
    'get_user_recommendations',
    {
      target_user_id: user.id,
    }
  );

  const { data: currentItems, error: itemsError } = await supabase
    .from('v_current_items')
    .select('category_slug, category_label')
    .eq('user_id', user.id);

  if (recsError) {
    console.error('Error fetching recommendations:', recsError);
  }

  if (itemsError) {
    console.error('Error fetching user items:', itemsError);
  }

  const recs = (recommendations as Recommendation[]) || [];

  const userCategories = Array.from(
    new Map(
      (currentItems || [])
        .filter(
          (item: { category_slug: string | null; category_label: string | null }) =>
            item.category_slug && item.category_label
        )
        .map((item: { category_slug: string; category_label: string }) => [
          item.category_slug as string,
          item.category_label as string,
        ])
    ).entries()
  ).map(([slug, label]) => ({ slug, label }));

  return (
    <div className="mx-auto w-full max-w-lg">
      <Navbar />

      <div className="p-4 space-y-12 pb-20">
        {recsError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-app border border-red-100">
            Failed to load recommendations. Please try again later.
          </div>
        ) : recs.length === 0 ? (
          <div className="p-8 text-center bg-app-nav rounded-app border border-app-border">
            <p className="text-app-font opacity-60">No recommendations found at the moment.</p>
            <p className="text-sm text-app-font opacity-40 mt-2">
              Try adding more current interests to your profile!
            </p>
          </div>
        ) : (
          <>
            <WhoIsIntoWhatYouAreOn recommendations={recs} />

            {userCategories.map((cat) => {
              const normalizedSlug =
                String(cat.slug).toLowerCase() === 'tv-show'
                  ? 'tv'
                  : String(cat.slug).toLowerCase();

              const categoryRecs = recs
                .filter((r) =>
                  (r.matching_categories || []).some((mc) => {
                    const normalizedMc = mc.toLowerCase() === 'tv-show' ? 'tv' : mc.toLowerCase();
                    return normalizedMc === normalizedSlug;
                  })
                )
                .sort((a, b) => b.score - a.score);

              if (categoryRecs.length === 0) return null;

              const uniqueCategoryUsers = Array.from(
                categoryRecs
                  .reduce((map, rec) => {
                    if (!map.has(rec.user_id)) {
                      map.set(rec.user_id, {
                        id: rec.username,
                        title: rec.display_name || rec.username,
                        description: `shares ${rec.shared_items} items with you`,
                        image_url:
                          rec.avatar_url || getDefaultAvatarUrl(rec.display_name || rec.username),
                      });
                    }
                    return map;
                  }, new Map<string, { id: string; title: string; description: string; image_url?: string }>())
                  .values()
              );

              return (
                <div key={String(cat.slug)} className="space-y-8">
                  <h2 className="text-xl font-bold lowercase text-app-font tracking-tight px-4">
                    similar <span className="text-app-font">{String(cat.label)}</span> taste
                  </h2>
                  <FeaturedItem
                    items={uniqueCategoryUsers}
                    categoryLabel={String(cat.label)}
                    isOwner={false}
                    forceSquare={true}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
