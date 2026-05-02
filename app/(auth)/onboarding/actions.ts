'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function updateUsername(username: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { error } = await supabase.from('users').update({ username }).eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/onboarding/display-name');
  return { success: true };
}

export async function updateDisplayName(display_name: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { error } = await supabase.from('users').update({ display_name }).eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/onboarding/avatar');
  return { success: true };
}

export async function updateAvatar(file?: File): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  if (file && file.size > 0) {
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: 'File size too large (max 2MB)' };
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function skipAvatar(): Promise<ActionResult> {
  revalidatePath('/dashboard');
  return { success: true };
}
