'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from '@/app/(main)/auth/actions';

interface UserDropdownProps {
  username: string;
}

export default function UserDropdown({ username }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-sm text-app-font font-medium hover:opacity-70 transition-all lowercase flex items-center gap-2 py-2"
      >
        account
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          <svg
            width="8"
            height="5"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className="absolute right-0 mt-1 w-48 origin-top-right rounded-app border border-app-border bg-app-nav p-1.5 shadow-xl z-50 overflow-hidden"
          >
            <div className="flex flex-col gap-0.5">
              <Link
                href={`/${username}`}
                onClick={() => setIsOpen(false)}
                className="rounded-app px-3 py-2 text-sm text-app-font hover:bg-app-accent hover:text-white transition-colors lowercase font-app"
              >
                my profile
              </Link>
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="rounded-app px-3 py-2 text-sm text-app-font hover:bg-app-accent hover:text-white transition-colors lowercase font-app"
              >
                settings
              </Link>
              <div className="h-px bg-app-border my-1 mx-1 opacity-50" />
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full text-left rounded-app px-3 py-2 text-sm text-app-font hover:bg-red-500 hover:text-white transition-colors lowercase font-app"
                >
                  sign out
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
