'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { updateProfile, updateEmail, updatePassword, deleteAccount } from './actions';
import { updateAvatar } from '@/app/(auth)/onboarding/actions';
import OnboardingButton from '@/components/OnboardingButton';
import FormMessage from '@/components/FormMessage';
import AvatarUpload from '@/components/AvatarUpload';
import { useRouter } from 'next/navigation';

import { containerVariants, itemVariants } from '@/utils/animations';

interface UserData {
  id: string;
  email?: string;
}

interface ProfileData {
  username?: string;
  display_name?: string;
  avatar_url?: string | null;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Profile State
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  // Email State
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailMsg, setEmailMsg] = useState<string | null>(null);

  // Password State
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // Delete State
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();

      setProfile(profile);
      setIsLoading(false);
    }
    loadData();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess(false);
    setProfileError(false);
    setProfileMsg(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const display_name = formData.get('display_name') as string;

    try {
      // 1. Update Profile Data
      const profileResult = await updateProfile({ username, display_name });

      if (!profileResult.success) {
        setProfileError(true);
        setProfileMsg(profileResult.error || 'failed to update profile');
        setProfileLoading(false);
        return;
      }

      // 2. Update Avatar if selected
      if (selectedAvatar) {
        const avatarResult = await updateAvatar(selectedAvatar);
        if (!avatarResult.success) {
          setProfileError(true);
          setProfileMsg(avatarResult.error || 'failed to update avatar');
          setProfileLoading(false);
          return;
        }
        setSelectedAvatar(null);
      }

      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);

      // Refresh profile data
      const supabase = createClient();
      const { data: updatedProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();
      setProfile(updatedProfile);
    } catch {
      setProfileError(true);
      setProfileMsg('an unexpected error occurred');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailSuccess(false);
    setEmailError(false);
    setEmailMsg(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const result = await updateEmail(email);
    setEmailLoading(false);
    if (result.success) {
      setEmailSuccess(true);
    } else {
      setEmailError(true);
      setEmailMsg(result.error || 'failed to update email');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess(false);
    setPasswordError(false);
    setPasswordMsg(null);

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('current_password') as string;
    const confirmCurrent = formData.get('confirm_current_password') as string;
    const newPassword = formData.get('new_password') as string;

    if (currentPassword !== confirmCurrent) {
      setPasswordLoading(false);
      setPasswordError(true);
      setPasswordMsg('current passwords do not match');
      return;
    }

    const result = await updatePassword(currentPassword, newPassword);
    setPasswordLoading(false);
    if (result.success) {
      setPasswordSuccess(true);
      setPasswordMsg(result.message || 'password updated');
      setTimeout(() => setPasswordSuccess(false), 3000);
      (e.target as HTMLFormElement).reset();
    } else {
      setPasswordError(true);
      setPasswordMsg(result.error || 'failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    const result = await deleteAccount();
    if (!result.success) {
      setDeleteLoading(false);
      alert(result.error || 'failed to delete account');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  const inputClasses =
    'w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all font-sans';
  const labelClasses = 'text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1';
  const sectionTitleClasses = 'text-xl font-bold tracking-tight text-zinc-900 lowercase';
  const sectionDescClasses = 'text-zinc-500 text-sm lowercase mb-6';

  return (
    <div className="flex flex-col items-center px-4 py-12 min-h-screen">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 lowercase">settings</h1>
          <p className="text-zinc-500 text-sm mt-2 lowercase">
            manage your personal information and security
          </p>
        </div>

        <motion.div
          className="flex flex-col gap-12 pb-32"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.section variants={itemVariants} className="flex flex-col">
            <div>
              <h2 className={sectionTitleClasses}>profile</h2>
              <p className={sectionDescClasses}>how others see you on the platform</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="username" className={labelClasses}>
                    username
                  </label>
                  <input
                    id="username"
                    name="username"
                    defaultValue={profile?.username || ''}
                    placeholder="username"
                    className={inputClasses}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="display_name" className={labelClasses}>
                    display name
                  </label>
                  <input
                    id="display_name"
                    name="display_name"
                    defaultValue={profile?.display_name || ''}
                    placeholder="display name"
                    className={inputClasses}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <label className={labelClasses}>avatar</label>
                  <AvatarUpload
                    currentAvatarUrl={profile?.avatar_url}
                    onFileSelect={setSelectedAvatar}
                    isLoading={profileLoading}
                    isSuccess={profileSuccess}
                  />
                </div>

                <OnboardingButton
                  isLoading={profileLoading}
                  isSuccess={profileSuccess}
                  isError={profileError}
                  loadingText="saving profile..."
                  successText="profile saved"
                  className="rounded-xl bg-black text-white py-3 lowercase font-bold"
                >
                  save profile
                </OnboardingButton>

                <FormMessage message={profileMsg} type={profileError ? 'error' : 'success'} />
              </div>
            </form>
          </motion.section>

          {/* Email Section */}
          <motion.section variants={itemVariants} className="flex flex-col">
            <div>
              <h2 className={sectionTitleClasses}>email address</h2>
              <p className={sectionDescClasses}>update the email associated with your account</p>
            </div>

            <form onSubmit={handleUpdateEmail} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className={labelClasses}>
                  email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user?.email || ''}
                  placeholder="you@example.com"
                  className={inputClasses}
                />
              </div>

              <OnboardingButton
                isLoading={emailLoading}
                isSuccess={emailSuccess}
                isError={emailError}
                loadingText="updating email..."
                successText="email updated"
              >
                update email
              </OnboardingButton>

              <FormMessage message={emailMsg} type={emailError ? 'error' : 'success'} />
            </form>
          </motion.section>

          {/* Password Section */}
          <motion.section variants={itemVariants} className="flex flex-col">
            <div>
              <h2 className={sectionTitleClasses}>password</h2>
              <p className={sectionDescClasses}>change your password to keep your account secure</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="current_password" className={labelClasses}>
                  current password
                </label>
                <input
                  id="current_password"
                  name="current_password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className={inputClasses}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirm_current_password" className={labelClasses}>
                  confirm current password
                </label>
                <input
                  id="confirm_current_password"
                  name="confirm_current_password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className={inputClasses}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="new_password" className={labelClasses}>
                  new password
                </label>
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={inputClasses}
                />
              </div>

              <OnboardingButton
                isLoading={passwordLoading}
                isSuccess={passwordSuccess}
                isError={passwordError}
                loadingText="updating password..."
                successText="password updated"
                className="rounded-xl bg-black text-white py-3 lowercase font-bold"
              >
                update password
              </OnboardingButton>

              <FormMessage message={passwordMsg} type={passwordError ? 'error' : 'success'} />
            </form>
          </motion.section>

          {/* Danger Zone */}
          <motion.section
            variants={itemVariants}
            className="flex flex-col gap-4 pt-12 border-t border-zinc-200"
          >
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors w-fit mx-auto lowercase"
              >
                delete account
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-xs text-zinc-400 text-center lowercase">
                  this will permanently delete your account and all associated data.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-sm font-bold text-zinc-500 hover:text-zinc-700 transition-colors lowercase"
                  >
                    cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 lowercase"
                  >
                    {deleteLoading ? 'deleting...' : 'yes, delete'}
                  </button>
                </div>
              </div>
            )}
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
