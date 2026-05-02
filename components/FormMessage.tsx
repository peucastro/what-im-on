'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface FormMessageProps {
  message: string | null;
  type?: 'error' | 'success' | 'default';
  className?: string;
}

export default function FormMessage({ message, type = 'default', className = '' }: FormMessageProps) {
  const colorClass = 
    type === 'error' ? 'text-red-500' : 
    type === 'success' ? 'text-emerald-500' : 
    'text-zinc-600';

  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.2 }}
          className={`text-sm text-center ${colorClass} ${className} overflow-hidden`}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
