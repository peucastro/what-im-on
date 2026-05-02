import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { login } from '@/app/(main)/auth/actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/account');
  }

  const { message } = await searchParams;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm shrink-0">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <Link href="/">
              <Image src="/logo.svg" alt="logo" width={40} height={40} className="hover:opacity-80 transition-opacity" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">welcome back</h1>
              <p className="text-zinc-500 text-sm mt-2">sign in to your account</p>
            </div>
          </div>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-semibold text-zinc-700">
                email
              </label>
              <input
                name="email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                title="Password"
                className="text-xs font-semibold text-zinc-700"
              >
                password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
              />
            </div>

            <button
              formAction={login}
              className="w-full py-2.5 bg-black text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors mt-2"
            >
              sign in
            </button>

            {message && <p className="text-sm text-red-500 text-center">{message}</p>}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-zinc-500">or</span>
            </div>
          </div>

          <p className="text-sm text-zinc-600 text-center">
            don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-black hover:text-zinc-700 transition-colors"
            >
              sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
