import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileThemeOverride from '@/components/ProfileThemeOverride';
import CategorySection from '@/components/CategorySection';
import AddCategory from '@/components/AddCategory';
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

interface Category {
  id: string;
  label: string;
  icon: string | null;
}

async function getUserProfile(username: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Get user by username first
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, username, display_name')
    .eq('username', username)
    .single();

  if (userError || !userData) {
    return null;
  }

  // 2. Parallelize data fetching
  const [itemsResult, preferencesResult, categoriesResult, authResult] = await Promise.all([
    supabase
      .from('items')
      .select(`
        id,
        title,
        description,
        image_url,
        category_id,
        categories (
          label,
          icon
        )
      `)
      .eq('user_id', userData.id)
      .eq('is_current', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('user_preferences')
      .select('theme_id, border_radius, font_family, pet_id, overlay_id')
      .eq('user_id', userData.id)
      .single(),
    supabase
      .from('categories')
      .select('id, label, icon')
      .order('label', { ascending: true }),
    supabase.auth.getUser(),
  ]);

  const authUser = authResult.data?.user;
  const isOwner = authUser?.id === userData.id;

  // Group items by category
  const groups: Record<string, ItemGroup> = {};

  interface RawItem {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    category_id: string;
    categories: {
      label: string;
      icon: string | null;
    } | null;
  }

  ((itemsResult.data as unknown as RawItem[]) || []).forEach((item) => {
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

  return {
    username: userData.display_name || userData.username,
    itemGroups: Object.values(groups),
    isOwner,
    preferences: preferencesResult.data,
    allCategories: (categoriesResult.data || []) as Category[],
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getUserProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="space-y-12 w-full mx-auto md:max-w-lg pb-24">
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

      <div className="space-y-4">
        {profile.itemGroups.map((group: ItemGroup) => (
          <CategorySection
            key={group.category_label}
            categoryLabel={group.category_label}
            items={group.items}
            isOwner={profile.isOwner}
          />
        ))}

        {profile.isOwner && (
          <AddCategory 
            categories={profile.allCategories} 
          />
        )}

        {!profile.isOwner && profile.itemGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-4 text-center space-y-2 px-4">
            <p className="text-app-font lowercase opacity-40">no current interests yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
