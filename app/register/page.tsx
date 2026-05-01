import Link from 'next/link';
import { signup } from '@/app/auth/actions';

export default async function RegisterPage({
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
        <button formAction={signup}>Sign Up</button>
        {searchParams && (await searchParams).message && <p>{(await searchParams).message}</p>}
      </form>

      <p>
        Already have an account? <Link href="/login">Sign In</Link>
      </p>
    </div>
  );
}
