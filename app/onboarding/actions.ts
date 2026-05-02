'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function updateUsername(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const username = formData.get('username') as string;

  const { error } = await supabase.from('users').update({ username }).eq('id', user.id);

  if (error) {
    return redirect(`/onboarding/username?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/onboarding/display-name');
  redirect('/onboarding/display-name');
}

export async function updateDisplayName(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const display_name = formData.get('display_name') as string;

  const { error } = await supabase.from('users').update({ display_name }).eq('id', user.id);

  if (error) {
    return redirect(`/onboarding/display-name?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/onboarding/avatar');
  redirect('/onboarding/avatar');
}

export async function updateAvatar(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const file = formData.get('avatar') as File;
  if (file && file.size > 0) {
    if (file.size > 2 * 1024 * 1024) {
      return redirect('/onboarding/avatar?error=File size too large (max 2MB)');
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return redirect(`/onboarding/avatar?error=${encodeURIComponent(uploadError.message)}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      return redirect(`/onboarding/avatar?error=${encodeURIComponent(updateError.message)}`);
    }
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function skipAvatar() {
  revalidatePath('/dashboard');
  redirect('/dashboard');
}
