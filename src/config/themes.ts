import type { ThemeMode } from '../types/booth';

export interface AppThemeOption {
  id: ThemeMode;
  label: string;
  isDark: boolean;
  swatches: [string, string, string];
}

export const APP_THEMES: AppThemeOption[] = [
  {
    id: 'light',
    label: 'Light Paper',
    isDark: false,
    swatches: ['#f5f2eb', '#faf8f4', '#d9381e'],
  },
  {
    id: 'dark',
    label: 'Dark Studio',
    isDark: true,
    swatches: ['#131210', '#1c1a17', '#e84a30'],
  },
  {
    id: 'pink-neko',
    label: 'Pink Neko',
    isDark: false,
    swatches: ['#fff3f8', '#ffffff', '#ec4899'],
  },
  {
    id: 'midnight-arcade',
    label: 'Midnight Arcade',
    isDark: true,
    swatches: ['#110e24', '#1b1638', '#22d3ee'],
  },
  {
    id: 'matcha-cream',
    label: 'Matcha Cream',
    isDark: false,
    swatches: ['#f4f7ee', '#ffffff', '#5a8f14'],
  },
  {
    id: 'lavender-soda',
    label: 'Lavender Soda',
    isDark: false,
    swatches: ['#f5f2ff', '#ffffff', '#7c3aed'],
  },
];

export function resolveThemeState(
  theme: ThemeMode | string
): { dataTheme: ThemeMode; isDark: boolean } {
  const normalized = theme === 'strawberry-milk' ? 'pink-neko' : theme;
  const match = APP_THEMES.find((t) => t.id === normalized) ?? APP_THEMES[0];
  return {
    dataTheme: match.id,
    isDark: match.isDark,
  };
}
