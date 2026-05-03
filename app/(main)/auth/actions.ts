'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { encodeUserForPath } from '@/utils/username';

function getAuthErrorMessage(code?: string, fallbackMessage?: string): string {
  if (code && /^\d{3}$/.test(code)) {
    return 'Authentication failed. Please try again';
  }
  const cleanCode = code?.split(';')[0] || code;
  switch (cleanCode) {
    case 'invalid_credentials':
      return 'Invalid email or password';
    case 'user_not_found':
      return 'No account found with this email';
    case 'invalid_email':
      return 'Please enter a valid email address';
    case 'user_disabled':
      return 'This account has been disabled';
    case 'too_many_requests':
      return 'Too many attempts. Please try again later';
    case 'network_error':
      return 'Network error. Please check your connection';
    case 'invalid_password':
      return 'Incorrect password';
    default:
      return fallbackMessage || 'Could not sign in. Please try again';
  }
}

function getSignupErrorMessage(code?: string, fallbackMessage?: string): string {
  if (code && /^\d{3}$/.test(code)) {
    return 'Registration failed. Please try again';
  }
  const cleanCode = code?.split(';')[0] || code;
  switch (cleanCode) {
    case 'already_in_use':
      return 'An account with this email already exists';
    case 'invalid_email':
      return 'Please enter a valid email address';
    case 'weak_password':
      return 'Password is too weak. Use at least 6 characters';
    case 'signup_disabled':
      return 'Sign up is currently disabled';
    case 'too_many_requests':
      return 'Too many attempts. Please try again later';
    case 'network_error':
      return 'Network error. Please check your connection';
    default:
      return fallbackMessage || 'Could not create account. Please try again';
  }
}

export type AuthActionResult = {
  success: boolean;
  error?: string;
  redirectUrl?: string;
};

export async function login(formData: FormData): Promise<AuthActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const message = getAuthErrorMessage(error.code);
    return { success: false, error: message };
  }

  let redirectUrl: string;

  if (data.user) {
    const { data: profile } = await supabase
      .from('users')
      .select('username')
      .eq('id', data.user.id)
      .single();

    if (profile?.username) {
      redirectUrl = `/${encodeUserForPath(profile.username)}`;
    } else {
      redirectUrl = '/onboarding/username';
    }
  } else {
    redirectUrl = '/';
  }

  revalidatePath('/', 'layout');
  return { success: true, redirectUrl };
}

export async function signup(formData: FormData, redirectTo?: string): Promise<AuthActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  const origin = (await headers()).get('origin');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    const message = getSignupErrorMessage(error.code);
    return { success: false, error: message };
  }

  revalidatePath('/', 'layout');

  const nextParam = redirectTo ? `?next=${redirectTo}` : '';
  let redirectUrl: string;

  if (data.session) {
    redirectUrl = `/onboarding/username${nextParam}`;
  } else {
    redirectUrl = `/login?message=Check email to continue sign in process${nextParam}`;
  }

  return { success: true, redirectUrl };
}

export async function signOut() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Clear theme preferences from localStorage when logging out
  // This ensures the theme resets to default for the next user/session
  if (typeof window !== 'undefined') {
    localStorage.removeItem('app-theme-preferences');
  }

  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
