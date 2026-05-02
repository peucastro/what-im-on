import Link from 'next/link';
import { signup } from '@/app/auth/actions';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm shrink-0">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">join what i'm on</h1>
            <p className="text-zinc-500 text-sm mt-2">create an account to get started</p>
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
              <label htmlFor="password" title="Password" className="text-xs font-semibold text-zinc-700">
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
              formAction={signup}
              className="w-full py-2.5 bg-black text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors mt-2"
            >
              sign up
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
            already have an account?{' '}
            <Link href="/login" className="font-semibold text-black hover:text-zinc-700 transition-colors">
              sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
