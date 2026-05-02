'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  THEMES, 
  BORDER_RADIUS_MAP, 
  FONT_FAMILY_MAP, 
  UserPreferences,
  THEME_CACHE_KEY
} from '@/utils/themes';

interface ThemeContextType {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  preferences: serverPreferences 
}: { 
  children: React.ReactNode;
  preferences: UserPreferences;
}) {
  // Initialize with server preferences, but try to load from cache immediately to avoid flash
  const [preferences, setPreferences] = useState<UserPreferences>(serverPreferences);

  // 1. On mount, check if we have a fresher version in localStorage
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

  // 2. If server preferences change (e.g. after a hard refresh or navigation), sync them
  // but only if they are different to avoid unnecessary loops
  useEffect(() => {
    setPreferences(serverPreferences);
    localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(serverPreferences));
  }, [serverPreferences]);

  const theme = useMemo(() => THEMES[preferences.theme_id] || THEMES.default, [preferences.theme_id]);

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
    root.style.setProperty('--app-radius', BORDER_RADIUS_MAP[preferences.border_radius]);
    root.style.setProperty('--app-font-family', FONT_FAMILY_MAP[preferences.font_family]);
    
  }, [theme, preferences]);

  return (
    <ThemeContext.Provider value={{ preferences, setPreferences }}>
      <div className="app-overlay" />
      {children}
      {preferences.pet_id !== 'none' && (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
          <img 
            src={`/assets/pets/${preferences.pet_id}.gif`} 
            alt="pet" 
            className="w-16 h-16"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
      )}
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
