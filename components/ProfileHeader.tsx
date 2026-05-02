'use client';

import VibeEditor from './VibeEditor';
import { useTheme } from './ThemeProvider';

import { UserPreferences } from '@/utils/themes';

interface ProfileHeaderProps {
  username: string;
  isOwner?: boolean;
  preferences?: UserPreferences | null;
}

export default function ProfileHeader({ username, isOwner, preferences: propPreferences }: ProfileHeaderProps) {
  const { activePreferences: globalActivePreferences } = useTheme();
  
  // Prioritize propPreferences (from SSR) over global context (client-side override)
  const activePreferences = propPreferences || globalActivePreferences;

  const petPath = `/assets/pets/${activePreferences.pet_id}.gif`;

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
      {activePreferences.pet_id !== 'none' && (
        <div className="absolute top-16 right-20 pointer-events-none">
          <img
            src={`/assets/pets/${activePreferences.pet_id}.gif`}
            alt="pet"
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
          />
        </div>
      )}
    </div>
  );
}
