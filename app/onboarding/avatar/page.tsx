import { updateAvatar, skipAvatar } from '@/app/onboarding/actions';

export default async function AvatarPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Add an avatar</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Upload a picture to personalize your profile.
        </p>
      </div>

      <form className="flex flex-col gap-4" encType="multipart/form-data">
        <div className="flex flex-col gap-2">
          <label htmlFor="avatar" className="text-sm font-medium">
            Profile Picture
          </label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800 dark:bg-black"
          />
        </div>
        <div className="flex flex-col gap-2">
           <button
            formAction={updateAvatar}
            className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Finish Onboarding
          </button>
          <button
            formAction={skipAvatar}
            className="text-sm text-zinc-600 underline dark:text-zinc-400"
          >
            Skip for now
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
}
