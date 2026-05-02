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

interface ProfileData {
  username: string;
  itemGroups: ItemGroup[];
}

async function getUserProfile(username: string): Promise<ProfileData | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // First get user info including display_name
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, username, display_name')
    .eq('username', username)
    .single();

  if (userError || !userData) {
    return null;
  }

  // Get current items
  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select(
      `
      id,
      title,
      description,
      image_url,
      category_id
    `
    )
    .eq('user_id', userData.id)
    .eq('is_current', true)
    .order('category_id');

  // Get all categories for lookup
  const { data: allCategories } = await supabase.from('categories').select('id, label, icon');

  if (itemsError) {
    console.error('Error fetching items:', itemsError);
    return { username: userData.display_name || userData.username, itemGroups: [] };
  }

  if (!items || items.length === 0) {
    return {
      username: userData.display_name || userData.username,
      itemGroups: [],
    };
  }

  // Transform data and group by category
  const itemsByCategory: ItemGroup[] = [];
  const categoryMap = new Map(allCategories?.map((c) => [c.id, c]) || []);

  items?.forEach((item) => {
    const category = categoryMap.get(item.category_id);
    const categoryLabel = category?.label || 'Other';
    const categoryIcon = category?.icon;
    const existingCategory = itemsByCategory.find(
      (group) => group.category_label === categoryLabel
    );

    if (existingCategory) {
      existingCategory.items.push({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
      });
    } else {
      itemsByCategory.push({
        category_label: categoryLabel,
        category_icon: categoryIcon,
        items: [
          {
            id: item.id,
            title: item.title,
            description: item.description,
            image_url: item.image_url,
          },
        ],
      });
    }
  });

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
    <div className="space-y-12">
      <ProfileHeader username={profile.username} />

      {profile.itemGroups.length === 0 ? (
        <p className="text-zinc-600">no current interests yet</p>
      ) : (
        <div className="space-y-8">
          {profile.itemGroups.map((group: ItemGroup) => (
            <div key={group.category_label}>
              <div className="mb-4 flex items-center gap-2">
                {group.category_icon && <span className="text-2xl">{group.category_icon}</span>}
                <h2 className="text-xl font-semibold text-black">{group.category_label}</h2>
              </div>
              <div className="border-b border-zinc-200 pb-6">
                {group.items.map((item: Item) => (
                  <ItemCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.image_url}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
