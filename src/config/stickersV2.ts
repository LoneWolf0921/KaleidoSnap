import type { StickerDef } from '../types/booth';

/**
 * 54 original, copyright-free SVG stickers for KaleidoSnap v2
 * across Props, Food & Drinks, Y2K & Cyber, Cozy & Nature, and Scrapbook & Tape.
 */
export const STICKERS_V2: StickerDef[] = [
  // ── Purikura Props (11) ──────────────────────────────────────────────────
  {
    id: 'cat-ears-headband',
    label: 'Cat Ears',
    category: 'props',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M18 68 Q50 40 82 68', fill: 'none', stroke: '#1E293B', strokeWidth: 6 },
      { d: 'M16 58 L24 22 L44 46 Z', fill: '#F472B6', stroke: '#831843', strokeWidth: 3.5 },
      { d: 'M84 58 L76 22 L56 46 Z', fill: '#F472B6', stroke: '#831843', strokeWidth: 3.5 },
      { d: 'M23 50 L27 32 L38 45 Z', fill: '#FBCFE8' },
      { d: 'M77 50 L73 32 L62 45 Z', fill: '#FBCFE8' },
    ],
  },
  {
    id: 'bunny-ears-band',
    label: 'Bunny Ears',
    category: 'props',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M22 76 Q50 56 78 76', fill: 'none', stroke: '#F43F5E', strokeWidth: 5 },
      { d: 'M34 62 C26 38 26 14 36 12 C46 10 48 36 44 60 Z', fill: '#FFF1F2', stroke: '#9F1239', strokeWidth: 3.5 },
      { d: 'M66 62 C74 38 74 14 64 12 C54 10 52 36 56 60 Z', fill: '#FFF1F2', stroke: '#9F1239', strokeWidth: 3.5 },
      { d: 'M36 52 C32 36 33 22 37 21 C41 20 42 36 40 52 Z', fill: '#FDA4AF' },
      { d: 'M64 52 C68 36 67 22 63 21 C59 20 58 36 60 52 Z', fill: '#FDA4AF' },
    ],
  },
  {
    id: 'star-sunglasses',
    label: 'Star Shades',
    category: 'props',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M26 26 L32 42 L48 44 L36 54 L40 70 L26 61 L12 70 L16 54 L4 44 L20 42 Z', fill: '#FACC15', stroke: '#1E293B', strokeWidth: 3.5 },
      { d: 'M74 26 L80 42 L96 44 L84 54 L88 70 L74 61 L60 70 L64 54 L52 44 L68 42 Z', fill: '#FACC15', stroke: '#1E293B', strokeWidth: 3.5 },
      { d: 'M42 46 Q50 42 58 46', fill: 'none', stroke: '#1E293B', strokeWidth: 4 },
      { d: 'M18 44 L28 38 M66 44 L76 38', fill: 'none', stroke: '#FEF9C3', strokeWidth: 3 },
    ],
  },
  {
    id: 'heart-sunglasses',
    label: 'Heart Shades',
    category: 'props',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M26 70 C10 58 6 48 6 38 C6 30 13 24 20 24 C24 24 26 28 26 30 C26 28 28 24 32 24 C39 24 46 30 46 38 C46 48 42 58 26 70 Z', fill: '#FB7185', stroke: '#FFFFFF', strokeWidth: 4 },
      { d: 'M74 70 C58 58 54 48 54 38 C54 30 61 24 68 24 C72 24 74 28 74 30 C74 28 76 24 80 24 C87 24 94 30 94 38 C94 48 90 58 74 70 Z', fill: '#FB7185', stroke: '#FFFFFF', strokeWidth: 4 },
      { d: 'M44 38 L56 38', fill: 'none', stroke: '#FFFFFF', strokeWidth: 4.5 },
    ],
  },
  {
    id: 'pixel-shades',
    label: 'Deal Shades',
    category: 'props',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M8 38 H92 V48 H84 V60 H56 V48 H44 V60 H16 V48 H8 Z', fill: '#0F172A', stroke: '#334155', strokeWidth: 2 },
      { d: 'M20 42 H26 V48 H20 Z M26 48 H32 V54 H26 Z M62 42 H68 V48 H62 Z M68 48 H74 V54 H68 Z', fill: '#FFFFFF' },
    ],
  },
  {
    id: 'angel-halo',
    label: 'Angel Halo',
    category: 'props',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M14 50 A36 14 0 1 0 86 50 A36 14 0 1 0 14 50 Z', fill: 'none', stroke: '#FDE047', strokeWidth: 9 },
      { d: 'M14 50 A36 14 0 1 0 86 50 A36 14 0 1 0 14 50 Z', fill: 'none', stroke: '#FEF9C3', strokeWidth: 3 },
      { d: 'M24 24 L27 32 L35 35 L27 38 L24 46 L21 38 L13 35 L21 32 Z', fill: '#FEF08A' },
    ],
  },
  {
    id: 'coquette-bow',
    label: 'Ribbon Bow',
    category: 'props',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M46 46 C30 24 10 24 12 46 C14 64 32 62 46 50 Z', fill: '#F472B6', stroke: '#9D174D', strokeWidth: 3.5 },
      { d: 'M54 46 C70 24 90 24 88 46 C86 64 68 62 54 50 Z', fill: '#F472B6', stroke: '#9D174D', strokeWidth: 3.5 },
      { d: 'M44 52 L28 84 L38 78 L46 86 L48 54 Z M56 52 L72 84 L62 78 L54 86 L52 54 Z', fill: '#F9A8D4', stroke: '#9D174D', strokeWidth: 3 },
      { d: 'M42 42 H58 V56 H42 Z', fill: '#EC4899', stroke: '#9D174D', strokeWidth: 3 },
    ],
  },
  {
    id: 'devil-horns',
    label: 'Imp Horns',
    category: 'props',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M24 68 C16 48 16 26 28 18 C30 34 36 48 42 62 Z', fill: '#EF4444', stroke: '#7F1D1D', strokeWidth: 3.5 },
      { d: 'M76 68 C84 48 84 26 72 18 C70 34 64 48 58 62 Z', fill: '#EF4444', stroke: '#7F1D1D', strokeWidth: 3.5 },
      { d: 'M26 54 L24 34', fill: 'none', stroke: '#FCA5A5', strokeWidth: 3 },
      { d: 'M74 54 L76 34', fill: 'none', stroke: '#FCA5A5', strokeWidth: 3 },
    ],
  },
  {
    id: 'party-hat',
    label: 'Party Hat',
    category: 'props',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 18 L24 84 Q50 90 76 84 Z', fill: '#38BDF8', stroke: '#0369A1', strokeWidth: 3.5 },
      { d: 'M38 50 L64 44 M30 70 L70 62', fill: 'none', stroke: '#FDE047', strokeWidth: 5 },
      { d: 'M50 10 A8 8 0 1 1 49.9 10 Z', fill: '#F472B6', stroke: '#9D174D', strokeWidth: 2.5 },
    ],
  },

  // ── Kawaii Food & Drinks (10) ────────────────────────────────────────────
  {
    id: 'matcha-latte',
    label: 'Iced Matcha',
    category: 'food',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M56 12 L52 34', fill: 'none', stroke: '#166534', strokeWidth: 5 },
      { d: 'M32 34 H68 L64 86 H36 Z', fill: '#FEF3C7', stroke: '#365314', strokeWidth: 3.5 },
      { d: 'M33 48 H67 L64 86 H36 Z', fill: '#84CC16', opacity: 0.85 },
      { d: 'M38 38 H48 V48 H38 Z M52 40 H62 V50 H52 Z', fill: '#FFFFFF', opacity: 0.7 },
    ],
  },
  {
    id: 'strawberry-cake',
    label: 'Shortcake',
    category: 'food',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M18 52 L78 40 L84 80 H18 Z', fill: '#FEF3C7', stroke: '#92400E', strokeWidth: 3.5 },
      { d: 'M18 52 L78 40 L82 54 Q66 60 52 54 Q36 62 18 56 Z', fill: '#FFFFFF', stroke: '#E2E8F0', strokeWidth: 2 },
      { d: 'M18 66 H82', fill: 'none', stroke: '#FDA4AF', strokeWidth: 5 },
      { d: 'M48 22 C40 22 36 32 42 40 C46 44 54 44 58 40 C64 32 60 22 52 22 Z', fill: '#F43F5E', stroke: '#9F1239', strokeWidth: 3 },
      { d: 'M46 20 L50 14 L54 20', fill: 'none', stroke: '#22C55E', strokeWidth: 3.5 },
    ],
  },
  {
    id: 'kawaii-onigiri',
    label: 'Onigiri',
    category: 'food',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 16 C64 16 86 58 84 74 C82 84 18 84 16 74 C14 58 36 16 50 16 Z', fill: '#FFFFFF', stroke: '#1E293B', strokeWidth: 4 },
      { d: 'M36 58 H64 V81 H36 Z', fill: '#1E293B' },
      { d: 'M38 44 A3 3 0 1 1 37.9 44 Z M62 44 A3 3 0 1 1 61.9 44 Z', fill: '#1E293B' },
      { d: 'M46 48 Q50 52 54 48', fill: 'none', stroke: '#1E293B', strokeWidth: 3 },
    ],
  },
  {
    id: 'sweet-taiyaki',
    label: 'Taiyaki',
    category: 'food',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M18 50 C18 32 42 24 62 34 L86 24 L80 50 L86 76 L62 66 C42 76 18 68 18 50 Z', fill: '#F59E0B', stroke: '#78350F', strokeWidth: 3.5 },
      { d: 'M32 44 A3 3 0 1 1 31.9 44 Z', fill: '#451A03' },
      { d: 'M46 38 Q52 50 46 62 M56 38 Q62 50 56 62', fill: 'none', stroke: '#B45309', strokeWidth: 3 },
    ],
  },
  {
    id: 'melon-soda',
    label: 'Melon Soda',
    category: 'food',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M62 12 L56 36', fill: 'none', stroke: '#F43F5E', strokeWidth: 5 },
      { d: 'M32 42 H68 L62 88 H38 Z', fill: '#34D399', stroke: '#065F46', strokeWidth: 3.5 },
      { d: 'M34 38 A16 12 0 1 1 66 38 Z', fill: '#FFFBEB', stroke: '#D97706', strokeWidth: 2.5 },
      { d: 'M46 20 A6 6 0 1 1 45.9 20 Z', fill: '#EF4444', stroke: '#7F1D1D', strokeWidth: 2 },
    ],
  },
  {
    id: 'golden-croissant',
    label: 'Croissant',
    category: 'food',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M16 64 C14 42 32 28 50 28 C68 28 86 42 84 64 C76 70 68 64 64 56 C56 60 44 60 36 56 C32 64 24 70 16 64 Z', fill: '#FBBF24', stroke: '#92400E', strokeWidth: 3.5 },
      { d: 'M38 32 L36 54 M62 32 L64 54 M50 28 V58', fill: 'none', stroke: '#B45309', strokeWidth: 3 },
    ],
  },
  {
    id: 'tri-dango',
    label: 'Dango',
    category: 'food',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M24 78 L76 26', fill: 'none', stroke: '#92400E', strokeWidth: 4.5 },
      { d: 'M34 68 A12 12 0 1 0 34.1 68 Z', fill: '#86EFAC', stroke: '#166534', strokeWidth: 3 },
      { d: 'M50 52 A12 12 0 1 0 50.1 52 Z', fill: '#FFFFFF', stroke: '#64748B', strokeWidth: 3 },
      { d: 'M66 36 A12 12 0 1 0 66.1 36 Z', fill: '#F9A8D4', stroke: '#9D174D', strokeWidth: 3 },
    ],
  },
  {
    id: 'swirl-cone',
    label: 'Ice Cream',
    category: 'food',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M34 52 L50 90 L66 52 Z', fill: '#F59E0B', stroke: '#92400E', strokeWidth: 3.5 },
      { d: 'M30 52 C26 42 34 36 40 36 C36 26 44 16 54 16 C62 16 64 26 60 34 C68 34 74 42 70 52 Z', fill: '#FBCFE8', stroke: '#BE185D', strokeWidth: 3.5 },
      { d: 'M42 66 L58 66 M45 76 L55 76', fill: 'none', stroke: '#B45309', strokeWidth: 2.5 },
    ],
  },
  {
    id: 'glaze-donut',
    label: 'Donut',
    category: 'food',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 16 A34 34 0 1 0 49.9 16 Z', fill: '#FBBF24', stroke: '#92400E', strokeWidth: 3.5 },
      { d: 'M50 20 C68 20 80 34 80 50 C70 54 62 46 54 52 C46 58 36 46 22 52 C20 34 32 20 50 20 Z', fill: '#F472B6', stroke: '#9D174D', strokeWidth: 3 },
      { d: 'M50 40 A10 10 0 1 0 49.9 40 Z', fill: '#FFFFFF', stroke: '#92400E', strokeWidth: 3 },
      { d: 'M34 30 L40 34 M60 28 L66 32 M48 24 L52 28', fill: 'none', stroke: '#FEF08A', strokeWidth: 3.5 },
    ],
  },

  // ── Y2K & Cyber (10) ─────────────────────────────────────────────────────
  {
    id: 'chrome-heart',
    label: 'Y2K Heart',
    category: 'y2k',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 82 C20 62 12 46 12 32 C12 20 22 14 32 14 C40 14 46 18 50 26 C54 18 60 14 68 14 C78 14 88 20 88 32 C88 46 80 62 50 82 Z', fill: '#CBD5E1', stroke: '#334155', strokeWidth: 4 },
      { d: 'M24 26 C20 32 22 42 30 50', fill: 'none', stroke: '#FFFFFF', strokeWidth: 5 },
      { d: 'M68 24 C74 24 78 30 76 38', fill: 'none', stroke: '#F8FAFC', strokeWidth: 3.5 },
    ],
  },
  {
    id: 'holo-cd',
    label: 'Holo CD',
    category: 'y2k',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 10 A40 40 0 1 0 49.9 10 Z', fill: '#E0E7FF', stroke: '#4338CA', strokeWidth: 3.5 },
      { d: 'M50 10 L72 32 L50 50 Z M50 90 L28 68 L50 50 Z', fill: '#F472B6', opacity: 0.45 },
      { d: 'M14 34 L50 50 L28 18 Z M86 66 L50 50 L72 82 Z', fill: '#22D3EE', opacity: 0.45 },
      { d: 'M50 38 A12 12 0 1 0 49.9 38 Z', fill: '#FFFFFF', stroke: '#4338CA', strokeWidth: 3 },
    ],
  },
  {
    id: 'cyber-butterfly',
    label: 'Butterfly',
    category: 'y2k',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M48 48 C34 20 10 18 14 42 C16 54 34 54 48 50 Z', fill: '#A855F7', stroke: '#3B0764', strokeWidth: 3.5 },
      { d: 'M52 48 C66 20 90 18 86 42 C84 54 66 54 52 50 Z', fill: '#A855F7', stroke: '#3B0764', strokeWidth: 3.5 },
      { d: 'M48 52 C32 56 20 74 32 82 C42 88 48 68 48 52 Z', fill: '#22D3EE', stroke: '#3B0764', strokeWidth: 3.5 },
      { d: 'M52 52 C68 56 80 74 68 82 C58 88 52 68 52 52 Z', fill: '#22D3EE', stroke: '#3B0764', strokeWidth: 3.5 },
      { d: 'M50 28 V76', fill: 'none', stroke: '#1E1B4B', strokeWidth: 5 },
    ],
  },
  {
    id: 'flip-phone',
    label: 'Flip Phone',
    category: 'y2k',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M32 14 H68 V48 H32 Z', fill: '#F472B6', stroke: '#831843', strokeWidth: 3.5 },
      { d: 'M38 20 H62 V42 H38 Z', fill: '#BAE6FD', stroke: '#0369A1', strokeWidth: 2 },
      { d: 'M30 50 H70 L66 86 H34 Z', fill: '#F9A8D4', stroke: '#831843', strokeWidth: 3.5 },
      { d: 'M64 14 V6', fill: 'none', stroke: '#831843', strokeWidth: 4 },
      { d: 'M40 60 H60 M40 68 H60 M40 76 H60', fill: 'none', stroke: '#831843', strokeWidth: 3 },
    ],
  },
  {
    id: 'cassette-tape',
    label: 'Mixtape',
    category: 'y2k',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M12 24 H88 V76 H12 Z', fill: '#1E293B', stroke: '#0F172A', strokeWidth: 3.5 },
      { d: 'M20 32 H80 V58 H20 Z', fill: '#FDE047' },
      { d: 'M36 44 A6 6 0 1 0 35.9 44 Z M64 44 A6 6 0 1 0 63.9 44 Z', fill: '#1E293B' },
      { d: 'M26 76 L32 64 H68 L74 76 Z', fill: '#475569' },
    ],
  },
  {
    id: 'pixel-wing',
    label: 'Pixel Wing',
    category: 'y2k',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M16 32 H44 V42 H60 V52 H76 V64 H60 V74 H34 V64 H20 V52 H16 Z', fill: '#E0F2FE', stroke: '#0284C7', strokeWidth: 3.5 },
      { d: 'M24 42 H44 M28 54 H58', fill: 'none', stroke: '#38BDF8', strokeWidth: 3.5 },
    ],
  },
  {
    id: 'star-orbit',
    label: 'Y2K Orbit',
    category: 'y2k',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M12 64 A42 14 -24 1 0 88 36 A42 14 -24 1 0 12 64 Z', fill: 'none', stroke: '#22D3EE', strokeWidth: 4 },
      { d: 'M50 22 L56 42 L76 48 L56 54 L50 74 L44 54 L24 48 L44 42 Z', fill: '#FDE047', stroke: '#1E1B4B', strokeWidth: 3 },
    ],
  },
  {
    id: 'cyber-bolt',
    label: 'Neon Bolt',
    category: 'y2k',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M58 10 L24 54 H48 L40 90 L76 44 H52 Z', fill: '#22D3EE', stroke: '#1E1B4B', strokeWidth: 4 },
      { d: 'M52 24 L36 48', fill: 'none', stroke: '#FFFFFF', strokeWidth: 3 },
    ],
  },
  {
    id: 'tribal-spark',
    label: 'Cyber Star',
    category: 'y2k',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 8 L58 42 L92 50 L58 58 L50 92 L42 58 L8 50 L42 42 Z', fill: '#EC4899', stroke: '#1E1B4B', strokeWidth: 3.5 },
      { d: 'M50 28 A22 22 0 1 0 49.9 28 Z', fill: 'none', stroke: '#F9A8D4', strokeWidth: 3 },
    ],
  },
  {
    id: 'disco-ball',
    label: 'Disco Ball',
    category: 'y2k',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 8 V20', fill: 'none', stroke: '#64748B', strokeWidth: 3 },
      { d: 'M50 20 A34 34 0 1 0 49.9 20 Z', fill: '#E2E8F0', stroke: '#334155', strokeWidth: 3.5 },
      { d: 'M20 42 H80 M18 54 H82 M24 66 H76 M50 20 V88 M34 24 Q28 54 34 84 M66 24 Q72 54 66 84', fill: 'none', stroke: '#64748B', strokeWidth: 2 },
      { d: 'M38 30 H48 V40 H38 Z M54 42 H64 V52 H54 Z', fill: '#FFFFFF' },
    ],
  },

  // ── Cozy & Nature (9) ────────────────────────────────────────────────────
  {
    id: 'spotted-mushroom',
    label: 'Mushroom',
    category: 'nature',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M38 52 H62 L66 84 H34 Z', fill: '#FEF3C7', stroke: '#78350F', strokeWidth: 3.5 },
      { d: 'M16 54 C16 26 34 18 50 18 C66 18 84 26 84 54 Z', fill: '#EF4444', stroke: '#7F1D1D', strokeWidth: 3.5 },
      { d: 'M34 32 A5 5 0 1 1 33.9 32 Z M54 28 A6 6 0 1 1 53.9 28 Z M68 42 A4 4 0 1 1 67.9 42 Z', fill: '#FFFFFF' },
    ],
  },
  {
    id: 'sakura-blossom',
    label: 'Sakura',
    category: 'nature',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 48 C38 22 44 10 50 18 C56 10 62 22 50 48 Z', fill: '#FBCFE8', stroke: '#DB2777', strokeWidth: 2.5 },
      { d: 'M50 48 C76 34 88 40 80 48 C88 56 76 62 50 48 Z', fill: '#FBCFE8', stroke: '#DB2777', strokeWidth: 2.5 },
      { d: 'M50 48 C66 74 60 86 52 78 C46 86 38 74 50 48 Z', fill: '#FBCFE8', stroke: '#DB2777', strokeWidth: 2.5 },
      { d: 'M50 48 C24 62 12 56 20 48 C12 40 24 34 50 48 Z', fill: '#FBCFE8', stroke: '#DB2777', strokeWidth: 2.5 },
      { d: 'M50 42 A6 6 0 1 0 49.9 42 Z', fill: '#FDE047' },
    ],
  },
  {
    id: 'spring-tulip',
    label: 'Tulip',
    category: 'nature',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 54 V88', fill: 'none', stroke: '#16A34A', strokeWidth: 5 },
      { d: 'M50 76 Q30 70 28 56 Q44 60 50 72 Z', fill: '#4ADE80', stroke: '#15803D', strokeWidth: 2.5 },
      { d: 'M30 22 C30 48 40 56 50 56 C60 56 70 48 70 22 L58 32 L50 18 L42 32 Z', fill: '#FB7185', stroke: '#9F1239', strokeWidth: 3.5 },
    ],
  },
  {
    id: 'crescent-moon',
    label: 'Moon',
    category: 'nature',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M62 16 C36 16 18 36 18 56 C18 76 36 88 58 84 C42 78 36 62 40 46 C44 30 52 22 62 16 Z', fill: '#FDE047', stroke: '#A16207', strokeWidth: 3.5 },
      { d: 'M68 30 L71 38 L79 41 L71 44 L68 52 L65 44 L57 41 L65 38 Z', fill: '#FEF08A' },
    ],
  },
  {
    id: 'sunny-face',
    label: 'Sunbeam',
    category: 'nature',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 28 A22 22 0 1 0 49.9 28 Z', fill: '#FACC15', stroke: '#B45309', strokeWidth: 3.5 },
      { d: 'M50 8 V18 M50 82 V92 M8 50 H18 M82 50 H92 M20 20 L28 28 M72 72 L80 80 M80 20 L72 28 M28 72 L20 80', fill: 'none', stroke: '#F59E0B', strokeWidth: 4.5 },
    ],
  },
  {
    id: 'lucky-clover',
    label: 'Clover',
    category: 'nature',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 54 Q48 76 58 88', fill: 'none', stroke: '#15803D', strokeWidth: 4.5 },
      { d: 'M50 48 C34 32 34 16 50 22 C66 16 66 32 50 48 Z', fill: '#4ADE80', stroke: '#166534', strokeWidth: 3 },
      { d: 'M50 48 C66 32 82 32 76 48 C82 64 66 64 50 48 Z', fill: '#4ADE80', stroke: '#166534', strokeWidth: 3 },
      { d: 'M50 48 C66 64 66 80 50 74 C34 80 34 64 50 48 Z', fill: '#4ADE80', stroke: '#166534', strokeWidth: 3 },
      { d: 'M50 48 C34 64 18 64 24 48 C18 32 34 32 50 48 Z', fill: '#4ADE80', stroke: '#166534', strokeWidth: 3 },
    ],
  },
  {
    id: 'pastel-rainbow',
    label: 'Rainbow',
    category: 'nature',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M16 68 A34 34 0 0 1 84 68', fill: 'none', stroke: '#FB7185', strokeWidth: 9 },
      { d: 'M24 68 A26 26 0 0 1 76 68', fill: 'none', stroke: '#FDE047', strokeWidth: 9 },
      { d: 'M32 68 A18 18 0 0 1 68 68', fill: 'none', stroke: '#38BDF8', strokeWidth: 9 },
    ],
  },
  {
    id: 'autumn-leaf',
    label: 'Maple Leaf',
    category: 'nature',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 14 L58 34 L78 28 L68 48 L84 58 L62 66 L54 78 H46 L38 66 L16 58 L32 48 L22 28 L42 34 Z', fill: '#F97316', stroke: '#9A3412', strokeWidth: 3.5 },
      { d: 'M50 42 V90', fill: 'none', stroke: '#7C2D12', strokeWidth: 3.5 },
    ],
  },
  {
    id: 'tiny-sprout',
    label: 'Sprout',
    category: 'nature',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 84 V44', fill: 'none', stroke: '#15803D', strokeWidth: 5 },
      { d: 'M50 48 C30 46 20 30 24 20 C38 18 50 32 50 48 Z', fill: '#84CC16', stroke: '#15803D', strokeWidth: 3 },
      { d: 'M50 48 C70 46 80 30 76 20 C62 18 50 32 50 48 Z', fill: '#4ADE80', stroke: '#15803D', strokeWidth: 3 },
    ],
  },

  // ── Scrapbook & Tape (10) ────────────────────────────────────────────────
  {
    id: 'washi-check',
    label: 'Check Tape',
    category: 'scrapbook',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M10 34 H90 V64 H10 Z', fill: '#BFDBFE', stroke: '#1D4ED8', strokeWidth: 2.5, opacity: 0.92 },
      { d: 'M20 34 V64 M35 34 V64 M50 34 V64 M65 34 V64 M80 34 V64', fill: 'none', stroke: '#FFFFFF', strokeWidth: 4, opacity: 0.75 },
      { d: 'M10 49 H90', fill: 'none', stroke: '#FFFFFF', strokeWidth: 4, opacity: 0.65 },
    ],
  },
  {
    id: 'photo-corner',
    label: 'Corner Mount',
    category: 'scrapbook',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M16 16 H84 L16 84 Z', fill: '#FDE68A', stroke: '#92400E', strokeWidth: 3.5 },
      { d: 'M22 22 H66 L22 66 Z', fill: 'none', stroke: '#D97706', strokeWidth: 2 },
    ],
  },
  {
    id: 'postage-stamp',
    label: 'Stamp Frame',
    category: 'scrapbook',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M16 16 H84 V84 H16 Z', fill: '#FFFBEB', stroke: '#B45309', strokeWidth: 4 },
      { d: 'M26 26 H74 V74 H26 Z', fill: 'none', stroke: '#F59E0B', strokeWidth: 2.5 },
      { d: 'M50 64 C36 54 32 44 36 36 C40 30 46 32 50 38 C54 32 60 30 64 36 C68 44 64 54 50 64 Z', fill: '#F43F5E' },
    ],
  },
  {
    id: 'xoxo-burst',
    label: 'XOXO Burst',
    category: 'scrapbook',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 12 L60 28 L78 20 L74 38 L92 46 L76 58 L84 76 L64 74 L54 90 L44 74 L24 80 L28 60 L10 50 L26 38 L20 20 L38 26 Z', fill: '#F43F5E', stroke: '#881337', strokeWidth: 3 },
      { d: 'M32 42 L44 58 M44 42 L32 58', fill: 'none', stroke: '#FFFFFF', strokeWidth: 4 },
      { d: 'M58 44 A6 8 0 1 0 57.9 44 Z', fill: 'none', stroke: '#FFFFFF', strokeWidth: 4 },
    ],
  },
  {
    id: 'stitched-patch',
    label: 'Heart Patch',
    category: 'scrapbook',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 82 C20 62 12 46 12 32 C12 20 22 14 32 14 C40 14 46 18 50 26 C54 18 60 14 68 14 C78 14 88 20 88 32 C88 46 80 62 50 82 Z', fill: '#FB7185', stroke: '#9F1239', strokeWidth: 3.5 },
      { d: 'M50 74 C26 58 20 44 20 34 C20 26 26 22 32 22 C38 22 44 26 50 34 C56 26 62 22 68 22 C74 22 80 26 80 34 C80 44 74 58 50 74 Z', fill: 'none', stroke: '#FFE4E6', strokeWidth: 2.5 },
    ],
  },
  {
    id: 'ticket-stub',
    label: 'Booth Ticket',
    category: 'scrapbook',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M14 30 H86 V44 A6 6 0 0 0 86 56 V70 H14 V56 A6 6 0 0 0 14 44 Z', fill: '#FEF08A', stroke: '#854D0E', strokeWidth: 3.5 },
      { d: 'M32 34 V66 M68 34 V66', fill: 'none', stroke: '#CA8A04', strokeWidth: 2.5 },
      { d: 'M50 40 L53 47 L60 48 L54 53 L56 60 L50 56 L44 60 L46 53 L40 48 L47 47 Z', fill: '#F59E0B' },
    ],
  },
  {
    id: 'paper-clip',
    label: 'Paperclip',
    category: 'scrapbook',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M36 74 V30 A14 14 0 0 1 64 30 V66 A10 10 0 0 1 44 66 V34 A6 6 0 0 1 56 34 V62', fill: 'none', stroke: '#0284C7', strokeWidth: 6 },
    ],
  },
  {
    id: 'film-tab',
    label: 'Film Frame',
    category: 'scrapbook',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M14 22 H86 V78 H14 Z', fill: '#1C1917', stroke: '#44403C', strokeWidth: 3 },
      { d: 'M24 34 H76 V66 H24 Z', fill: '#E7E5E4' },
      { d: 'M20 26 H26 V30 H20 Z M36 26 H42 V30 H36 Z M58 26 H64 V30 H58 Z M74 26 H80 V30 H74 Z', fill: '#F5F5F4' },
      { d: 'M20 70 H26 V74 H20 Z M36 70 H42 V74 H36 Z M58 70 H64 V74 H58 Z M74 70 H80 V74 H74 Z', fill: '#F5F5F4' },
    ],
  },
  {
    id: 'safety-pin',
    label: 'Safety Pin',
    category: 'scrapbook',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M24 62 A8 8 0 1 1 34 72 L78 28 A10 10 0 0 0 64 14 L22 56', fill: 'none', stroke: '#475569', strokeWidth: 4.5 },
      { d: 'M62 12 L80 30 L72 38 L54 20 Z', fill: '#94A3B8', stroke: '#334155', strokeWidth: 2.5 },
    ],
  },
  {
    id: 'wax-seal',
    label: 'Wax Seal',
    category: 'scrapbook',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 14 C72 14 86 28 86 50 C86 72 72 86 50 86 C28 86 14 72 14 50 C14 28 28 14 50 14 Z', fill: '#BE123C', stroke: '#881337', strokeWidth: 3.5 },
      { d: 'M50 24 A26 26 0 1 0 49.9 24 Z', fill: '#E11D48', stroke: '#9F1239', strokeWidth: 2 },
      { d: 'M50 64 C38 55 34 46 38 39 C41 34 47 36 50 40 C53 36 59 34 62 39 C66 46 62 55 50 64 Z', fill: '#FFE4E6' },
    ],
  },

  // ── Creative Lines, Twirls & Arrows (14) ─────────────────────────────────
  {
    id: 'loop-twirl-line',
    label: 'Loop Twirl',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M8 58 C24 58 34 26 48 26 C58 26 56 48 44 48 C34 48 34 32 48 32 C64 32 72 64 92 52', fill: 'none', stroke: '#1E293B', strokeWidth: 5 },
    ],
  },
  {
    id: 'double-swirl',
    label: 'Double Swirl',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M12 66 Q30 16 48 52 Q66 86 88 30', fill: 'none', stroke: '#EC4899', strokeWidth: 5.5 },
      { d: 'M16 74 Q34 28 50 58 Q68 90 88 42', fill: 'none', stroke: '#F472B6', strokeWidth: 3 },
    ],
  },
  {
    id: 'wavy-underline',
    label: 'Wavy Line',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M8 50 Q18 32 28 50 T48 50 T68 50 T88 50', fill: 'none', stroke: '#F59E0B', strokeWidth: 6 },
      { d: 'M10 62 Q20 46 30 62 T50 62 T70 62 T90 62', fill: 'none', stroke: '#1E293B', strokeWidth: 3 },
    ],
  },
  {
    id: 'zigzag-line',
    label: 'Zigzag',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M8 62 L22 36 L36 62 L50 36 L64 62 L78 36 L92 62', fill: 'none', stroke: '#22D3EE', strokeWidth: 6 },
    ],
  },
  {
    id: 'spiral-whirl',
    label: 'Spiral',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50 50 C50 42 60 42 60 50 C60 62 40 64 38 50 C36 32 66 28 72 48 C78 70 42 80 26 62 C12 42 30 14 60 16 C84 18 92 44 86 68', fill: 'none', stroke: '#8B5CF6', strokeWidth: 5 },
    ],
  },
  {
    id: 'curved-arrow-right',
    label: 'Curved Arrow',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M14 72 Q36 22 82 38', fill: 'none', stroke: '#1E293B', strokeWidth: 5.5 },
      { d: 'M68 24 L84 39 L64 48', fill: 'none', stroke: '#1E293B', strokeWidth: 5.5 },
    ],
  },
  {
    id: 'loop-arrow',
    label: 'Loop Arrow',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M14 76 C22 44 58 24 62 44 C64 56 42 56 44 42 C48 22 76 22 86 44', fill: 'none', stroke: '#F43F5E', strokeWidth: 5 },
      { d: 'M72 42 L87 46 L89 30', fill: 'none', stroke: '#F43F5E', strokeWidth: 5 },
    ],
  },
  {
    id: 'double-arrow',
    label: 'Double Arrow',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M14 50 Q50 32 86 50', fill: 'none', stroke: '#0284C7', strokeWidth: 5 },
      { d: 'M26 36 L12 50 L28 60 M74 36 L88 50 L72 60', fill: 'none', stroke: '#0284C7', strokeWidth: 5 },
    ],
  },
  {
    id: 'heart-arrow-doodle',
    label: 'Heart Arrow',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M12 72 Q42 64 50 44 C54 32 40 28 38 38 C36 48 56 54 84 26', fill: 'none', stroke: '#E11D48', strokeWidth: 5 },
      { d: 'M70 24 L86 24 L84 40', fill: 'none', stroke: '#E11D48', strokeWidth: 5 },
    ],
  },
  {
    id: 'curly-bracket-left',
    label: 'Bracket',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M62 12 C44 12 46 38 34 50 C46 62 44 88 62 88', fill: 'none', stroke: '#1E293B', strokeWidth: 6 },
    ],
  },
  {
    id: 'comic-swoosh',
    label: 'Speed Swoosh',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M10 34 Q52 24 88 38 M16 52 Q54 44 92 54 M12 70 Q46 62 78 72', fill: 'none', stroke: '#1E293B', strokeWidth: 4.5 },
    ],
  },
  {
    id: 'ribbon-flourish',
    label: 'Flourish',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M10 56 C24 30 42 74 56 44 C68 20 82 64 92 42', fill: 'none', stroke: '#A855F7', strokeWidth: 5 },
      { d: 'M14 66 C28 40 46 84 60 54', fill: 'none', stroke: '#F472B6', strokeWidth: 3 },
    ],
  },
  {
    id: 'dotted-trail',
    label: 'Dot Trail',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M14 68 A4 4 0 1 1 13.9 68 Z M28 54 A4.5 4.5 0 1 1 27.9 54 Z M44 44 A5 5 0 1 1 43.9 44 Z M62 40 A5.5 5.5 0 1 1 61.9 40 Z M80 46 A6 6 0 1 1 79.9 46 Z', fill: '#FACC15', stroke: '#854D0E', strokeWidth: 2 },
    ],
  },
  {
    id: 'doodle-underline-burst',
    label: 'Accent Burst',
    category: 'doodles',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M14 62 Q50 52 86 62', fill: 'none', stroke: '#EF4444', strokeWidth: 5.5 },
      { d: 'M24 38 L20 22 M50 32 L50 14 M76 38 L80 22', fill: 'none', stroke: '#FACC15', strokeWidth: 5 },
    ],
  },

  // ── Facial Expression Doodles (10) ───────────────────────────────────────
  {
    id: 'cat-smirk-face',
    label: '>:3 Smirk',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M20 34 L38 42 L20 50 M80 34 L62 42 L80 50', fill: 'none', stroke: '#1E293B', strokeWidth: 5 },
      { d: 'M34 64 Q42 74 50 64 Q58 74 66 64', fill: 'none', stroke: '#EC4899', strokeWidth: 5 },
    ],
  },
  {
    id: 'uwu-cozy-face',
    label: 'UwU Face',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M18 44 Q28 56 38 44 M62 44 Q72 56 82 44', fill: 'none', stroke: '#1E293B', strokeWidth: 5 },
      { d: 'M36 62 Q43 72 50 62 Q57 72 64 62', fill: 'none', stroke: '#1E293B', strokeWidth: 4.5 },
      { d: 'M22 60 A7 4 0 1 1 21.9 60 Z M78 60 A7 4 0 1 1 77.9 60 Z', fill: '#FDA4AF', opacity: 0.8 },
    ],
  },
  {
    id: 'wide-eyed-o-o',
    label: 'O_O Shock',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M28 32 A12 12 0 1 0 27.9 32 Z M72 32 A12 12 0 1 0 71.9 32 Z', fill: '#FFFFFF', stroke: '#1E293B', strokeWidth: 4.5 },
      { d: 'M28 42 A3.5 3.5 0 1 1 27.9 42 Z M72 42 A3.5 3.5 0 1 1 71.9 42 Z', fill: '#1E293B' },
      { d: 'M38 72 H62', fill: 'none', stroke: '#1E293B', strokeWidth: 5 },
    ],
  },
  {
    id: 'happy-cheeks-face',
    label: '^o^ Happy',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M18 46 L28 34 L38 46 M62 46 L72 34 L82 46', fill: 'none', stroke: '#1E293B', strokeWidth: 5 },
      { d: 'M38 60 Q50 80 62 60 Z', fill: '#FB7185', stroke: '#1E293B', strokeWidth: 4 },
    ],
  },
  {
    id: 'dizzy-spiral-face',
    label: '@_@ Dizzy',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M28 42 C28 36 34 36 34 42 C34 48 22 50 22 42 C22 32 38 30 40 42', fill: 'none', stroke: '#1E293B', strokeWidth: 4 },
      { d: 'M72 42 C72 36 78 36 78 42 C78 48 66 50 66 42 C66 32 82 30 84 42', fill: 'none', stroke: '#1E293B', strokeWidth: 4 },
      { d: 'M34 68 Q42 62 50 68 Q58 74 66 68', fill: 'none', stroke: '#1E293B', strokeWidth: 4.5 },
    ],
  },
  {
    id: 'sleepy-zzz-doodle',
    label: 'Sleepy zzZ',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M16 58 H34 L16 78 H34', fill: 'none', stroke: '#6366F1', strokeWidth: 4.5 },
      { d: 'M42 40 H62 L42 62 H62', fill: 'none', stroke: '#6366F1', strokeWidth: 5 },
      { d: 'M64 18 H88 L64 44 H88', fill: 'none', stroke: '#4F46E5', strokeWidth: 5.5 },
    ],
  },
  {
    id: 'wink-tongue-face',
    label: ';P Wink',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M28 36 A6 8 0 1 0 27.9 36 Z', fill: '#1E293B' },
      { d: 'M60 44 L78 36 M60 44 L78 52', fill: 'none', stroke: '#1E293B', strokeWidth: 5 },
      { d: 'M32 62 Q50 74 68 62', fill: 'none', stroke: '#1E293B', strokeWidth: 4.5 },
      { d: 'M52 67 C52 82 64 82 64 64 Z', fill: '#FB7185', stroke: '#9F1239', strokeWidth: 3 },
    ],
  },
  {
    id: 'nervous-squiggle-mouth',
    label: 'Nervous Face',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M20 36 L38 30 M80 36 L62 30', fill: 'none', stroke: '#1E293B', strokeWidth: 4.5 },
      { d: 'M28 46 A4 4 0 1 1 27.9 46 Z M72 46 A4 4 0 1 1 71.9 46 Z', fill: '#1E293B' },
      { d: 'M28 68 Q36 60 44 68 T60 68 T74 68', fill: 'none', stroke: '#1E293B', strokeWidth: 4.5 },
    ],
  },
  {
    id: 'dramatic-cry-streams',
    label: 'Cry Streams',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M18 32 H38 M62 32 H82', fill: 'none', stroke: '#1E293B', strokeWidth: 5 },
      { d: 'M24 36 V84 M32 36 V84 M68 36 V84 M76 36 V84', fill: 'none', stroke: '#38BDF8', strokeWidth: 5 },
      { d: 'M42 64 Q50 54 58 64', fill: 'none', stroke: '#1E293B', strokeWidth: 4.5 },
    ],
  },
  {
    id: 'blush-scribbles',
    label: 'Blush Lines',
    category: 'expressions',
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M14 48 L22 58 M24 46 L32 58 M34 48 L42 58', fill: 'none', stroke: '#FB7185', strokeWidth: 4.5 },
      { d: 'M58 48 L66 58 M68 46 L76 58 M78 48 L86 58', fill: 'none', stroke: '#FB7185', strokeWidth: 4.5 },
    ],
  },
];
