import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ItemCard from '@/components/ItemCard';
import ProfileHeader from '@/components/ProfileHeader';

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

  // 1. Get user by username
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, username, display_name')
    .eq('username', username)
    .single();

  if (userError || !userData) {
    return null;
  }

  // 2. Get items with categories
  const { data: itemsData, error: itemsError } = await supabase
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
    .order('created_at', { ascending: false });

  if (itemsError) {
    console.error('Error fetching items:', itemsError);
    return null;
  }

  // Group items by category
  const groups: Record<string, ItemGroup> = {};

  itemsData.forEach((item: any) => {
    const categoryLabel = item.categories?.label || 'Other';
    const categoryIcon = item.categories?.icon;

    if (!groups[categoryLabel]) {
      groups[categoryLabel] = {
        category_label: categoryLabel,
        category_icon: categoryIcon,
        items: [],
      };
    }

    groups[categoryLabel].items.push({
      id: item.id,
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      category_id: item.category_id,
    });
  });

  const itemsByCategory = Object.values(groups);

  return {
    username: userData.display_name || userData.username,
    itemGroups: itemsByCategory,
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getUserProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="space-y-12 w-full mx-auto max-w-sm">
      <ProfileHeader username={profile.username} />

      {profile.itemGroups.length === 0 ? (
        <p className="text-zinc-600">no current interests yet</p>
      ) : (
        <div className="space-y-8">
          {profile.itemGroups.map((group: ItemGroup) => (
            <div key={group.category_label}>
              <div className="mb-4 flex items-center gap-2">
                {group.category_icon && <span className="text-2xl">{group.category_icon}</span>}
                <h2 className="text-xl font-semibold text-app-font">{group.category_label}</h2>
              </div>
              <div className="border-b border-app-border pb-6">
                {profile.itemGroups.length > 0 && group.items.map((item: Item) => (
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
