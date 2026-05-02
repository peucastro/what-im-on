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
  users: { username: string };
  categories: { label: string; icon?: string };
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

  // Fetch user and current items
  const { data, error } = await supabase
    .from('items')
    .select(
      `
      id,
      title,
      description,
      image_url,
      users!inner(username),
      categories!inner(label, icon)
    `
    )
    .eq('users.username', username)
    .eq('is_current', true)
    .order('category_id');

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  if (!data || data.length === 0) {
    // User might exist but has no current items, or doesn't exist
    // Check if user exists
    const { data: userData } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (!userData) {
      return null;
    }

    // User exists but has no current items
    return {
      username,
      itemGroups: [],
    };
  }

  // Transform data and group by category
  const itemsByCategory: ItemGroup[] = [];
  (data as Item[]).forEach((item) => {
    const categoryLabel = item.categories.label;
    const existingCategory = itemsByCategory.find(
      (group) => group.category_label === categoryLabel
    );

    if (existingCategory) {
      existingCategory.items.push(item);
    } else {
      itemsByCategory.push({
        category_label: categoryLabel,
        category_icon: item.categories.icon,
        items: [item],
      });
    }
  });

  return {
    username: (data[0] as Item).users.username,
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
