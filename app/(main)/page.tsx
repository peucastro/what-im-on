import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl sm:px-6 px-4 py-12 flex flex-col items-center gap-12 text-center sm:items-start sm:text-left">
    <SearchBar />
      <div className="flex flex-col items-center gap-6 sm:items-start">
        <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl lowercase">
          What i&apos;m on
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 lowercase">
          A personal space to showcase your current obsessions and crowdsource your next favorite
          thing. Share what you&apos;re into and get curated recommendations.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-black px-8 text-white transition-colors hover:bg-zinc-800 lowercase"
          href="/register"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
