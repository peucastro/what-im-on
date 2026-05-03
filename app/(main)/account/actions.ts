'use server';

import { createClient } from '@/utils/supabase/server';
import { sanitizeUsernameToSlug, validateUsername } from '@/utils/username';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type ActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function updateProfile(data: {
  username?: string;
  display_name?: string;
}): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const updateData = { ...data };
  if (updateData.username) {
    const slug = sanitizeUsernameToSlug(updateData.username);
    const validation = validateUsername(slug);
    if (!validation.valid) {
      return { success: false, error: validation.error || 'Invalid username' };
    }
    updateData.username = slug;
  }

  const { error } = await supabase.from('users').update(updateData).eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/account');
  revalidatePath('/');
  return { success: true, message: 'Profile updated successfully' };
}

export async function updateEmail(email: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: 'Confirmation link sent to your new email' };
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect('/login');
  }

  // To verify the current password, we attempt to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { success: false, error: 'Incorrect current password' };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: 'Password updated successfully' };
}

export async function deleteAccount(): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Call the RPC function to delete the user
  // This function must be created in the Supabase SQL Editor first
  const { error } = await supabase.rpc('delete_own_user');

  if (error) {
    console.error('Deletion error:', error);
    return { success: false, error: error.message };
  }

  await supabase.auth.signOut();
  redirect('/login');
}
