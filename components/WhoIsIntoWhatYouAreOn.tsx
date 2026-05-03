import Link from 'next/link';
import Image from 'next/image';
import { getDefaultAvatarUrl } from '@/utils/avatar';

interface Recommendation {
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  score: number;
  shared_items: number;
  shared_item_titles: string[];
  shared_categories: number;
  matching_categories: string[];
}

interface WhoIsIntoWhatYouAreOnProps {
  recommendations: Recommendation[];
}

export default function WhoIsIntoWhatYouAreOn({ recommendations }: WhoIsIntoWhatYouAreOnProps) {
  if (recommendations.length === 0) return null;

  const formatDescription = (matchingCategories: string[]) => {
    if (matchingCategories.length === 0) return <span>shares some of your interests</span>;

    const categoryMapping: Record<string, string> = {
      movie: 'movies',
      tv: 'TV shows',
      book: 'books',
      podcast: 'podcasts',
      album: 'music',
      music: 'music',
      game: 'games',
    };

    const categories = matchingCategories.map(
      (cat) => categoryMapping[cat.toLowerCase()] || cat.toLowerCase()
    );
    const uniqueCategories = Array.from(new Set(categories));

    if (uniqueCategories.length === 1) {
      return (
        <span>
          shares your taste in <span className="font-bold">{uniqueCategories[0]}</span>
        </span>
      );
    }

    if (uniqueCategories.length === 2) {
      return (
        <span>
          shares your taste in <span className="font-bold">{uniqueCategories[0]}</span> and{' '}
          <span className="font-bold">{uniqueCategories[1]}</span>
        </span>
      );
    }

    const last = uniqueCategories.pop();
    return (
      <span>
        shares your taste in{' '}
        {uniqueCategories.map((cat, i) => (
          <span key={cat}>
            <span className="font-bold">{cat}</span>
            {i < uniqueCategories.length - 1 ? ', ' : ''}
          </span>
        ))}{' '}
        and <span className="font-bold">{last}</span>
      </span>
    );
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-app-font mb-4 lowercase">
        who&apos;s into what you&apos;re on
      </h2>
      <div className="flex flex-col gap-2">
        {recommendations.slice(0, 3).map((rec) => (
          <Link
            href={`/${rec.username}`}
            key={rec.user_id}
            className="flex items-center gap-4 p-4 border border-app-border rounded-app bg-app-nav hover:opacity-90 transition-all shadow-sm group"
          >
            <div className="relative w-24 h-24 shrink-0">
              <div className="w-full h-full bg-app-border rounded-app flex items-center justify-center overflow-hidden border border-app-border">
                <Image
                  src={rec.avatar_url || getDefaultAvatarUrl(rec.display_name || rec.username)}
                  alt={rec.username}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-bold text-lg text-app-font truncate leading-tight">
                  {rec.display_name || rec.username}
                </h3>
                <p className="text-sm text-app-font opacity-60 truncate mb-1">@{rec.username}</p>
              </div>
              <p className="text-xs text-app-font opacity-60 italic">
                {formatDescription(rec.matching_categories)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
