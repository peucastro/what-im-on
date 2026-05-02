'use client';

import { updateUsername } from '@/app/(auth)/onboarding/actions';
import OnboardingButton from '@/components/OnboardingButton';
import ProgressIndicator from '@/components/ProgressIndicator';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, Suspense } from 'react';
import { containerVariants, itemVariants } from '@/utils/animations';
import FormMessage from '@/components/FormMessage';

function UsernameForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showExit, setShowExit] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsError(false);
    setErrorMessage(null);

    const username = usernameInputRef.current?.value;
    if (!username) return;

    setIsLoading(true);

    try {
      const result = await updateUsername(username);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setShowExit(true);
          setTimeout(() => {
            const nextParam = searchParams.get('next');
            router.push(`/onboarding/display-name${nextParam ? `?next=${nextParam}` : ''}`);
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
      <motion.div variants={itemVariants}>
        <ProgressIndicator currentStep={1} totalSteps={3} />
      </motion.div>

      <motion.div className="text-center" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">choose your username</h1>
        <p className="text-zinc-500 text-sm mt-2">this is how people will find you</p>
      </motion.div>

      <motion.form onSubmit={handleSubmit} className="flex flex-col gap-6" variants={itemVariants}>
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-xs font-semibold text-zinc-700">
            username
          </label>
          <input
            ref={usernameInputRef}
            id="username"
            name="username"
            placeholder="johndoe"
            required
            minLength={3}
            disabled={isLoading || isSuccess}
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <OnboardingButton
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          loadingText="setting username..."
          successText="username set"
        >
          next step
        </OnboardingButton>
      </motion.form>

      <FormMessage message={errorMessage} type="error" />
    </motion.div>
  );
}

export default function UsernamePage() {
  return (
    <Suspense fallback={null}>
      <UsernameForm />
    </Suspense>
  );
}
