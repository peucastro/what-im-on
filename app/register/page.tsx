import Link from 'next/link';
import { signup } from '@/app/auth/actions';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            name="email"
            placeholder="you@example.com"
            required
            className="rounded-md border border-zinc-200 px-3 py-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" title="Password" className="text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            className="rounded-md border border-zinc-200 px-3 py-2"
          />
        </div>
        <button
          formAction={signup}
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800"
        >
          Sign Up
        </button>
        {message && <p className="text-sm text-red-500">{message}</p>}
      </form>

      <p className="text-sm text-zinc-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-black underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
