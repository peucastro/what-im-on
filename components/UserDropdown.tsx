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
        className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800 transition-colors lowercase flex items-center gap-1"
      >
        account
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl z-50 overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              <Link
                href={`/${username}`}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black transition-colors lowercase"
              >
                my profile
              </Link>
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black transition-colors lowercase"
              >
                edit profile
              </Link>
              <div className="h-px bg-zinc-100 my-1 mx-2" />
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full text-left rounded-xl px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors lowercase"
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
