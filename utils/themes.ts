export type BorderRadius = 'none' | 'low' | 'medium';
export type FontFamily = 'mono' | 'pixel' | 'serif' | 'sans' | 'comic';

export interface UserPreferences {
  theme_id: string;
  border_radius: BorderRadius;
  font_family: FontFamily;
  pet_id: string;
}

export interface ThemeColors {
  border: string;
  headerImage: string;
  font: string;
  accent: string;
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
      headerImage: 'url("/assets/headers/default.png")',
      font: '#1a202c',
      accent: '#000000',
      overlay: 'url("/assets/overlays/subtle-noise.png")',
      navBackground: '#ffffff',
      pageBackground: '#f7fafc',
    },
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    colors: {
      border: '#2d3748',
      headerImage: 'url("/assets/headers/forest.png")',
      font: '#f7fafc',
      accent: '#48bb78',
      overlay: 'url("/assets/overlays/leaves.png")',
      navBackground: '#1a202c',
      pageBackground: '#2d3748',
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
  serif: 'ui-serif, "Times New Roman", Times, serif',
  comic: '"Comic Sans MS", "Comic Sans", cursive',
};

export const THEME_CACHE_KEY = 'app-theme-preferences';
