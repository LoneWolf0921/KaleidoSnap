import type { FrameStyle, LayoutDefinition, LayoutId, SlotGeometry } from '../types/booth';

interface GridLayoutSpec {
  id: LayoutId;
  label: string;
  canvasWidth: number;
  canvasHeight: number;
  cols: number;
  rows: number;
  padding: number;
  gap: number;
  footerHeight: number;
  slotRadius: number;
}

function createStripLayout(spec: GridLayoutSpec): LayoutDefinition {
  const usableWidth = spec.canvasWidth - spec.padding * 2 - spec.gap * (spec.cols - 1);
  const usableHeight =
    spec.canvasHeight - spec.padding * 2 - spec.footerHeight - spec.gap * (spec.rows - 1);
  const slotW = Math.floor(usableWidth / spec.cols);
  const slotH = Math.floor(usableHeight / spec.rows);

  const slots: SlotGeometry[] = [];
  for (let row = 0; row < spec.rows; row++) {
    for (let col = 0; col < spec.cols; col++) {
      slots.push({
        index: row * spec.cols + col,
        x: spec.padding + col * (slotW + spec.gap),
        y: spec.padding + row * (slotH + spec.gap),
        width: slotW,
        height: slotH,
        borderRadius: spec.slotRadius,
      });
    }
  }

  return {
    id: spec.id,
    label: spec.label,
    shotCount: spec.cols * spec.rows,
    canvasWidth: spec.canvasWidth,
    canvasHeight: spec.canvasHeight,
    padding: spec.padding,
    gap: spec.gap,
    footerHeight: spec.footerHeight,
    slots,
  };
}

export const LAYOUTS: Record<LayoutId, LayoutDefinition> = {
  single: createStripLayout({
    id: 'single',
    label: 'Single (1×1)',
    canvasWidth: 1200,
    canvasHeight: 1600,
    cols: 1,
    rows: 1,
    padding: 72,
    gap: 0,
    footerHeight: 190,
    slotRadius: 24,
  }),
  'strip-3': createStripLayout({
    id: 'strip-3',
    label: 'Strip (1×3)',
    canvasWidth: 1200,
    canvasHeight: 3600,
    cols: 1,
    rows: 3,
    padding: 90,
    gap: 54,
    footerHeight: 280,
    slotRadius: 20,
  }),
  'grid-4': createStripLayout({
    id: 'grid-4',
    label: 'Grid (2×2)',
    canvasWidth: 1800,
    canvasHeight: 2400,
    cols: 2,
    rows: 2,
    padding: 90,
    gap: 54,
    footerHeight: 230,
    slotRadius: 24,
  }),
};

export const LAYOUT_LIST: LayoutDefinition[] = [
  LAYOUTS.single,
  LAYOUTS['strip-3'],
  LAYOUTS['grid-4'],
];

export const FRAME_PRESETS: FrameStyle[] = [
  {
    id: 'classic-white',
    label: 'Classic White',
    backgroundColor: '#FFFFFF',
    textColor: '#1C1917',
    accentColor: '#D6D3D1',
    slotRadius: 16,
    pattern: 'none',
  },
  {
    id: 'photo-black',
    label: 'Photo Black',
    backgroundColor: '#141414',
    textColor: '#F5F5F4',
    accentColor: '#44403C',
    slotRadius: 12,
    pattern: 'none',
  },
  {
    id: 'scalloped-lace',
    label: 'Scalloped Lace',
    backgroundColor: '#FFF7EE',
    textColor: '#5B3A29',
    accentColor: '#E7B89D',
    slotRadius: 22,
    pattern: 'scalloped-lace',
  },
  {
    id: 'strawberry-gingham',
    label: 'Gingham Check',
    backgroundColor: '#FFF1F5',
    textColor: '#831843',
    accentColor: '#F472B6',
    slotRadius: 18,
    pattern: 'strawberry-gingham',
  },
  {
    id: 'film-sprocket',
    label: '90s Film',
    backgroundColor: '#1B1917',
    textColor: '#FDE68A',
    accentColor: '#E7E5E4',
    slotRadius: 8,
    pattern: 'film-sprocket',
  },
  {
    id: 'matcha-botanical',
    label: 'Botanical Leaf',
    backgroundColor: '#F2F6EC',
    textColor: '#27401A',
    accentColor: '#84A955',
    slotRadius: 22,
    pattern: 'matcha-botanical',
  },
  {
    id: 'midnight-starry',
    label: 'Starry Night',
    backgroundColor: '#141736',
    textColor: '#F8FAFC',
    accentColor: '#FDE047',
    slotRadius: 18,
    pattern: 'midnight-starry',
  },
  {
    id: 'sketchbook-doodle',
    label: 'Notebook Doodle',
    backgroundColor: '#FAF8F2',
    textColor: '#1E293B',
    accentColor: '#60A5FA',
    slotRadius: 14,
    pattern: 'sketchbook-doodle',
  },
];

export function getFrameById(frameId: string): FrameStyle {
  return FRAME_PRESETS.find((f) => f.id === frameId) ?? FRAME_PRESETS[0];
}
