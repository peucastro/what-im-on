'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { login } from '@/app/(main)/auth/actions';
import OnboardingButton from '@/components/OnboardingButton';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { containerVariants, itemVariants } from '@/utils/animations';

function LoginForm() {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialMessage);
  const [showExit, setShowExit] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      await login(formData);
    } catch (error) {
      if ((error as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) {
        setIsSuccess(true);
        setTimeout(() => {
          setShowExit(true);
        }, 1000);
        throw error;
      }

      setIsError(true);
      setErrorMessage('Could not authenticate user');
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
      <motion.div className="flex flex-col items-center gap-6 text-center" variants={itemVariants}>
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="logo"
            width={64}
            height={64}
            className="hover:opacity-80 transition-opacity"
          />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">welcome back</h1>
          <p className="text-zinc-500 text-sm mt-2">sign in to your account</p>
        </div>
      </motion.div>

      <motion.form onSubmit={handleSubmit} className="flex flex-col gap-6" variants={itemVariants}>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-semibold text-zinc-700">
            email
          </label>
          <input
            name="email"
            placeholder="you@example.com"
            required
            disabled={isLoading || isSuccess}
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            title="Password"
            className="text-xs font-semibold text-zinc-700"
          >
            password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            disabled={isLoading || isSuccess}
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors disabled:opacity-50"
          />
        </div>

        <OnboardingButton
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          loadingText="signing in..."
          successText="welcome back"
          className="mt-2"
        >
          sign in
        </OnboardingButton>

        {errorMessage && <p className="text-sm text-red-500 text-center">{errorMessage}</p>}
      </motion.form>

      <motion.div className="relative" variants={itemVariants}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-zinc-500">or</span>
        </div>
      </motion.div>

      <motion.p className="text-sm text-zinc-600 text-center" variants={itemVariants}>
        don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-black hover:text-zinc-700 transition-colors"
        >
          sign up
        </Link>
      </motion.p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm shrink-0">
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
