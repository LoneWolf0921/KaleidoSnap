import type { LayoutDefinition, PaperSizeId, PrintPaperSpec } from '../types/booth';

export const PRINT_PAPERS: PrintPaperSpec[] = [
  {
    id: '4x6',
    label: '4×6" (4R)',
    widthIn: 4,
    heightIn: 6,
    description: 'Standard photo print • 2 classic strips',
  },
  {
    id: '3r',
    label: '3.5×5" (3R)',
    widthIn: 3.5,
    heightIn: 5,
    description: 'Compact photo print • 2 mini-strips',
  },
  {
    id: '5x7',
    label: '5×7" (5R)',
    widthIn: 5,
    heightIn: 7,
    description: 'Medium frame print • 2 strips',
  },
  {
    id: 'a4',
    label: 'A4 (Landscape)',
    widthIn: 8.27,
    heightIn: 11.69,
    description: '297×210 mm • 5 strips (5×1) or 6 prints (3×2)',
  },
  {
    id: 'letter',
    label: 'US Letter (Landscape)',
    widthIn: 8.5,
    heightIn: 11,
    description: '11×8.5" • 5 strips (5×1) or 6 prints (3×2)',
  },
  {
    id: '2x6',
    label: '2×6" Strip',
    widthIn: 2,
    heightIn: 6,
    description: '1 strip or 2 stacked prints (1×2)',
  },
];

export function getPrintPaperById(id: PaperSizeId): PrintPaperSpec {
  return PRINT_PAPERS.find((p) => p.id === id) ?? PRINT_PAPERS[0];
}

export interface PrintTileRect {
  xIn: number;
  yIn: number;
  widthIn: number;
  heightIn: number;
}

export interface PrintSheetLayout {
  paperId: PaperSizeId;
  orientation: 'portrait' | 'landscape';
  sheetWidthIn: number;
  sheetHeightIn: number;
  tiles: PrintTileRect[];
  cols: number;
  rows: number;
  hasCutMarks: boolean;
}

/**
 * Computes an optimal, centered print sheet layout for the chosen photo paper and strip layout.
 * - `3r`, `4x6`, `5x7`: portrait orientation (2 strips side-by-side for `strip-3`, 1 centered print for `single`/`grid-4`).
 * - `a4`, `letter`: landscape orientation with forgiving margins (`5×1` true ~2×6" strips for `strip-3`, `2×2` for `single`/`grid-4`).
 * - `2x6`: portrait orientation, 1 strip fitted with safe margin.
 */
export function computePrintSheetLayout(
  paper: PrintPaperSpec,
  layout: LayoutDefinition
): PrintSheetLayout {
  const stripAspect = layout.canvasWidth / layout.canvasHeight;
  const isStrip = layout.id === 'strip-3';
  const isLargeSheet = paper.id === 'a4' || paper.id === 'letter';

  const marginIn = paper.id === '2x6' ? 0.08 : isLargeSheet ? 0.35 : 0.22;
  const gapIn = isLargeSheet ? 0.2 : 0.16;

  let orientation: 'portrait' | 'landscape' = 'portrait';
  let sheetWidthIn = paper.widthIn;
  let sheetHeightIn = paper.heightIn;
  let cols = 1;
  let rows = 1;

  if (isLargeSheet) {
    orientation = 'landscape';
    sheetWidthIn = paper.heightIn;
    sheetHeightIn = paper.widthIn;
    cols = isStrip ? 5 : 3;
    rows = isStrip ? 1 : 2;
  } else if (paper.id === '2x6') {
    orientation = 'portrait';
    sheetWidthIn = paper.widthIn;
    sheetHeightIn = paper.heightIn;
    cols = 1;
    rows = isStrip ? 1 : 2;
  } else if (isStrip) {
    // 3R, 4R, 5R: portrait sheet with 2 tall strips side-by-side
    orientation = 'portrait';
    sheetWidthIn = paper.widthIn;
    sheetHeightIn = paper.heightIn;
    cols = 2;
    rows = 1;
  } else {
    // single / grid-4 on 3R, 4R, 5R: 1 centered portrait print
    orientation = 'portrait';
    sheetWidthIn = paper.widthIn;
    sheetHeightIn = paper.heightIn;
    cols = 1;
    rows = 1;
  }

  const usableW = sheetWidthIn - marginIn * 2;
  const usableH = sheetHeightIn - marginIn * 2;
  const cellW = (usableW - gapIn * (cols - 1)) / cols;
  const cellH = (usableH - gapIn * (rows - 1)) / rows;

  let tileW = cellW;
  let tileH = tileW / stripAspect;
  if (tileH > cellH) {
    tileH = cellH;
    tileW = tileH * stripAspect;
  }

  const totalGridW = cols * tileW + (cols - 1) * gapIn;
  const totalGridH = rows * tileH + (rows - 1) * gapIn;
  const startX = (sheetWidthIn - totalGridW) / 2;
  const startY = (sheetHeightIn - totalGridH) / 2;

  const tiles: PrintTileRect[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tiles.push({
        xIn: startX + c * (tileW + gapIn),
        yIn: startY + r * (tileH + gapIn),
        widthIn: tileW,
        heightIn: tileH,
      });
    }
  }

  return {
    paperId: paper.id,
    orientation,
    sheetWidthIn,
    sheetHeightIn,
    tiles,
    cols,
    rows,
    hasCutMarks: paper.id !== '2x6' || tiles.length > 1,
  };
}
