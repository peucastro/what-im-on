'use client';

import Image from 'next/image';
import { updateAvatar } from '@/app/(auth)/onboarding/actions';
import OnboardingButton from '@/components/OnboardingButton';
import ProgressIndicator from '@/components/ProgressIndicator';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, Suspense } from 'react';
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
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setIsError(true);
      setErrorMessage('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAvatarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsError(false);
    setErrorMessage(null);

    const file = fileInputRef.current?.files?.[0];

    setIsLoading(true);

    try {
      const result = await updateAvatar(file);

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
        <input
          ref={fileInputRef}
          type="file"
          name="avatar"
          id="avatar"
          accept="image/*"
          onChange={handleInputChange}
          disabled={isLoading || isSuccess}
          className="hidden"
        />

        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isLoading && !isSuccess && fileInputRef.current?.click()}
          className={`relative w-full px-6 py-12 border-2 border-dashed rounded-xl transition-all ${
            isLoading || isSuccess ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } ${
            isDragActive
              ? 'border-black bg-zinc-100'
              : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100'
          }`}
        >
          <AnimatePresence mode="wait">
            {selectedImage ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-black">
                  <Image
                    src={selectedImage}
                    alt="Avatar preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-900">image selected</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="text-xs text-zinc-600 hover:text-black transition-colors mt-2"
                  >
                    change image
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="w-12 h-12 bg-zinc-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-zinc-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">drag and drop your image</p>
                  <p className="text-xs text-zinc-500 mt-1">or click to browse</p>
                </div>
                <p className="text-xs text-zinc-400 mt-2">PNG, JPG up to 2MB</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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
