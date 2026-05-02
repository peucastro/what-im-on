import { updateUsername } from '@/app/onboarding/actions';

export default async function UsernamePage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Choose your username</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This is how people will find you.
        </p>
      </div>

      <form action={updateUsername} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            name="username"
            placeholder="johndoe"
            required
            minLength={3}
            className="rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800 dark:bg-black"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Next Step
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
}
