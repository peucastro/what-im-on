'use client';

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex gap-2 w-full justify-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index + 1 <= currentStep;
        return (
          <div
            key={index}
            className="h-1 flex-1 max-w-[40px] bg-zinc-100 rounded-full overflow-hidden relative"
          >
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ x: '-100%' }}
              animate={{ x: isActive ? '0%' : '-100%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        );
      })}
    </div>
  );
}
