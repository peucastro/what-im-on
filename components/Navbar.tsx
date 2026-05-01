import Link from 'next/link';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { signOut } from '@/app/auth/actions';

export default async function Navbar() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        {/* Logo / Home Link */}
        <Link href="/" className="text-xl font-bold tracking-tight text-black dark:text-white">
          what i&apos;m on
        </Link>

        {/* Auth State Links */}
        <div className="flex items-center gap-4 text-sm font-medium">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              >
                dashboard
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-full bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                join us
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
