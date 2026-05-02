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
        <Link href="/" className="text-sm text-zinc-600 hover:text-black">
          ← back
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-black">account settings</h1>
          <p className="mt-2 text-sm text-zinc-600">manage your profile</p>
        </div>

        <div className="space-y-6 border-t border-zinc-200 pt-8">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-black">profile picture</label>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-zinc-200" />
              <button className="text-sm text-zinc-600 hover:text-black">change picture</button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-black">name</label>
            <input
              type="text"
              defaultValue={user.user_metadata?.name || ''}
              className="mt-2 w-full rounded border border-zinc-200 bg-white px-3 py-2 text-sm text-black placeholder-zinc-400"
              placeholder="your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black">email</label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="mt-2 w-full rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600"
            />
          </div>

          {/* Save Button */}
          <button className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800">
            save changes
          </button>
        </div>
      </div>
    </div>
  );
}
