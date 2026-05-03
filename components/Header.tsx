import Link from 'next/link';
import Logo from './Logo';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import UserDropdown from './UserDropdown';

export default async function Header() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username = '';

  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('username')
      .eq('id', user.id)
      .single();
    username = userData?.username || '';
  }

  return (
    <header className="w-full">
      <nav className="m-2 border border-app-border bg-app-header bg-cover bg-center rounded-app">
        <div className="mx-auto flex max-w-3xl items-center justify-between sm:px-6 px-4">
          <Link
            href="/"
            className="flex items-center text-app-font hover:opacity-70 transition-opacity"
          >
            <Logo className="rounded-app" />
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <UserDropdown username={username} />
            ) : (
              <Link
                href="/register"
                className="rounded-app px-4 py-2 text-sm bg-gray-100 text-app-font hover:opacity-90 transition-opacity"
              >
                join
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
