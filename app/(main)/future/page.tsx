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
      <div className="min-h-screen flex items-center justify-center bg-app-page">
        <p className="animate-pulse text-app-font opacity-60">Loading Suggestions...</p>
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
      <div className="min-h-screen bg-app-page flex flex-col items-center justify-center pb-32 text-center px-4">
        <div className="w-full mx-auto md:max-w-lg px-4">
          <h1 className="text-2xl font-normal text-app-font opacity-60">
            We still dont&apos; have recommendations for you...
          </h1>
          <p className="text-app-font opacity-60 mt-2">Add some interests to get started!</p>
        </div>
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
    <div className="min-h-screen bg-app-page text-app-font pb-32 overflow-hidden">
      <main className="w-full mx-auto md:max-w-lg px-4 md:px-0">
        <div className="pt-8 md:pt-12">
          <h1 className="text-xl md:text-4xl lowercase font-normal mb-12">What you might like</h1>

          <div className="flex flex-col">
            {categoriesConfig.map(({ apiKey, title, creatorKey }) => {
              const items = recommendations?.[apiKey as keyof RecommendationsData];
              if (!items || items.length === 0) return null;
              return (
                <CategoryCarousel
                  key={apiKey}
                  title={title}
                  items={items}
                  creatorKey={creatorKey}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- CARROSSEL ---
function CategoryCarousel({ title, items, creatorKey }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(
    items.length > 0 ? Math.floor(items.length / 2) : 0
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Create virtual items for infinite effect (3x duplication)
  const virtualItems = items.length > 0 ? [...items, ...items, ...items] : [];

  const getStyles = (distance: number) => {
    if (distance === 0) return 'h-[96px] w-[96px] opacity-100 z-30 scale-110';
    if (distance === 1) return 'h-[75px] w-[75px] opacity-70 z-20';
    if (distance === 2) return 'h-[65px] w-[65px] opacity-40 z-10';
    return 'w-0 h-0 opacity-0 pointer-events-none hidden';
  };

  const activeItem = items.length > 0 ? items[activeIndex % items.length] : null;

  const handleItemClick = (virtualIndex: number) => {
    const realIndex = virtualIndex % items.length;
    const middleStart = items.length;
    const equivalentMiddleIndex = middleStart + realIndex;
    setActiveIndex(equivalentMiddleIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left -> Next
        setActiveIndex((prev) => (prev + 1) % virtualItems.length);
      } else {
        // Swipe right -> Prev
        setActiveIndex((prev) => (prev - 1 + virtualItems.length) % virtualItems.length);
      }
    }
    setTouchStart(null);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-app-font lowercase">{title}</h2>

      <div
        className="relative flex items-center justify-center touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-center gap-3 h-[120px] w-full overflow-hidden">
          {virtualItems.map((item, virtualIndex) => {
            const distance = Math.abs(virtualIndex - activeIndex);
            if (distance > 2) return null; // Only show ±2 items from center

            const realIndex = virtualIndex % items.length;
            const realItem = items[realIndex];

            return (
              <div
                key={`${virtualIndex}-${realItem.title}`}
                onClick={() => handleItemClick(virtualIndex)}
                className={`${getStyles(distance)} bg-app-nav rounded-app shrink-0 cursor-pointer overflow-hidden relative transition-all duration-500 ease-in-out border border-app-border flex items-center justify-center`}
              >
                {realItem.imageUrl ? (
                  <Image
                    src={realItem.imageUrl}
                    alt={realItem.title}
                    width={distance === 0 ? 120 : distance === 1 ? 100 : 80}
                    height={distance === 0 ? 92 : distance === 1 ? 75 : 65}
                    className="object-cover lowercase"
                    sizes="120px"
                  />
                ) : (
                  // Fallback — sem imagem
                  <div className="w-full h-full flex items-center justify-center p-2 text-center">
                    <span className="text-[8px] md:text-[10px] text-app-font opacity-60 font-semibold uppercase leading-tight truncate">
                      {realItem.title}
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
        <div className="text-center my-2">
          <p className="text-lg font-bold text-app-font">
            {activeItem.title} ({activeItem.year})
          </p>
          <p className="text-sm text-app-font opacity-80">{activeItem[creatorKey]}</p>
        </div>
      )}
    </div>
  );
}
