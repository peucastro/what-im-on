'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

interface OnboardingButtonProps {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function OnboardingButton({
  isLoading,
  isSuccess,
  isError,
  onClick,
  children = 'next step',
  disabled = false,
  className = '',
}: OnboardingButtonProps) {
  const getButtonState = (): ButtonState => {
    if (isError) return 'error';
    if (isSuccess) return 'success';
    if (isLoading) return 'loading';
    return 'idle';
  };

  const state = getButtonState();
  const isButtonDisabled = disabled || isLoading || isSuccess;

  const baseClasses =
    'w-full py-2.5 font-medium rounded-lg transition-colors relative overflow-hidden flex items-center justify-center gap-2';

  const stateClasses = {
    idle: 'bg-black text-white hover:bg-zinc-800',
    loading: 'bg-black text-white',
    success: 'bg-green-600 text-white hover:bg-green-700',
    error: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      onClick={onClick}
      disabled={isButtonDisabled}
      className={`${baseClasses} ${stateClasses[state]} ${className} ${
        isButtonDisabled ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      {state === 'loading' && (
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>saving...</span>
        </motion.div>
      )}
      {state === 'success' && (
        <motion.div
          className="flex items-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>saved</span>
        </motion.div>
      )}
      {state === 'error' && (
        <motion.div
          className="flex items-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>error</span>
        </motion.div>
      )}
      {state === 'idle' && <span>{children}</span>}
    </button>
  );
}
