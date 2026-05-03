'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface CategoryMenuProps {
  categoryLabel: string;
  categoryId: string;
  onEdit: () => void;
}

export default function CategoryMenu({ categoryLabel, categoryId, onEdit }: CategoryMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRemove = async () => {
    if (
      !confirm(`Are you sure you want to remove all items from ${categoryLabel.toLowerCase()}?`)
    ) {
      return;
    }

    setIsRemoving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('items')
        .update({ is_current: false, ended_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('category_id', categoryId)
        .eq('is_current', true);

      if (error) throw error;

      router.refresh();
    } catch (err) {
      console.error('Failed to remove category items:', err);
      alert('Failed to remove: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsRemoving(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-app-font opacity-20 hover:opacity-100 transition-opacity"
        aria-label="Category options"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="absolute right-0 mt-1 w-36 bg-app-nav border border-app-border rounded-app shadow-xl z-[70] overflow-hidden"
          >
            <div className="flex flex-col p-1">
              <button
                onClick={() => {
                  onEdit();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs text-app-font hover:bg-app-accent hover:text-white transition-colors rounded-app lowercase font-medium"
              >
                ✏️ &nbsp; edit
              </button>
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-app lowercase font-medium disabled:opacity-50"
              >
                🗑️ &nbsp; {isRemoving ? 'removing...' : 'remove'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
