import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ItemCard from '@/components/ItemCard';
import ProfileHeader from '@/components/ProfileHeader';
import VibeButton from '@/components/VibeButton';
import ProfileThemeOverride from '@/components/ProfileThemeOverride';
import { UserPreferences } from '@/utils/themes';

interface Item {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category_id?: string;
}

interface ItemGroup {
  category_label: string;
  category_icon?: string;
  items: Item[];
}

async function getUserProfile(username: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Get user by username first to know whose items to fetch
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, username, display_name')
    .eq('username', username)
    .single();

  if (userError || !userData) {
    return null;
  }

  // 2. Parallelize items fetch, preferences fetch, and current auth check
  const [itemsResult, preferencesResult, authResult] = await Promise.all([
    supabase
      .from('items')
      .select(
        `
        id,
        title,
        description,
        image_url,
        category_id,
        categories (
          label,
          icon
        )
      `
      )
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('user_preferences')
      .select('theme_id, border_radius, font_family, pet_id')
      .eq('user_id', userData.id)
      .single(),
    supabase.auth.getUser(),
  ]);

  const itemsData = itemsResult.data;
  const preferencesData = preferencesResult.data;
  const authUser = authResult.data?.user;
  const isOwner = authUser?.id === userData.id;

  if (itemsResult.error) {
    console.error('[ProfilePage] Error fetching items:', itemsResult.error);
    return null;
  }

  if (preferencesResult.error) {
    console.error('[ProfilePage] Error fetching preferences:', preferencesResult.error);
  }

  // Group items by category
  const groups: Record<string, ItemGroup> = {};

  interface RawItem {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    category_id: string;
    categories: {
      id: string;
      label: string;
      icon: string | null;
    } | null;
  }

  ((itemsData as unknown as RawItem[]) || []).forEach((item) => {
    const categoryLabel = item.categories?.label || 'Other';
    const categoryIcon = item.categories?.icon;

    if (!groups[categoryLabel]) {
      groups[categoryLabel] = {
        category_label: categoryLabel,
        category_icon: categoryIcon ?? undefined,
        items: [],
      };
    }

    groups[categoryLabel].items.push({
      id: item.id,
      title: item.title,
      description: item.description ?? undefined,
      image_url: item.image_url ?? undefined,
      category_id: item.category_id,
    });
  });

  const itemsByCategory = Object.values(groups);

  return {
    username: userData.display_name || userData.username,
    itemGroups: itemsByCategory,
    isOwner,
    preferences: preferencesData,
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getUserProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="space-y-12 w-full mx-auto md:max-w-sm">
      {!profile.isOwner && (
        <ProfileThemeOverride preferences={profile.preferences as UserPreferences} />
      )}
      <div className="mt-8">
        <ProfileHeader
          username={profile.username}
          isOwner={profile.isOwner}
          preferences={profile.preferences as UserPreferences}
        />
      </div>

      {profile.itemGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 text-center space-y-2 px-4">
          <div className="space-y-2">
            {!profile.isOwner && (
              <p className="text-app-font lowercase">no current interests yet</p>
            )}
            {profile.isOwner && (
              <p className="text-app-font lowercase">your profile is looking a bit empty...</p>
            )}
          </div>

          {profile.isOwner && (
            <VibeButton variant="outline" className="hover:opacity-100">
              ➕ &nbsp; add something
            </VibeButton>
          )}
        </div>
      ) : (
        <div className="space-y-8 sm:px-6 px-0">
          {profile.itemGroups.map((group: ItemGroup) => (
            <div key={group.category_label}>
              <div className="mb-4 flex items-center gap-2 px-4 sm:px-0">
                {group.category_icon && <span className="text-2xl">{group.category_icon}</span>}
                <h2 className="text-xl font-semibold text-app-font">{group.category_label}</h2>
              </div>
              <div className="border-b border-app-border pb-6">
                {group.items.map((item: Item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
