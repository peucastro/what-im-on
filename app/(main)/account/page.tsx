'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { updateProfile, updateEmail, updatePassword, deleteAccount } from './actions';
import OnboardingButton from '@/components/OnboardingButton';
import FormMessage from '@/components/FormMessage';
import { useRouter } from 'next/navigation';

import { containerVariants, itemVariants } from '@/utils/animations';

interface UserData {
  id: string;
  email?: string;
}

interface ProfileData {
  username?: string;
  display_name?: string;
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

    const result = await updateProfile({ username, display_name });
    setProfileLoading(false);
    if (result.success) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } else {
      setProfileError(true);
      setProfileMsg(result.error || 'Failed to update profile');
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
      setEmailMsg(result.error || 'Failed to update email');
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
      setPasswordMsg('Current passwords do not match');
      return;
    }

    const result = await updatePassword(currentPassword, newPassword);
    setPasswordLoading(false);
    if (result.success) {
      setPasswordSuccess(true);
      setPasswordMsg(result.message || 'Password updated');
      setTimeout(() => setPasswordSuccess(false), 3000);
      (e.target as HTMLFormElement).reset();
    } else {
      setPasswordError(true);
      setPasswordMsg(result.error || 'Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    const result = await deleteAccount();
    if (!result.success) {
      setDeleteLoading(false);
      alert(result.error || 'Failed to delete account');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-12 min-h-screen">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight">account settings</h1>
          <p className="text-zinc-500 text-sm mt-2">
            manage your personal information and security
          </p>
        </div>

        <motion.div
          className="flex flex-col gap-12 pb-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Section */}
          <motion.section variants={itemVariants} className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">profile</h2>
              <p className="text-zinc-500 text-sm">how others see you on the platform</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-xs font-semibold text-zinc-700">
                  username
                </label>
                <input
                  id="username"
                  name="username"
                  defaultValue={profile?.username || ''}
                  placeholder="username"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="display_name" className="text-xs font-semibold text-zinc-700">
                  display name
                </label>
                <input
                  id="display_name"
                  name="display_name"
                  defaultValue={profile?.display_name || ''}
                  placeholder="display name"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                />
              </div>

              <OnboardingButton
                isLoading={profileLoading}
                isSuccess={profileSuccess}
                isError={profileError}
                loadingText="saving profile..."
                successText="profile saved"
              >
                save profile
              </OnboardingButton>

              <FormMessage message={profileMsg} type={profileError ? 'error' : 'success'} />
            </form>
          </motion.section>

          {/* Email Section */}
          <motion.section variants={itemVariants} className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">email address</h2>
              <p className="text-zinc-500 text-sm">update the email associated with your account</p>
            </div>

            <form onSubmit={handleUpdateEmail} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-semibold text-zinc-700">
                  email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user?.email || ''}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
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
          <motion.section variants={itemVariants} className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">password</h2>
              <p className="text-zinc-500 text-sm">
                change your password to keep your account secure
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="current_password" className="text-xs font-semibold text-zinc-700">
                  current password
                </label>
                <input
                  id="current_password"
                  name="current_password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="confirm_current_password"
                  className="text-xs font-semibold text-zinc-700"
                >
                  confirm current password
                </label>
                <input
                  id="confirm_current_password"
                  name="confirm_current_password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="new_password"
                  title="Password"
                  className="text-xs font-semibold text-zinc-700"
                >
                  new password
                </label>
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                />
              </div>

              <OnboardingButton
                isLoading={passwordLoading}
                isSuccess={passwordSuccess}
                isError={passwordError}
                loadingText="updating password..."
                successText="password updated"
              >
                update password
              </OnboardingButton>

              <FormMessage message={passwordMsg} type={passwordError ? 'error' : 'success'} />
            </form>
          </motion.section>

          {/* Danger Zone */}
          <motion.section
            variants={itemVariants}
            className="flex flex-col gap-4 pt-12 border-t border-zinc-100"
          >
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors w-fit mx-auto"
              >
                delete account
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-zinc-500 text-center">
                  this will permanently delete your account and all associated data.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-sm font-semibold text-zinc-600 hover:text-black transition-colors"
                  >
                    cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
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
