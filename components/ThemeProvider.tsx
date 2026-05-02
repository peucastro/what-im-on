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
  activePreferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  setOverride: (prefs: UserPreferences | null) => void;
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

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(THEME_CACHE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error('Failed to parse cached theme', e);
        }
      }
    }
    return serverPreferences;
  });

  const [override, setOverride] = useState<UserPreferences | null>(null);

  // Sync with server preferences when they change (e.g. login/logout)
  const [prevServerPreferences, setPrevServerPreferences] = useState(serverPreferences);
  if (serverPreferences !== prevServerPreferences) {
    setPrevServerPreferences(serverPreferences);
    setPreferences(serverPreferences);
  }

  // Persist to localStorage whenever preferences change (only if no override)
  useEffect(() => {
    if (!override) {
      localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(preferences));
    }
  }, [preferences, override]);

  // Compute active preferences based on current page/override
  const activePreferences = useMemo(() => {
    if (override) return override;
    if (isHomePage) return DEFAULT_PREFERENCES;
    return preferences;
  }, [isHomePage, preferences, override]);

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
    <ThemeContext.Provider value={{ preferences, activePreferences, setPreferences, setOverride }}>
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
