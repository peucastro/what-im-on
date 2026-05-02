import VibeEditor from './VibeEditor';

interface ProfileHeaderProps {
  username: string;
  isOwner?: boolean;
}

export default function ProfileHeader({ username, isOwner }: ProfileHeaderProps) {
  return (
    <div className="relative group">
      <h1 className="text-xl font-normal text-app-font lowercase border border-app-border sm:p-4 px-4 py-8 rounded-app bg-app-nav font-sans">
        what
        <br />
        <span className="font-semibold font-app">{username}&apos;s</span>
        <br />
        on
      </h1>
      
      {isOwner && (
        <div className="absolute top-4 right-4">
          <VibeEditor />
        </div>
      )}
    </div>
  );
}
