import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { signOut } from '@/app/(main)/auth/actions';

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

export default async function Header() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let logoStyle = '';
  if (user) {
    const { data } = await supabase
      .from('user_preferences')
      .select('background_color')
      .eq('user_id', user.id)
      .single();

    const bgColor = data?.background_color || '#ffffff';
    logoStyle = isLightColor(bgColor) ? 'invert(0)' : 'invert(1)';
  }

  return (
    <nav className="w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={64}
            height={64}
            style={logoStyle ? { filter: logoStyle } : undefined}
          />
        </Link>

        {/* Auth Links */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/account"
                className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800"
              >
                account
              </Link>
              <form action={signOut}>
                <button type="submit" className="text-sm text-zinc-600 hover:text-black">
                  sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/register"
              className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800"
            >
              join
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
