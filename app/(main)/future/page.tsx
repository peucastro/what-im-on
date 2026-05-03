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
          <h1 className="text-2xl font-normal text-app-font opacity-60 tracking-tight">
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
          <h1 className="text-3xl md:text-4xl font-normal mb-12 tracking-tight">
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
      return 'w-[100px] h-[100px] md:w-[120px] md:h-[120px] opacity-100 z-30 scale-110 shadow-xl';
    if (distance === 1)
      return 'w-[80px] h-[80px] md:w-[100px] md:h-[100px] opacity-70 z-20';
    if (distance === 2)
      return 'w-[60px] h-[60px] md:w-[80px] md:h-[80px] opacity-40 z-10';
    if (distance === 3)
      return 'w-[40px] h-[40px] md:w-[60px] md:h-[60px] opacity-20 z-0';
    return 'w-0 h-0 opacity-0 pointer-events-none hidden';
  };

  const activeItem = items[activeIndex];

  return (
    <div className="w-full">
        <h2 className="text-2xl font-bold mb-8 capitalize text-app-font tracking-tight">{title}</h2>

      <div className="relative flex items-center justify-center">
        <div className="flex items-center justify-center gap-2 md:gap-3 h-[240px] w-full overflow-x-hidden">
          {items.map((item, index) => {
            const distance = Math.abs(index - activeIndex);
            return (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                 className={`${getStyles(distance)} bg-app-nav rounded-app shrink-0 cursor-pointer overflow-hidden relative transition-all duration-500 ease-in-out border border-app-border`}
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
                    <span className="text-[10px] md:text-[12px] text-app-font opacity-60 font-semibold uppercase leading-tight">
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
          <p className="text-[14px] md:text-[16px] font-bold text-app-font leading-tight">
            {activeItem.title} ({activeItem.year})
          </p>
          <p className="text-[12px] md:text-[14px] text-app-font opacity-60">{activeItem[creatorKey]}</p>
        </div>
      )}
    </div>
  );
}
