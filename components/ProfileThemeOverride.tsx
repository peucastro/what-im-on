'use client';

import { useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { UserPreferences } from '@/utils/themes';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme_id: 'default',
  border_radius: 'low',
  font_family: 'sans',
  pet_id: 'none',
};

export default function ProfileThemeOverride({
  preferences,
}: {
  preferences: UserPreferences | null;
}) {
  const { setOverride } = useTheme();

  useEffect(() => {
    const targetPrefs = preferences || DEFAULT_PREFERENCES;
    setOverride(targetPrefs);

    return () => {
      setOverride(null);
    };
  }, [preferences, setOverride]);

  return null;
}
