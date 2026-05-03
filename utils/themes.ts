export type BorderRadius = 'none' | 'low' | 'medium';
export type FontFamily = 'mono' | 'pixel' | 'serif' | 'sans' | 'comic';

export interface UserPreferences {
  theme_id: string;
  border_radius: BorderRadius;
  font_family: FontFamily;
  pet_id: string;
  overlay_id: string;
}

export interface ThemeColors {
  border: string;
  headerImage: string;
  headerBackground: string;
  profileBackground: string;
  font: string;
  accent: string;
  secondaryAccent: string;
  overlay: string;
  navBackground: string;
  pageBackground: string; // Image URL or color
}

export interface ThemeDefinition {
  id: string;
  name: string;
  colors: ThemeColors;
}

export const THEMES: Record<string, ThemeDefinition> = {
  default: {
    id: 'default',
    name: 'Default',
    colors: {
      border: '#e2e8f0',
      headerImage: 'none',
      headerBackground: '#ffffff',
      profileBackground: '#ffffff',
      font: '#000000',
      accent: '#000000',
      secondaryAccent: '#4a5568',
      overlay: 'none',
      navBackground: '#ffffff',
      pageBackground: '#eeeeee',
    },
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    colors: {
      border: '#2d3748',
      headerImage: 'none',
      headerBackground: '#1a202c',
      profileBackground: '#1a202c',
      font: '#f7fafc',
      accent: '#48bb78',
      secondaryAccent: '#38a169',
      overlay: 'none',
      navBackground: '#1a202c',
      pageBackground: '#2d3748',
    },
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    colors: {
      border: '#C97C00',
      headerImage: 'none',
      headerBackground: '#000000',
      profileBackground: '#000000',
      font: '#C97C00',
      accent: '#C97C00',
      secondaryAccent: '#000000',
      overlay: 'none',
      navBackground: '#000000',
      pageBackground: '#000000',
    },
  },
  steam: {
    id: 'steam',
    name: 'Steam 2005',
    colors: {
      border: '#535353',
      headerImage: 'none',
      headerBackground: '#000000',
      profileBackground: '#282828',
      font: '#eeeeee',
      accent: '#2F322E',
      secondaryAccent: '#2F322E',
      overlay: 'none',
      navBackground: '#282828',
      pageBackground: '#4C5844',
    },
  },
  pink: {
    id: 'pink',
    name: 'Pink',
    colors: {
      border: '#CCCCCC',
      headerImage: 'none',
      headerBackground: '#FB77D8',
      profileBackground: '#FB77D8',
      font: '#000000',
      accent: '#FB77D8',
      secondaryAccent: '#FB77D8',
      overlay: 'none',
      navBackground: '#ffffff',
      pageBackground: '#FFDDF6',
    },
  },
};

export const BORDER_RADIUS_MAP: Record<BorderRadius, string> = {
  none: '0px',
  low: '4px',
  medium: '12px',
};

export const FONT_FAMILY_MAP: Record<FontFamily, string> = {
  sans: 'var(--font-geist-sans), ui-sans-serif, system-ui',
  mono: 'var(--font-geist-mono), ui-monospace, SFMono-Regular',
  pixel: 'var(--font-pixel), cursive',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  comic: '"Comic Sans MS", "Comic Sans", cursive',
};

export const THEME_CACHE_KEY = 'app-theme-preferences';
