import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { signOut } from '@/app/auth/actions';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hello {user.email}</p>
      <form action={signOut}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}
