export type LayoutId = 'single' | 'strip-3' | 'grid-4';

export interface SlotGeometry {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
}

export interface LayoutDefinition {
  id: LayoutId;
  label: string;
  shotCount: number;
  canvasWidth: number;
  canvasHeight: number;
  padding: number;
  gap: number;
  footerHeight: number;
  slots: SlotGeometry[];
}

export type FramePattern =
  | 'none'
  | 'scalloped-lace'
  | 'strawberry-gingham'
  | 'film-sprocket'
  | 'matcha-botanical'
  | 'midnight-starry'
  | 'sketchbook-doodle';

export interface FrameStyle {
  id: string;
  label: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  slotRadius: number;
  pattern: FramePattern;
}

export type FilterId =
  | 'normal'
  | 'soft-peach'
  | 'disposable-90s'
  | 'crisp-mono'
  | 'matcha-film'
  | 'cyanotype';

export interface FilterCalibration {
  brightness: number;
  contrast: number;
  saturate: number;
  sepia: number;
  grayscale: number;
  hueRotate: number;
  warmth: number;
}

export interface FilterPreset {
  id: FilterId;
  label: string;
  calibration: FilterCalibration;
}

export type StickerCategory =
  | 'expressions'
  | 'sparkles'
  | 'critters'
  | 'arcade'
  | 'stamps'
  | 'doodles';

export interface StickerPath {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface StickerDef {
  id: string;
  label: string;
  category: StickerCategory;
  viewBox: string;
  paths: StickerPath[];
}

export interface PlacedSticker {
  instanceId: string;
  stickerId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface CapturedFrame {
  slotIndex: number;
  dataUrl: string;
  width: number;
  height: number;
  capturedAt: number;
}

export type ExportFormat = 'jpeg' | 'png';
export type ThemeMode =
  | 'light'
  | 'dark'
  | 'pink-neko'
  | 'midnight-arcade'
  | 'matcha-cream'
  | 'lavender-soda';
export type StorageMode = 'indexeddb' | 'memory-fallback';

export interface BoothSettings {
  exportFormat: ExportFormat;
  jpegQuality: number;
  theme: ThemeMode;
  countdownSeconds: number;
  mirrorCamera: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  ttlMs: number;
  selectedDeviceId: string | null;
}

export interface SessionRecord {
  id: 'current';
  layoutId: LayoutId;
  frames: CapturedFrame[];
  filterId: FilterId;
  calibration: FilterCalibration;
  frameId: string;
  footerText: string;
  showDate: boolean;
  stickers: PlacedSticker[];
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
}
