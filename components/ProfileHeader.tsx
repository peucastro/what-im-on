interface ProfileHeaderProps {
  username: string;
}

export default function ProfileHeader({ username }: ProfileHeaderProps) {
  return (
    <h1 className="text-3xl font-normal text-black lowercase">
      what
      <br />
      <span className="font-semibold">{username}&apos;s</span>
      <br />
      on
    </h1>
  );
}
