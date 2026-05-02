'use client';

import { motion, AnimatePresence } from 'framer-motion';

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

interface OnboardingButtonProps {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export default function OnboardingButton({
  isLoading,
  isSuccess,
  isError,
  onClick,
  children = 'next step',
  loadingText = 'saving...',
  successText = 'saved',
  errorText = 'error',
  disabled = false,
  className = '',
  type = 'submit',
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
    'w-full py-2.5 font-medium rounded-lg transition-all relative overflow-hidden flex items-center justify-center gap-2 border-2 border-transparent';

  const stateStyles = {
    idle: 'bg-black text-white hover:bg-zinc-800',
    loading: 'bg-black text-white cursor-default',
    success: 'bg-black text-white border-green-500/50 cursor-default',
    error: 'bg-black text-white border-red-500/50 cursor-default',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isButtonDisabled}
      className={`${baseClasses} ${stateStyles[state]} ${className}`}
    >
      <AnimatePresence mode="wait">
        {state === 'loading' && (
          <motion.div
            key="loading"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>{loadingText}</span>
          </motion.div>
        )}
        {state === 'success' && (
          <motion.div
            key="success"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{successText}</span>
          </motion.div>
        )}
        {state === 'error' && (
          <motion.div
            key="error"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorText}</span>
          </motion.div>
        )}
        {state === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
