import Link from 'next/link';
import Image from 'next/image';
import { getDefaultAvatarUrl } from '@/utils/avatar';
import {
  THEMES,
  BORDER_RADIUS_MAP,
  FONT_FAMILY_MAP,
  BorderRadius,
  FontFamily,
} from '@/utils/themes';

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
  theme_id?: string;
  border_radius?: string;
  font_family?: string;
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
      <h2 className="text-xl text-app-font mb-4 lowercase">who&apos;s into what you&apos;re on</h2>
      <div className="flex flex-col gap-2">
        {recommendations.slice(0, 3).map((rec) => {
          const themeId = rec.theme_id || 'default';
          const theme = THEMES[themeId] || THEMES.default;
          const borderRadius = BORDER_RADIUS_MAP[(rec.border_radius as BorderRadius) || 'low'];
          const fontFamily = FONT_FAMILY_MAP[(rec.font_family as FontFamily) || 'sans'];

          const cardStyle: React.CSSProperties = {
            borderRadius,
            fontFamily,
            backgroundColor: theme.colors.profileBackground,
            backgroundImage:
              theme.colors.headerImage !== 'none'
                ? `linear-gradient(to right, ${theme.colors.profileBackground} 0%, ${theme.colors.profileBackground} 40%, transparent 100%), ${theme.colors.headerImage}`
                : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderColor: theme.colors.border,
            borderWidth: '1px',
            borderStyle: 'solid',
            color: theme.colors.font,
          };

          const avatarContainerStyle: React.CSSProperties = {
            borderRadius,
            backgroundColor: theme.colors.border,
            borderColor: theme.colors.border,
          };

          return (
            <Link
              href={`/${rec.username}`}
              key={rec.user_id}
              className="flex items-center gap-4 p-4 hover:opacity-90 transition-all shadow-sm group"
              style={cardStyle}
            >
              <div className="relative w-24 h-24 shrink-0">
                <div
                  className="w-full h-full flex items-center justify-center overflow-hidden border"
                  style={avatarContainerStyle}
                >
                  <Image
                    src={rec.avatar_url || getDefaultAvatarUrl(rec.display_name || rec.username)}
                    alt={rec.username}
                    fill
                    className="object-cover"
                    style={{ borderRadius }}
                    unoptimized
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-bold text-lg truncate leading-tight">
                    {rec.display_name || rec.username}
                  </h3>
                  <p className="text-sm opacity-60 truncate mb-1">@{rec.username}</p>
                </div>
                <p className="text-xs opacity-60 italic">
                  {formatDescription(rec.matching_categories)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
