import { updateDisplayName } from '@/app/onboarding/actions';

export default async function DisplayNamePage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">What should we call you?</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This is your public name on the platform.
        </p>
      </div>

      <form action={updateDisplayName} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="display_name" className="text-sm font-medium">
            Display Name
          </label>
          <input
            name="display_name"
            placeholder="John Doe"
            required
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
