import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function PresentPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('username')
    .eq('id', user.id)
    .single();

  if (!userData?.username) {
    redirect('/onboarding');
  }

  redirect(`/${encodeURIComponent(userData.username)}`);
}
