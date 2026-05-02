'use client';

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { 
  THEMES, 
  BORDER_RADIUS_MAP, 
  FONT_FAMILY_MAP, 
  BorderRadius, 
  FontFamily,
  UserPreferences
} from '@/utils/themes';

interface ThemeContextType {
  preferences: UserPreferences;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  preferences 
}: { 
  children: React.ReactNode;
  preferences: UserPreferences;
}) {
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
    <ThemeContext.Provider value={{ preferences }}>
      {/* The overlay is rendered here so it stays on top of everything */}
      <div className="app-overlay" />
      {children}
      {/* The pet would be rendered here or somewhere else depending on logic */}
      {preferences.pet_id !== 'none' && (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
          {/* Pet implementation will go here when gifs are provided */}
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
