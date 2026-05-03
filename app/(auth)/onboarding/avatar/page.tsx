'use client';

import { updateAvatar } from '@/app/(auth)/onboarding/actions';
import OnboardingButton from '@/components/OnboardingButton';
import ProgressIndicator from '@/components/ProgressIndicator';
import AvatarUpload from '@/components/AvatarUpload';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { triggerConfetti } from '@/utils/confetti';
import { containerVariants, itemVariants } from '@/utils/animations';
import FormMessage from '@/components/FormMessage';

function AvatarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showExit, setShowExit] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAvatarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsError(false);
    setErrorMessage(null);

    setIsLoading(true);

    try {
      const result = await updateAvatar(selectedFile || undefined);

      if (result.success) {
        setIsSuccess(true);
        triggerConfetti();

        setTimeout(() => {
          setShowExit(true);
          setTimeout(() => {
            const nextParam = searchParams.get('next');
            router.push(nextParam || '/');
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
        <ProgressIndicator currentStep={3} totalSteps={3} />
      </motion.div>

      <motion.div className="text-center" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">add an avatar</h1>
        <p className="text-zinc-500 text-sm mt-2">upload a picture to personalize your profile</p>
      </motion.div>

      <motion.form
        onSubmit={handleAvatarSubmit}
        className="flex flex-col gap-6"
        variants={itemVariants}
      >
        <AvatarUpload onFileSelect={setSelectedFile} isLoading={isLoading} isSuccess={isSuccess} />

        <div className="flex flex-col gap-3">
          <OnboardingButton
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            disabled={isError}
            loadingText="uploading avatar..."
            successText="welcome onboard!"
          >
            finish onboarding
          </OnboardingButton>
        </div>
      </motion.form>

      <FormMessage message={errorMessage} type="error" />
    </motion.div>
  );
}

export default function AvatarPage() {
  return (
    <Suspense fallback={null}>
      <AvatarForm />
    </Suspense>
  );
}
