'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const visibleRoutes = new Set(['/present', '/future', '/others']);
  const reservedRoutes = new Set(['/', '/login', '/register', '/onboarding', '/account', '/auth']);

  const isProfileRoute =
    /^\/[^/]+$/.test(pathname) && !reservedRoutes.has(pathname) && !visibleRoutes.has(pathname);
  const isVisible = visibleRoutes.has(pathname) || isProfileRoute;

  if (!isVisible) {
    return null;
  }

  const navItems = [
    { label: 'present', href: '/present' },
    { label: 'future', href: '/future' },
    { label: 'others', href: '/others' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 z-[60] w-fit -translate-x-1/2">
      <div className="flex gap-1 rounded-app border border-app-border bg-app-nav p-1 shadow-lg backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/present' && isProfileRoute);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-5 py-2 text-sm lowercase transition-colors border-app-border border rounded-app duration-300 ${
                isActive ? 'text-white' : 'text-app-font hover:opacity-70'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 z-0 bg-app-accent rounded-app"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
