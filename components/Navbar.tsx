'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;

    return `flex-1 rounded-xl border-2 py-3 text-center transition-all ${
      isActive
        ? 'bg-zinc-100 text-black font-bold border-zinc-300'
        : 'bg-transparent text-black border-zinc-300 hover:text-zinc-800'
    }`;
  };

  return (
    <nav className="mx-auto w-full max-w-3xl p-4">
      <div className="flex gap-3 rounded-2xl border-2 p-3 bg-white">
        <Link href="/present" className={getLinkStyle('/present')}>
          present
        </Link>

        <Link href="/future" className={getLinkStyle('/future')}>
          future
        </Link>

        <Link href="/others" className={getLinkStyle('/others')}>
          others
        </Link>
      </div>
    </nav>
  );
}
