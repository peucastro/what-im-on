import Link from 'next/link';
import Image from 'next/image';
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
      
      {/* Nav Bar */}
      <nav className="w-full border-b border-app-border bg-app-nav">
        <div className="mx-auto flex max-w-3xl items-center justify-between sm:px-6 px-4 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="logo"
              width={64}
              height={64}
              className="rounded-app"
            />
          </Link>

          {/* Auth Links */}
          <div className="flex items-center gap-4">
            {user ? (
              <UserDropdown username={username} />
            ) : (
              <Link
                href="/register"
                className="rounded-app bg-app-accent px-4 py-2 text-sm text-app-font hover:opacity-90 transition-opacity"
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
