import type { StickerCategory, StickerDef } from '../types/booth';
import { STICKERS_V2 } from './stickersV2';

export const STICKER_CATEGORIES: { id: 'all' | StickerCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'props', label: 'Props' },
  { id: 'food', label: 'Food' },
  { id: 'y2k', label: 'Y2K' },
  { id: 'nature', label: 'Nature' },
  { id: 'scrapbook', label: 'Scrapbook' },
  { id: 'expressions', label: 'Expressions' },
  { id: 'doodles', label: 'Doodles' },
  { id: 'sparkles', label: 'Sparkles' },
  { id: 'critters', label: 'Critters' },
  { id: 'arcade', label: 'Arcade' },
  { id: 'stamps', label: 'Stamps' },
];

const STICKERS_V1: StickerDef[] = [
  // ── Manga & Doodle Expressions (10) ──────────────────────────────────────
  {
    id: 'shock-aura',
    label: 'Shock Lines',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M50 6 L53 26 M72 12 L62 29 M88 28 L70 38 M94 50 L74 50 M88 72 L70 62 M72 88 L62 71 M50 94 L47 74 M28 88 L38 71 M12 72 L30 62 M6 50 L26 50 M12 28 L30 38 M28 12 L38 29',
        fill: 'none',
        stroke: '#1E293B',
        strokeWidth: 4.5,
      },
      {
        d: 'M61 8 L57 22 M84 20 L73 30 M92 61 L78 57 M39 92 L43 78 M16 80 L27 70 M8 39 L22 43',
        fill: 'none',
        stroke: '#FACC15',
        strokeWidth: 3,
      },
    ],
  },
  {
    id: 'sweat-drop',
    label: 'Sweat Drop',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M50 10 C64 34 78 52 78 66 C78 81 65 92 50 92 C35 92 22 81 22 66 C22 52 36 34 50 10 Z',
        fill: '#38BDF8',
        stroke: '#0369A1',
        strokeWidth: 4,
      },
      {
        d: 'M38 56 C34 64 36 74 44 78',
        fill: 'none',
        stroke: '#E0F2FE',
        strokeWidth: 5,
      },
      {
        d: 'M46 38 A3.5 3.5 0 1 1 45.9 38 Z',
        fill: '#FFFFFF',
      },
    ],
  },
  {
    id: 'angry-vein',
    label: 'Angry Pop',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M18 42 Q40 42 42 18 M58 18 Q60 42 82 42 M82 58 Q60 60 58 82 M42 82 Q40 60 18 58',
        fill: 'none',
        stroke: '#EF4444',
        strokeWidth: 7,
      },
      {
        d: 'M18 42 Q40 42 42 18 M58 18 Q60 42 82 42 M82 58 Q60 60 58 82 M42 82 Q40 60 18 58',
        fill: 'none',
        stroke: '#FEE2E2',
        strokeWidth: 2,
      },
    ],
  },
  {
    id: 'sparkle-eyes',
    label: 'Sparkle Eyes',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M28 24 L33 44 L48 50 L33 56 L28 76 L23 56 L8 50 L23 44 Z',
        fill: '#FDE047',
        stroke: '#1E1B4B',
        strokeWidth: 3.5,
      },
      {
        d: 'M72 24 L77 44 L92 50 L77 56 L72 76 L67 56 L52 50 L67 44 Z',
        fill: '#FDE047',
        stroke: '#1E1B4B',
        strokeWidth: 3.5,
      },
      {
        d: 'M19 36 A3 3 0 1 1 18.9 36 Z M63 36 A3 3 0 1 1 62.9 36 Z',
        fill: '#FFFFFF',
      },
    ],
  },
  {
    id: 'heart-eyes',
    label: 'Heart Eyes',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M27 72 C12 60 8 50 8 41 C8 33 14 28 20 28 C24 28 26 31 27 34 C28 31 30 28 34 28 C40 28 46 33 46 41 C46 50 42 60 27 72 Z',
        fill: '#F43F5E',
        stroke: '#9F1239',
        strokeWidth: 3.5,
      },
      {
        d: 'M73 72 C58 60 54 50 54 41 C54 33 60 28 66 28 C70 28 72 31 73 34 C74 31 76 28 80 28 C86 28 92 33 92 41 C92 50 88 60 73 72 Z',
        fill: '#F43F5E',
        stroke: '#9F1239',
        strokeWidth: 3.5,
      },
      {
        d: 'M16 37 C17 34 20 33 22 34 M62 37 C63 34 66 33 68 34',
        fill: 'none',
        stroke: '#FFE4E6',
        strokeWidth: 3,
      },
    ],
  },
  {
    id: 'shy-blush',
    label: 'Shy Blush',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M24 40 A16 10 0 1 1 23.9 40 Z M76 40 A16 10 0 1 1 75.9 40 Z',
        fill: '#FDA4AF',
        opacity: 0.78,
      },
      {
        d: 'M14 48 L20 56 M22 47 L28 56 M30 48 L36 56 M64 48 L70 56 M72 47 L78 56 M80 48 L86 56',
        fill: 'none',
        stroke: '#E11D48',
        strokeWidth: 3,
      },
    ],
  },
  {
    id: 'tears-of-joy',
    label: 'Joy Tears',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M32 32 C22 44 10 56 12 70 C14 78 24 80 28 72 C32 62 34 46 32 32 Z',
        fill: '#60A5FA',
        stroke: '#1D4ED8',
        strokeWidth: 3.5,
      },
      {
        d: 'M68 32 C78 44 90 56 88 70 C86 78 76 80 72 72 C68 62 66 46 68 32 Z',
        fill: '#60A5FA',
        stroke: '#1D4ED8',
        strokeWidth: 3.5,
      },
      {
        d: 'M18 60 L20 68 M82 60 L80 68',
        fill: 'none',
        stroke: '#DBEAFE',
        strokeWidth: 3,
      },
    ],
  },
  {
    id: 'dizzy-spirals',
    label: 'Dizzy Eyes',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M28 50 C28 46 32 46 32 50 C32 56 22 56 22 49 C22 40 36 40 36 50 C36 62 16 62 16 49 C16 34 42 34 42 50',
        fill: 'none',
        stroke: '#1E293B',
        strokeWidth: 3.8,
      },
      {
        d: 'M72 50 C72 46 76 46 76 50 C76 56 66 56 66 49 C66 40 80 40 80 50 C80 62 60 62 60 49 C60 34 86 34 86 50',
        fill: 'none',
        stroke: '#1E293B',
        strokeWidth: 3.8,
      },
    ],
  },
  {
    id: 'cat-whiskers',
    label: 'Whiskers',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M45 46 H55 L50 53 Z',
        fill: '#FB7185',
        stroke: '#9F1239',
        strokeWidth: 2.5,
      },
      {
        d: 'M38 58 Q44 65 50 57 Q56 65 62 58',
        fill: 'none',
        stroke: '#1E293B',
        strokeWidth: 3.5,
      },
      {
        d: 'M30 46 L8 40 M30 53 L6 54 M30 60 L10 68 M70 46 L92 40 M70 53 L94 54 M70 60 L90 68',
        fill: 'none',
        stroke: '#1E293B',
        strokeWidth: 3.5,
      },
    ],
  },
  {
    id: 'goofy-mustache',
    label: 'Stache & Shades',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M12 28 H44 L40 46 Q26 52 14 42 Z M56 28 H88 L86 42 Q74 52 60 46 Z',
        fill: '#0F172A',
        stroke: '#38BDF8',
        strokeWidth: 3.5,
      },
      {
        d: 'M44 32 H56',
        fill: 'none',
        stroke: '#38BDF8',
        strokeWidth: 3.5,
      },
      {
        d: 'M50 62 C40 54 28 60 22 68 C16 74 8 70 12 62 C10 76 26 84 40 76 C45 73 48 69 50 67 C52 69 55 73 60 76 C74 84 90 76 88 62 C92 70 84 74 78 68 C72 60 60 54 50 62 Z',
        fill: '#78350F',
        stroke: '#451A03',
        strokeWidth: 3,
      },
    ],
  },
  // ── Sparkles & Ribbons (7) ───────────────────────────────────────────────
  {
    id: 'star',
    label: 'Star',
    category: 'sparkles',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M50 6 L62 35 L94 38 L70 59 L77 91 L50 74 L23 91 L30 59 L6 38 L38 35 Z',
        fill: '#FACC15',
        stroke: '#CA8A04',
        strokeWidth: 4,
      },
    ],
  },
  {
    id: 'sparkle',
    label: 'Sparkle',
    category: 'sparkles',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M50 8 C54 36 64 46 92 50 C64 54 54 64 50 92 C46 64 36 54 8 50 C36 46 46 36 50 8 Z',
        fill: '#FDE047',
        stroke: '#EAB308',
        strokeWidth: 3,
      },
      {
        d: 'M80 14 C82 22 85 25 93 27 C85 29 82 32 80 40 C78 32 75 29 67 27 C75 25 78 22 80 14 Z',
        fill: '#F9A8D4',
        stroke: '#DB2777',
        strokeWidth: 2,
      },
    ],
  },
  {
    id: 'heart',
    label: 'Heart',
    category: 'sparkles',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M50 86 C20 66 8 48 8 31 C8 17 19 8 32 8 C41 8 47 13 50 20 C53 13 59 8 68 8 C81 8 92 17 92 31 C92 48 80 66 50 86 Z',
        fill: '#F43F5E',
        stroke: '#BE123C',
        strokeWidth: 4,
      },
      {
        d: 'M24 24 C24 18 30 15 35 17',
        fill: 'none',
        stroke: '#FFE4E6',
        strokeWidth: 4,
      },
    ],
  },
  {
    id: 'ribbon',
    label: 'Ribbon',
    category: 'sparkles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M48 48 L14 26 Q8 50 16 70 Z', fill: '#EC4899', stroke: '#9D174D', strokeWidth: 3 },
      { d: 'M52 48 L86 26 Q92 50 84 70 Z', fill: '#EC4899', stroke: '#9D174D', strokeWidth: 3 },
      {
        d: 'M46 52 L32 86 L44 80 L50 56 L56 80 L68 86 L54 52 Z',
        fill: '#F472B6',
        stroke: '#9D174D',
        strokeWidth: 3,
      },
      { d: 'M50 40 A9 9 0 1 1 49.9 40 Z', fill: '#F9A8D4', stroke: '#9D174D', strokeWidth: 3 },
    ],
  },
  {
    id: 'angel-wings',
    label: 'Wings',
    category: 'sparkles',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M46 56 C30 34 10 24 8 40 C6 50 18 54 14 60 C10 66 22 70 28 66 C26 74 38 76 46 66 Z',
        fill: '#FFFFFF',
        stroke: '#93C5FD',
        strokeWidth: 3.5,
      },
      {
        d: 'M54 56 C70 34 90 24 92 40 C94 50 82 54 86 60 C90 66 78 70 72 66 C74 74 62 76 54 66 Z',
        fill: '#FFFFFF',
        stroke: '#93C5FD',
        strokeWidth: 3.5,
      },
      {
        d: 'M50 22 C40 16 32 22 50 32 C68 22 60 16 50 22 Z',
        fill: '#FDE047',
        stroke: '#EAB308',
        strokeWidth: 2.5,
      },
    ],
  },
  {
    id: 'holo-diamond',
    label: 'Gem',
    category: 'sparkles',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M24 24 H76 L90 44 L50 86 L10 44 Z',
        fill: '#67E8F9',
        stroke: '#0E7490',
        strokeWidth: 3.5,
      },
      {
        d: 'M24 24 L36 44 L50 86 L64 44 L76 24 M10 44 H90',
        fill: 'none',
        stroke: '#CFFAFE',
        strokeWidth: 3,
      },
    ],
  },
  {
    id: 'prism-drop',
    label: 'Prism',
    category: 'sparkles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 10 L88 76 H12 Z', fill: '#E0E7FF', stroke: '#6366F1', strokeWidth: 4 },
      { d: 'M50 10 L66 76 H34 Z', fill: '#C084FC', opacity: 0.45 },
      { d: 'M50 28 L66 56 H34 Z', fill: '#38BDF8', opacity: 0.55 },
    ],
  },

  // ── Kawaii Critters (7) ──────────────────────────────────────────────────
  {
    id: 'puripuri-neko',
    label: 'Neko',
    category: 'critters',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M20 44 L16 14 L40 28 Q50 24 60 28 L84 14 L80 44 C86 64 74 86 50 86 C26 86 14 64 20 44 Z',
        fill: '#FFF1F2',
        stroke: '#BE185D',
        strokeWidth: 3.5,
      },
      { d: 'M22 36 L20 20 L34 29 Z', fill: '#F9A8D4' },
      { d: 'M78 36 L80 20 L66 29 Z', fill: '#F9A8D4' },
      { d: 'M35 50 A5 5 0 1 1 34.9 50 Z M65 50 A5 5 0 1 1 64.9 50 Z', fill: '#1E1B4B' },
      { d: 'M28 60 A6 4 0 1 1 27.9 60 Z M72 60 A6 4 0 1 1 71.9 60 Z', fill: '#FB7185', opacity: 0.5 },
      { d: 'M43 60 Q47 65 50 60 Q53 65 57 60', fill: 'none', stroke: '#BE185D', strokeWidth: 3 },
    ],
  },
  {
    id: 'cat-paws',
    label: 'Paws',
    category: 'critters',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M50 48 C34 48 24 60 26 74 C28 84 40 88 50 88 C60 88 72 84 74 74 C76 60 66 48 50 48 Z',
        fill: '#FDE68A',
        stroke: '#B45309',
        strokeWidth: 3,
      },
      { d: 'M50 60 C40 60 36 68 38 74 C40 79 60 79 62 74 C64 68 60 60 50 60 Z', fill: '#FB7185' },
      { d: 'M25 38 A7 9 0 1 1 24.9 38 Z M42 26 A7 9 0 1 1 41.9 26 Z M58 26 A7 9 0 1 1 57.9 26 Z M75 38 A7 9 0 1 1 74.9 38 Z', fill: '#FB7185', stroke: '#BE123C', strokeWidth: 2 },
    ],
  },
  {
    id: 'bunny-ears',
    label: 'Bunny',
    category: 'critters',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M32 54 C20 20 30 8 40 16 C48 24 44 48 44 54 Z', fill: '#FFFFFF', stroke: '#DB2777', strokeWidth: 3 },
      { d: 'M68 54 C80 20 70 8 60 16 C52 24 56 48 56 54 Z', fill: '#FFFFFF', stroke: '#DB2777', strokeWidth: 3 },
      { d: 'M34 48 C27 26 32 18 37 22 C41 26 39 42 39 48 Z', fill: '#FBCFE8' },
      { d: 'M66 48 C73 26 68 18 63 22 C59 26 61 42 61 48 Z', fill: '#FBCFE8' },
      { d: 'M50 48 C28 48 22 62 24 76 C26 86 74 86 76 76 C78 62 72 48 50 48 Z', fill: '#FFFFFF', stroke: '#DB2777', strokeWidth: 3 },
      { d: 'M39 66 A3.5 4 0 1 1 38.9 66 Z M61 66 A3.5 4 0 1 1 60.9 66 Z', fill: '#1E1B4B' },
      { d: 'M46 73 Q50 77 54 73', fill: 'none', stroke: '#DB2777', strokeWidth: 3 },
    ],
  },
  {
    id: 'frog-buddy',
    label: 'Froggy',
    category: 'critters',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M30 34 A12 12 0 1 1 29.9 34 Z M70 34 A12 12 0 1 1 69.9 34 Z', fill: '#84CC16', stroke: '#3F6212', strokeWidth: 3 },
      { d: 'M50 34 C24 34 14 52 16 68 C18 82 82 82 84 68 C86 52 76 34 50 34 Z', fill: '#A3E635', stroke: '#3F6212', strokeWidth: 3 },
      { d: 'M30 34 A6 6 0 1 1 29.9 34 Z M70 34 A6 6 0 1 1 69.9 34 Z', fill: '#FFFFFF' },
      { d: 'M30 34 A3 3 0 1 1 29.9 34 Z M70 34 A3 3 0 1 1 69.9 34 Z', fill: '#1C1917' },
      { d: 'M34 62 Q50 72 66 62', fill: 'none', stroke: '#3F6212', strokeWidth: 3.5 },
      { d: 'M26 56 A5 3.5 0 1 1 25.9 56 Z M74 56 A5 3.5 0 1 1 73.9 56 Z', fill: '#FDA4AF', opacity: 0.7 },
    ],
  },
  {
    id: 'ghostie',
    label: 'Ghostie',
    category: 'critters',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M50 12 C28 12 18 28 18 52 L18 84 L30 74 L40 84 L50 74 L60 84 L70 74 L82 84 L82 52 C82 28 72 12 50 12 Z',
        fill: '#F8FAFC',
        stroke: '#6366F1',
        strokeWidth: 3.5,
      },
      { d: 'M38 44 A4 5 0 1 1 37.9 44 Z M62 44 A4 5 0 1 1 61.9 44 Z', fill: '#312E81' },
      { d: 'M46 56 A4 5 0 1 1 45.9 56 Z', fill: '#F472B6' },
    ],
  },
  {
    id: 'bear-face',
    label: 'Bear',
    category: 'critters',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M24 28 A12 12 0 1 1 23.9 28 Z M76 28 A12 12 0 1 1 75.9 28 Z', fill: '#D97706', stroke: '#78350F', strokeWidth: 3 },
      { d: 'M50 22 C26 22 14 38 16 60 C18 78 32 86 50 86 C68 86 82 78 84 60 C86 38 74 22 50 22 Z', fill: '#F59E0B', stroke: '#78350F', strokeWidth: 3 },
      { d: 'M50 56 C38 56 32 64 34 72 C36 78 64 78 66 72 C68 64 62 56 50 56 Z', fill: '#FEF3C7' },
      { d: 'M36 46 A4 4.5 0 1 1 35.9 46 Z M64 46 A4 4.5 0 1 1 63.9 46 Z', fill: '#451A03' },
      { d: 'M50 61 A4 3 0 1 1 49.9 61 Z', fill: '#451A03' },
    ],
  },
  {
    id: 'cloud-buddy',
    label: 'Cloud',
    category: 'critters',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M26 74 H74 C86 74 92 64 88 54 C86 46 78 44 74 44 C72 28 58 20 44 24 C34 26 28 34 26 42 C16 42 10 52 12 62 C14 70 20 74 26 74 Z',
        fill: '#E0F2FE',
        stroke: '#0284C7',
        strokeWidth: 3.5,
      },
      { d: 'M40 52 A3.5 4 0 1 1 39.9 52 Z M60 52 A3.5 4 0 1 1 59.9 52 Z', fill: '#0F172A' },
      { d: 'M46 60 Q50 64 54 60', fill: 'none', stroke: '#0F172A', strokeWidth: 3 },
    ],
  },

  // ── Arcade & Y2K Pop (7) ────────────────────────────────────────────────
  {
    id: 'crown',
    label: 'Crown',
    category: 'arcade',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M12 76 L8 28 L33 48 L50 20 L67 48 L92 28 L88 76 Z', fill: '#FBBF24', stroke: '#B45309', strokeWidth: 4 },
      { d: 'M14 78 H86 V86 H14 Z', fill: '#F59E0B', stroke: '#B45309', strokeWidth: 3 },
    ],
  },
  {
    id: 'smile',
    label: 'Smile',
    category: 'arcade',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 8 A42 42 0 1 1 49.9 8 Z', fill: '#FDE047', stroke: '#A16207', strokeWidth: 4 },
      { d: 'M34 38 A4 5 0 1 1 33.9 38 Z M66 38 A4 5 0 1 1 65.9 38 Z', fill: '#1C1917' },
      { d: 'M30 58 Q50 76 70 58', fill: 'none', stroke: '#1C1917', strokeWidth: 5 },
    ],
  },
  {
    id: 'pixel-heart',
    label: '8-Bit',
    category: 'arcade',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M20 24 H40 V34 H60 V24 H80 V34 H90 V54 H80 V64 H70 V74 H60 V84 H40 V74 H30 V64 H20 V54 H10 V34 H20 Z',
        fill: '#FB7185',
        stroke: '#9F1239',
        strokeWidth: 4,
      },
      { d: 'M24 38 H34 V48 H24 Z', fill: '#FFE4E6' },
    ],
  },
  {
    id: 'gamepad',
    label: 'Arcade',
    category: 'arcade',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M24 32 H76 C86 32 92 42 90 62 C88 76 78 78 70 68 L62 58 H38 L30 68 C22 78 12 76 10 62 C8 42 14 32 24 32 Z',
        fill: '#A855F7',
        stroke: '#4C1D95',
        strokeWidth: 3.5,
      },
      { d: 'M24 46 H36 M30 40 V52', fill: 'none', stroke: '#FAF5FF', strokeWidth: 4 },
      { d: 'M68 42 A3.5 3.5 0 1 1 67.9 42 Z M76 50 A3.5 3.5 0 1 1 75.9 50 Z', fill: '#22D3EE' },
    ],
  },
  {
    id: 'lightning',
    label: 'Zap',
    category: 'arcade',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M58 8 L22 54 H48 L40 92 L78 44 H52 Z',
        fill: '#FACC15',
        stroke: '#EA580C',
        strokeWidth: 3.5,
      },
    ],
  },
  {
    id: 'cherry-pair',
    label: 'Cherry',
    category: 'arcade',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M32 62 Q46 24 62 16 Q66 36 70 62', fill: 'none', stroke: '#15803D', strokeWidth: 4 },
      { d: 'M62 16 Q76 14 80 26 Q66 28 62 16 Z', fill: '#4ADE80', stroke: '#15803D', strokeWidth: 2.5 },
      { d: 'M32 56 A17 17 0 1 1 31.9 56 Z M70 56 A17 17 0 1 1 69.9 56 Z', fill: '#E11D48', stroke: '#881337', strokeWidth: 3.5 },
      { d: 'M24 64 A4 4 0 1 1 23.9 64 Z M62 64 A4 4 0 1 1 61.9 64 Z', fill: '#FDA4AF' },
    ],
  },
  {
    id: 'retro-shades',
    label: 'Shades',
    category: 'arcade',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M10 38 H44 L40 62 Q24 68 12 56 Z M56 38 H90 L88 56 Q76 68 60 62 Z',
        fill: '#1E1B4B',
        stroke: '#EC4899',
        strokeWidth: 4,
      },
      { d: 'M44 42 H56', fill: 'none', stroke: '#EC4899', strokeWidth: 4 },
      { d: 'M18 44 L28 54 M64 44 L74 54', fill: 'none', stroke: '#38BDF8', strokeWidth: 3 },
    ],
  },

  // ── Bubbles & Stamps (7) ─────────────────────────────────────────────────
  {
    id: 'tape',
    label: 'Mint Tape',
    category: 'stamps',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M12 34 L88 26 L92 66 L16 74 Z', fill: '#A7F3D0', stroke: '#059669', strokeWidth: 3 },
    ],
  },
  {
    id: 'blush-tape',
    label: 'Pink Tape',
    category: 'stamps',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M10 30 L90 36 L86 72 L14 66 Z', fill: '#FBCFE8', stroke: '#DB2777', strokeWidth: 3 },
      { d: 'M30 42 L34 58 M50 44 L54 60 M70 46 L74 62', fill: 'none', stroke: '#F472B6', strokeWidth: 3 },
    ],
  },
  {
    id: 'kiss-mark',
    label: 'Kiss',
    category: 'stamps',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M14 48 Q32 28 50 40 Q68 28 86 48 Q68 54 50 48 Q32 54 14 48 Z',
        fill: '#F43F5E',
        stroke: '#9F1239',
        strokeWidth: 2.5,
      },
      {
        d: 'M18 52 Q50 82 82 52 Q66 58 50 54 Q34 58 18 52 Z',
        fill: '#E11D48',
        stroke: '#9F1239',
        strokeWidth: 2.5,
      },
    ],
  },
  {
    id: 'speech-heart',
    label: 'Love Note',
    category: 'stamps',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M16 20 H84 Q92 20 92 28 V62 Q92 70 84 70 H42 L26 84 V70 H16 Q8 70 8 62 V28 Q8 20 16 20 Z',
        fill: '#FFF1F2',
        stroke: '#E11D48',
        strokeWidth: 3.5,
      },
      {
        d: 'M50 58 C38 49 34 42 34 36 C34 31 38 28 43 28 C46 28 49 30 50 33 C51 30 54 28 57 28 C62 28 66 31 66 36 C66 42 62 49 50 58 Z',
        fill: '#F43F5E',
      },
    ],
  },
  {
    id: 'burst-badge',
    label: 'Pop Burst',
    category: 'stamps',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M50 6 L60 22 L78 14 L76 32 L94 38 L82 52 L92 68 L74 72 L76 90 L58 82 L50 96 L42 82 L24 90 L26 72 L8 68 L18 52 L6 38 L24 32 L22 14 L40 22 Z',
        fill: '#22D3EE',
        stroke: '#0E7490',
        strokeWidth: 3,
      },
      {
        d: 'M50 32 L54 44 L66 46 L56 54 L59 66 L50 59 L41 66 L44 54 L34 46 L46 44 Z',
        fill: '#FEF08A',
      },
    ],
  },
  {
    id: 'flower-pop',
    label: 'Daisy',
    category: 'stamps',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M50 12 A13 13 0 1 1 49.9 12 Z M76 28 A13 13 0 1 1 75.9 28 Z M76 58 A13 13 0 1 1 75.9 58 Z M50 74 A13 13 0 1 1 49.9 74 Z M24 58 A13 13 0 1 1 23.9 58 Z M24 28 A13 13 0 1 1 23.9 28 Z',
        fill: '#F472B6',
        stroke: '#BE185D',
        strokeWidth: 2.5,
      },
      { d: 'M50 38 A14 14 0 1 1 49.9 38 Z', fill: '#FDE047', stroke: '#CA8A04', strokeWidth: 2.5 },
    ],
  },
  {
    id: 'music-note',
    label: 'Vibe',
    category: 'stamps',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M36 66 V22 L78 14 V58', fill: 'none', stroke: '#7C3AED', strokeWidth: 6 },
      { d: 'M26 62 A12 10 0 1 1 25.9 62 Z M68 54 A12 10 0 1 1 67.9 54 Z', fill: '#A78BFA', stroke: '#5B21B6', strokeWidth: 3 },
    ],
  },

  // ── Quirky Doodles (10) ──────────────────────────────────────────────────
  {
    id: 'sleepy-toast',
    label: 'Toast',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M22 38 C14 26 24 14 50 14 C76 14 86 26 78 38 V80 Q78 86 72 86 H28 Q22 86 22 80 Z',
        fill: '#FDE68A',
        stroke: '#92400E',
        strokeWidth: 4,
      },
      {
        d: 'M29 42 C24 32 32 23 50 23 C68 23 76 32 71 42 V77 H29 Z',
        fill: '#FEF3C7',
      },
      { d: 'M34 50 Q39 54 44 50 M56 50 Q61 54 66 50', fill: 'none', stroke: '#78350F', strokeWidth: 3.5 },
      { d: 'M46 60 Q50 64 54 60', fill: 'none', stroke: '#78350F', strokeWidth: 3 },
      { d: 'M32 58 A4 2.5 0 1 1 31.9 58 Z M68 58 A4 2.5 0 1 1 67.9 58 Z', fill: '#FDA4AF', opacity: 0.7 },
    ],
  },
  {
    id: 'boba-cup',
    label: 'Boba',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M52 10 L60 30', fill: 'none', stroke: '#EC4899', strokeWidth: 6 },
      { d: 'M26 30 H74 L67 86 H33 Z', fill: '#FDE68A', stroke: '#78350F', strokeWidth: 3.5 },
      { d: 'M23 28 H77', fill: 'none', stroke: '#78350F', strokeWidth: 5 },
      { d: 'M40 74 A4.5 4.5 0 1 1 39.9 74 Z M52 76 A4.5 4.5 0 1 1 51.9 76 Z M61 71 A4.5 4.5 0 1 1 60.9 71 Z M46 65 A4 4 0 1 1 45.9 65 Z', fill: '#292524' },
      { d: 'M42 48 A2.5 2.5 0 1 1 41.9 48 Z M58 48 A2.5 2.5 0 1 1 57.9 48 Z', fill: '#451A03' },
      { d: 'M47 54 Q50 57 53 54', fill: 'none', stroke: '#451A03', strokeWidth: 2.5 },
    ],
  },
  {
    id: 'hat-froggy',
    label: 'Doodle Frog',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M30 42 A10 10 0 1 1 29.9 42 Z M70 42 A10 10 0 1 1 69.9 42 Z', fill: '#BEF264', stroke: '#365314', strokeWidth: 3.5 },
      { d: 'M50 40 C26 40 18 56 20 72 C22 86 78 86 80 72 C82 56 74 40 50 40 Z', fill: '#BEF264', stroke: '#365314', strokeWidth: 3.5 },
      { d: 'M36 28 L50 12 L64 28 Z', fill: '#FB7185', stroke: '#9F1239', strokeWidth: 3 },
      { d: 'M50 12 A4 4 0 1 1 49.9 12 Z', fill: '#FDE047', stroke: '#CA8A04', strokeWidth: 2 },
      { d: 'M30 42 A4 4 0 1 1 29.9 42 Z M70 42 A4 4 0 1 1 69.9 42 Z', fill: '#1A2E05' },
      { d: 'M38 64 Q50 72 62 64', fill: 'none', stroke: '#365314', strokeWidth: 3.5 },
    ],
  },
  {
    id: 'wiggly-arrow',
    label: 'Look Here',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M14 76 Q32 42 46 58 T82 22',
        fill: 'none',
        stroke: '#EF4444',
        strokeWidth: 6,
      },
      {
        d: 'M62 20 L84 20 L82 42',
        fill: 'none',
        stroke: '#EF4444',
        strokeWidth: 6,
      },
    ],
  },
  {
    id: 'doodle-crown',
    label: 'Sketch Crown',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M16 74 L12 34 L34 52 L50 22 L66 52 L88 34 L84 74 Z',
        fill: '#FEF08A',
        stroke: '#1E293B',
        strokeWidth: 4.5,
      },
      { d: 'M50 16 A4 4 0 1 1 49.9 16 Z M12 28 A4 4 0 1 1 11.9 28 Z M88 28 A4 4 0 1 1 87.9 28 Z', fill: '#FB7185', stroke: '#1E293B', strokeWidth: 2.5 },
    ],
  },
  {
    id: 'blushing-berry',
    label: 'Berry',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M38 24 L50 12 L62 24 L50 28 Z', fill: '#4ADE80', stroke: '#14532D', strokeWidth: 3 },
      {
        d: 'M50 24 C74 24 84 44 76 66 C68 84 56 88 50 88 C44 88 32 84 24 66 C16 44 26 24 50 24 Z',
        fill: '#FB7185',
        stroke: '#881337',
        strokeWidth: 3.5,
      },
      { d: 'M36 44 A2.5 2.5 0 1 1 35.9 44 Z M64 44 A2.5 2.5 0 1 1 63.9 44 Z M50 72 A2 2 0 1 1 49.9 72 Z', fill: '#FFE4E6' },
      { d: 'M40 54 A3 3 0 1 1 39.9 54 Z M60 54 A3 3 0 1 1 59.9 54 Z', fill: '#1C1917' },
      { d: 'M46 60 Q50 64 54 60', fill: 'none', stroke: '#1C1917', strokeWidth: 2.5 },
    ],
  },
  {
    id: 'star-eyed-cat',
    label: 'Star Cat',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M20 44 L16 14 L38 28 Q50 24 62 28 L84 14 L80 44 C84 68 72 86 50 86 C28 86 16 68 20 44 Z',
        fill: '#FFFFFF',
        stroke: '#1E293B',
        strokeWidth: 4,
      },
      { d: 'M34 44 L37 51 L44 52 L39 57 L40 64 L34 60 L28 64 L29 57 L24 52 L31 51 Z', fill: '#FACC15', stroke: '#1E293B', strokeWidth: 2 },
      { d: 'M66 44 L69 51 L76 52 L71 57 L72 64 L66 60 L60 64 L61 57 L56 52 L63 51 Z', fill: '#FACC15', stroke: '#1E293B', strokeWidth: 2 },
      { d: 'M44 68 Q50 74 56 68', fill: 'none', stroke: '#1E293B', strokeWidth: 3 },
    ],
  },
  {
    id: 'cute-bandaid',
    label: 'Band-Aid',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M18 64 L64 18 C72 10 86 24 78 32 L32 78 C24 86 10 72 18 64 Z',
        fill: '#FDBA74',
        stroke: '#9A3412',
        strokeWidth: 3.5,
      },
      {
        d: 'M38 44 L44 38 L62 56 L56 62 Z',
        fill: '#FFEDD5',
        stroke: '#9A3412',
        strokeWidth: 2.5,
      },
      { d: 'M50 48 A3 3 0 1 1 49.9 48 Z', fill: '#FB7185' },
    ],
  },
  {
    id: 'paper-plane',
    label: 'Plane',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M12 46 L88 18 L66 82 L46 58 Z',
        fill: '#E0F2FE',
        stroke: '#0369A1',
        strokeWidth: 3.5,
      },
      { d: 'M88 18 L46 58 L46 82 L58 68', fill: 'none', stroke: '#0369A1', strokeWidth: 3.5 },
    ],
  },
  {
    id: 'scribbly-heart',
    label: 'Sketch Heart',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      {
        d: 'M50 82 C22 64 14 44 18 30 C22 18 38 16 50 30 C62 16 78 18 82 30 C86 44 78 64 50 82 Z',
        fill: '#FDA4AF',
        stroke: '#1E293B',
        strokeWidth: 4.5,
      },
      { d: 'M28 38 L42 52 M36 28 L54 46 M48 26 L64 42', fill: 'none', stroke: '#BE123C', strokeWidth: 2.5 },
    ],
  },
];

export const STICKERS: StickerDef[] = [...STICKERS_V1, ...STICKERS_V2];

export function getStickerById(stickerId: string): StickerDef | undefined {
  return STICKERS.find((s) => s.id === stickerId);
}
