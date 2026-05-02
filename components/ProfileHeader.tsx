interface ProfileHeaderProps {
  username: string;
}

export default function ProfileHeader({ username }: ProfileHeaderProps) {
  return (
    <h1 className="text-3xl font-normal text-app-font lowercase border border-app-border p-4 rounded-app bg-app-nav">
      what
      <br />
      <span className="font-semibold font-app">{username}&apos;s</span>
      <br />
      on
    </h1>
  );
}
