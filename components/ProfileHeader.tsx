interface ProfileHeaderProps {
  username: string;
}

export default function ProfileHeader({ username }: ProfileHeaderProps) {
  return <h1 className="text-3xl font-bold text-black lowercase">what {username}&apos;s on</h1>;
}
