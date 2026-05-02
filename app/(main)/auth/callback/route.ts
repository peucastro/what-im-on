import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

function getCallbackErrorMessage(code?: string): string {
  if (code && /^\d{3}$/.test(code)) {
    return 'Could not complete sign in. Please try again';
  }
  const cleanCode = code?.split(';')[0] || code;
  switch (cleanCode) {
    case 'expired_code':
      return 'Verification link has expired. Please request a new one';
    case 'invalid_code':
      return 'Invalid verification link. Please try again';
    case 'already_redeemed':
      return 'This link has already been used';
    case 'network_error':
      return 'Network error. Please check your connection';
    default:
      return 'Could not complete sign in. Please try again';
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    const message = getCallbackErrorMessage(error.code);
    return NextResponse.redirect(`${origin}/login?message=${encodeURIComponent(message)}`);
  }

  return NextResponse.redirect(
    `${origin}/login?message=${encodeURIComponent('Could not complete sign in. Please try again')}`
  );
}
