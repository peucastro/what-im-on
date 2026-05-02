'use client';

import Image from 'next/image';
import VibeEditor from './VibeEditor';
import { useTheme } from './ThemeProvider';

interface ProfileHeaderProps {
  username: string;
  isOwner?: boolean;
}

export default function ProfileHeader({ username, isOwner }: ProfileHeaderProps) {
  const { preferences } = useTheme();

  return (
    <div className="relative group">
      <h1 className="text-xl font-normal text-app-font border border-app-border sm:p-4 p-4 bg-app-nav font-sans">
        <span className="lowercase">what</span>
        <br />
        <span className="font-semibold font-app">{username}&apos;s</span>
        <br />
        <span className="lowercase">on</span>
      </h1>

      {/* Vibe Editor at the top */}
      <div className="absolute top-4 right-4">{isOwner && <VibeEditor />}</div>

      {/* Pet at the bottom */}
      {preferences.pet_id !== 'none' && (
        <div className="absolute top-16 right-20 pointer-events-none">
          <Image
            src={`/assets/pets/${preferences.pet_id}.gif`}
            alt="pet"
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
            unoptimized
          />
        </div>
      )}
    </div>
  );
}
