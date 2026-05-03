import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import WhoIsIntoWhatYouAreOn from '@/components/WhoIsIntoWhatYouAreOn';

export default async function OthersPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Call the database function directly since we're already on the server
  const { data: recommendations, error } = await supabase
    .rpc('get_user_recommendations', { target_user_id: user.id });

  if (error) {
    console.error('Error fetching recommendations:', error);
  }

  const recs = recommendations || [];

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Navbar />
      
      <div className="p-4 space-y-12">
        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-app border border-red-100">
            Failed to load recommendations. Please try again later.
          </div>
        ) : recs.length === 0 ? (
          <div className="p-8 text-center bg-app-nav rounded-app border border-app-border">
            <p className="text-app-font opacity-60">No recommendations found at the moment.</p>
            <p className="text-sm text-app-font opacity-40 mt-2">Try adding more current interests to your profile!</p>
          </div>
        ) : (
          <WhoIsIntoWhatYouAreOn recommendations={recs} />
        )}
      </div>
    </div>
  );
}
