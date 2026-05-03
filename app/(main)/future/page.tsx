'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// --- INTERFACES ---
interface RecommendationItem {
  title: string;
  year: string;
  imageUrl?: string;
  [key: string]: string | undefined;
}

interface RecommendationsData {
  tv_shows?: RecommendationItem[];
  books?: RecommendationItem[];
  movies?: RecommendationItem[];
  podcasts?: RecommendationItem[];
  albums?: RecommendationItem[];
  games?: RecommendationItem[];
}

interface BodyProps {
  recommendations: RecommendationsData | null;
}

interface CarouselProps {
  title: string;
  items: RecommendationItem[];
  creatorKey: string;
}

// --- COMPONENTE PRINCIPAL ---
export default function FuturePage() {
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/recommendations');
        const json = await response.json();
        setData(json.recommendations);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f5]">
        <p className="animate-pulse text-gray-400">Loading Suggestions...</p>
      </div>
    );
  }

  return <FutureBody recommendations={data} />;
}

// --- COMPONENTE DO CORPO ---
function FutureBody({ recommendations }: BodyProps) {
  const hasAnyRecommendations =
    recommendations && Object.values(recommendations).some((arr) => arr && arr.length > 0);

  if (!hasAnyRecommendations) {
    return (
      <div className="min-h-screen bg-[#f3f4f5] flex flex-col items-center justify-center pb-20 text-center px-4">
        <h1 className="text-2xl font-normal text-gray-400 tracking-tight">
          We still dont&apos; have recommendations for you...
        </h1>
        <p className="text-gray-400 mt-2">Add some interests to get started!</p>
      </div>
    );
  }

  const categoriesConfig = [
    { apiKey: 'albums', title: 'songs', creatorKey: 'artist' },
    { apiKey: 'books', title: 'books', creatorKey: 'author' },
    { apiKey: 'movies', title: 'movies', creatorKey: 'director' },
    { apiKey: 'tv_shows', title: 'tv shows', creatorKey: 'network' },
    { apiKey: 'podcasts', title: 'podcasts', creatorKey: 'host' },
    { apiKey: 'games', title: 'games', creatorKey: 'studio' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f3f4f5] text-black pb-20 overflow-hidden">
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-12 md:pt-20">
        <h1 className="text-3xl md:text-4xl font-normal mb-12 tracking-tight text-gray-900">
          What you might like
        </h1>

        <div className="flex flex-col gap-16">
          {categoriesConfig.map(({ apiKey, title, creatorKey }) => {
            const items = recommendations?.[apiKey as keyof RecommendationsData];
            if (!items || items.length === 0) return null;
            return (
              <CategoryCarousel key={apiKey} title={title} items={items} creatorKey={creatorKey} />
            );
          })}
        </div>
      </main>
    </div>
  );
}

// --- CARROSSEL ---
function CategoryCarousel({ title, items, creatorKey }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));

  const getStyles = (distance: number) => {
    if (distance === 0)
      return 'w-[140px] h-[140px] md:w-[170px] md:h-[170px] lg:w-[200px] lg:h-[200px] opacity-100 z-30 scale-110 shadow-2xl';
    if (distance === 1)
      return 'w-[110px] h-[110px] md:w-[140px] md:h-[140px] lg:w-[170px] lg:h-[170px] opacity-70 z-20';
    if (distance === 2)
      return 'w-[90px] h-[90px] md:w-[110px] md:h-[110px] lg:w-[140px] lg:h-[140px] opacity-40 z-10';
    if (distance === 3)
      return 'w-[70px] h-[70px] md:w-[90px] md:h-[90px] lg:w-[110px] lg:h-[110px] opacity-20 z-0';
    return 'w-0 h-0 opacity-0 pointer-events-none hidden';
  };

  const activeItem = items[activeIndex];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-8 capitalize text-gray-900 tracking-tight">{title}</h2>

      <div className="relative flex items-center justify-center">
        <div className="flex items-center justify-center gap-2 md:gap-4 lg:gap-6 h-[240px] w-full">
          {items.map((item, index) => {
            const distance = Math.abs(index - activeIndex);
            return (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`${getStyles(distance)} bg-[#d9d9d9] rounded-[4px] shrink-0 cursor-pointer overflow-hidden relative transition-all duration-500 ease-in-out`}
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                ) : (
                  // Fallback — sem imagem
                  <div className="w-full h-full flex items-center justify-center p-4 text-center">
                    <span className="text-[10px] md:text-[12px] text-gray-600 font-semibold uppercase leading-tight">
                      {item.title}
                    </span>
                  </div>
                )}
                {/* Overlay gradiente em cima da imagem */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            );
          })}
        </div>
      </div>

      {activeItem && (
        <div className="text-center mt-6 h-20">
          <p className="text-[14px] md:text-[16px] font-bold text-gray-900 leading-tight">
            {activeItem.title} ({activeItem.year})
          </p>
          <p className="text-[12px] md:text-[14px] text-gray-600">{activeItem[creatorKey]}</p>
        </div>
      )}
    </div>
  );
}
