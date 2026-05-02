'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  THEMES,
  BORDER_RADIUS_MAP,
  FONT_FAMILY_MAP,
  UserPreferences,
  THEME_CACHE_KEY,
} from '@/utils/themes';

interface ThemeContextType {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_PREFERENCES: UserPreferences = {
  theme_id: 'default',
  border_radius: 'low',
  font_family: 'sans',
  pet_id: 'none',
};

export function ThemeProvider({
  children,
  preferences: serverPreferences,
}: {
  children: React.ReactNode;
  preferences: UserPreferences;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [preferences, setPreferences] = useState<UserPreferences>(serverPreferences);

  // Sync with server preferences
  useEffect(() => {
    setPreferences(serverPreferences);
    localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(serverPreferences));
  }, [serverPreferences]);

  // Load from cache on mount
  useEffect(() => {
    const cached = localStorage.getItem(THEME_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPreferences(parsed);
      } catch (e) {
        console.error('Failed to parse cached theme', e);
      }
    }
  }, []);

  // Compute active preferences based on current page
  const activePreferences = useMemo(() => {
    return isHomePage ? DEFAULT_PREFERENCES : preferences;
  }, [isHomePage, preferences]);

  const theme = useMemo(() => {
    return THEMES[activePreferences.theme_id] || THEMES.default;
  }, [activePreferences.theme_id]);

  useEffect(() => {
    const root = document.documentElement;

    // Apply Theme Colors
    root.style.setProperty('--app-border', theme.colors.border);
    root.style.setProperty('--app-font', theme.colors.font);
    root.style.setProperty('--app-accent', theme.colors.accent);
    root.style.setProperty('--app-nav', theme.colors.navBackground);
    root.style.setProperty('--app-header-image', theme.colors.headerImage);
    root.style.setProperty('--app-overlay-image', theme.colors.overlay);
    root.style.setProperty('--app-page-background', theme.colors.pageBackground);

    // Apply Overrides
    root.style.setProperty('--app-radius', BORDER_RADIUS_MAP[activePreferences.border_radius]);
    root.style.setProperty('--app-font-family', FONT_FAMILY_MAP[activePreferences.font_family]);
  }, [theme, activePreferences]);

  return (
    <ThemeContext.Provider value={{ preferences, setPreferences }}>
      <div className="app-overlay" />
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
