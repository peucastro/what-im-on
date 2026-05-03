'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onFileSelect: (file: File | null) => void;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export default function AvatarUpload({
  currentAvatarUrl,
  onFileSelect,
  isLoading,
  isSuccess,
}: AvatarUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSuccess) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedImage(null);
    }
  }, [isSuccess]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelect(file);
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
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = selectedImage || currentAvatarUrl;

  return (
    <div className="flex flex-col gap-4">
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
        className={`relative w-full px-6 py-8 border-2 border-dashed rounded-xl transition-all ${
          isLoading || isSuccess ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${
          isDragActive ? 'border-black bg-zinc-100' : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100'
        }`}
      >
        <AnimatePresence mode="wait">
          {displayImage ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-black">
                <Image
                  src={displayImage}
                  alt="Avatar preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-900">
                  {selectedImage ? 'image selected' : 'current avatar'}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedImage) {
                      clearImage();
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                  className="text-xs text-zinc-600 hover:text-black transition-colors mt-2"
                >
                  {selectedImage ? 'clear selection' : 'change avatar'}
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
                <p className="text-sm font-medium text-zinc-900 lowercase">
                  drag and drop your image
                </p>
                <p className="text-xs text-zinc-500 mt-1 lowercase">or click to browse</p>
              </div>
              <p className="text-xs text-zinc-400 mt-2 lowercase">PNG, JPG up to 2MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
