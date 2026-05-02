import Link from 'next/link';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          ← back
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">account settings</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">manage your profile</p>
        </div>

        <div className="space-y-6 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">
              profile picture
            </label>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <button className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">
                change picture
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">name</label>
            <input
              type="text"
              defaultValue={user.user_metadata?.name || ''}
              className="mt-2 w-full rounded border border-zinc-200 bg-white px-3 py-2 text-sm text-black placeholder-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-600"
              placeholder="your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">email</label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="mt-2 w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
            />
          </div>

          {/* Save Button */}
          <button className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            save changes
          </button>
        </div>
      </div>
    </div>
  );
}
