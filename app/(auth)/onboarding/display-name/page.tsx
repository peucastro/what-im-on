'use client';

import { updateDisplayName } from '@/app/(auth)/onboarding/actions';
import OnboardingButton from '@/components/OnboardingButton';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function DisplayNamePage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showExit, setShowExit] = useState(false);
  const displayNameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsError(false);
    setErrorMessage(null);

    const display_name = displayNameInputRef.current?.value;
    if (!display_name) return;

    setIsLoading(true);

    try {
      const result = await updateDisplayName(display_name);

      if (result.success) {
        setIsSuccess(true);
        // Exit animation and redirect
        setTimeout(() => {
          setShowExit(true);
          setTimeout(() => {
            router.push('/onboarding/avatar');
          }, 300);
        }, 1000);
      } else {
        setIsError(true);
        setErrorMessage(result.error || 'An error occurred');
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage('An unexpected error occurred');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-8"
      variants={containerVariants}
      initial="hidden"
      animate={showExit ? 'exit' : 'visible'}
    >
      <motion.div className="text-center" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">what should we call you?</h1>
        <p className="text-zinc-500 text-sm mt-2">this is your public name on the platform</p>
      </motion.div>

      <motion.form onSubmit={handleSubmit} className="flex flex-col gap-6" variants={itemVariants}>
        <div className="flex flex-col gap-2">
          <label htmlFor="display_name" className="text-xs font-semibold text-zinc-700">
            display name
          </label>
          <input
            ref={displayNameInputRef}
            id="display_name"
            name="display_name"
            placeholder="John Doe"
            required
            disabled={isLoading || isSuccess}
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <OnboardingButton
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          disabled={isError}
        >
          next step
        </OnboardingButton>
      </motion.form>

      {isError && errorMessage && (
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm text-red-500">{errorMessage}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
