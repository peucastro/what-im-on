'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import VibeEditor from './VibeEditor';
import { useTheme } from './ThemeProvider';
import { UserPreferences } from '@/utils/themes';

interface ProfileHeaderProps {
  username: string;
  isOwner?: boolean;
  preferences?: UserPreferences | null;
}

export default function ProfileHeader({
  username,
  isOwner,
  preferences: propPreferences,
}: ProfileHeaderProps) {
  const { activePreferences: globalActivePreferences } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // During SSR and initial hydration, we MUST use propPreferences or the default global context
  // to match what the server sent. Only after mounting do we enable live 'optimistic' updates for owners.
  const activePreferences =
    isOwner && isMounted ? globalActivePreferences : propPreferences || globalActivePreferences;

  return (
    <div className="relative group">
      <h1 className="text-xl font-normal text-app-font outline outline-app-border border-0 sm:p-4 p-4 bg-profile-header font-sans">
        <span className="lowercase">what</span>
        <br />
        <span className="font-semibold font-app">{username}&apos;s</span>
        <br />
        <span className="lowercase">on</span>
      </h1>

      {/* Vibe Editor at the top */}
      <div className="absolute top-4 right-4 z-50">{isOwner && <VibeEditor />}</div>

      {/* Pet at the bottom */}
      {activePreferences.pet_id !== 'none' && (
        <div className="absolute top-16 right-14 pointer-events-none z-20">
          <Image
            src={`/assets/pets/${activePreferences.pet_id}.gif`}
            alt="pet"
            width={64}
            height={64}
            unoptimized
            className="w-16 h-16 object-contain"
          />
        </div>
      )}

      {/* Overlay */}
      {activePreferences.overlay_id && activePreferences.overlay_id !== 'none' && (
        <div className="absolute top-0 right-0 pointer-events-none z-10">
          <Image
            src={`/assets/overlays/${activePreferences.overlay_id}.png`}
            alt="overlay"
            width={160}
            height={160}
            className="w-40 h-40 object-contain opacity-80"
          />
        </div>
      )}
    </div>
  );
}
