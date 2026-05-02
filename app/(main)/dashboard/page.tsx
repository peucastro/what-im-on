import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { signOut } from '@/app/(main)/auth/actions';
import Image from 'next/image';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Image
        src={
          profile?.avatar_url ||
          `https://ui-avatars.com/api/?name=${user.email}&background=random&color=fff`
        }
        alt="Avatar"
        width={64}
        height={64}
        className="rounded-full object-cover"
        unoptimized
      />
      <p>Hello {profile?.display_name || user.email}</p>
      <p>Username: {profile?.username}</p>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
