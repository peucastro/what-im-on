import Link from 'next/link';
import { login } from '@/app/auth/actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  return (
    <div>
      <Link href="/">Back</Link>

      <form>
        <label htmlFor="email">Email</label>
        <input name="email" placeholder="you@example.com" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="••••••••" required />
        <button formAction={login}>Sign In</button>
        {searchParams && (await searchParams).message && <p>{(await searchParams).message}</p>}
      </form>

      <p>
        Don&apos;t have an account? <Link href="/register">Sign Up</Link>
      </p>
    </div>
  );
}
