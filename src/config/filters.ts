import type { FilterCalibration, FilterId, FilterPreset } from '../types/booth';

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'normal',
    label: 'Natural',
    calibration: {
      brightness: 1,
      contrast: 1,
      saturate: 1,
      sepia: 0,
      grayscale: 0,
      hueRotate: 0,
      warmth: 0,
    },
  },
  {
    id: 'soft-peach',
    label: 'Soft Peach Glow',
    calibration: {
      brightness: 1.07,
      contrast: 0.96,
      saturate: 1.12,
      sepia: 0.14,
      grayscale: 0,
      hueRotate: -5,
      warmth: 0.24,
    },
  },
  {
    id: 'disposable-90s',
    label: '90s Disposable',
    calibration: {
      brightness: 1.03,
      contrast: 1.14,
      saturate: 0.92,
      sepia: 0.24,
      grayscale: 0,
      hueRotate: -3,
      warmth: 0.2,
    },
  },
  {
    id: 'crisp-mono',
    label: 'Crisp Mono',
    calibration: {
      brightness: 1.04,
      contrast: 1.24,
      saturate: 0,
      sepia: 0,
      grayscale: 1,
      hueRotate: 0,
      warmth: 0,
    },
  },
  {
    id: 'matcha-film',
    label: 'Matcha Film',
    calibration: {
      brightness: 1.04,
      contrast: 1.04,
      saturate: 0.9,
      sepia: 0.08,
      grayscale: 0,
      hueRotate: 14,
      warmth: -0.1,
    },
  },
  {
    id: 'cyanotype',
    label: 'Midnight Cyanotype',
    calibration: {
      brightness: 0.98,
      contrast: 1.2,
      saturate: 0.2,
      sepia: 0,
      grayscale: 0.85,
      hueRotate: 0,
      warmth: -0.32,
    },
  },
];

export function getFilterPreset(filterId: FilterId | string): FilterPreset {
  return FILTER_PRESETS.find((f) => f.id === filterId) ?? FILTER_PRESETS[0];
}

export function buildCssFilterString(cal: FilterCalibration): string {
  return [
    `brightness(${cal.brightness.toFixed(2)})`,
    `contrast(${cal.contrast.toFixed(2)})`,
    `saturate(${cal.saturate.toFixed(2)})`,
    `sepia(${cal.sepia.toFixed(2)})`,
    `grayscale(${cal.grayscale.toFixed(2)})`,
    `hue-rotate(${cal.hueRotate.toFixed(0)}deg)`,
  ].join(' ');
}

export function getWarmthOverlayColor(warmth: number): string | null {
  if (Math.abs(warmth) < 0.01) return null;
  if (warmth > 0) {
    return `rgba(255, 165, 110, ${Math.min(0.45, warmth * 0.55).toFixed(3)})`;
  }
  return `rgba(75, 155, 225, ${Math.min(0.45, Math.abs(warmth) * 0.55).toFixed(3)})`;
}
