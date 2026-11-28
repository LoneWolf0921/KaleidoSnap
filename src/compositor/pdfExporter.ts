import { computePrintSheetLayout, getPrintPaperById } from '../config/printPapers';
import type { PaperSizeId } from '../types/booth';
import { renderStripToCanvas, type RenderStripOptions } from './canvasCompositor';

/**
 * Renders the photo strip onto a client-side PDF matching the selected photo paper size,
 * automatically tiling/centering the strip(s) and drawing full dashed cut guides + trim ticks.
 */
export async function exportStripToPdfBlob(
  options: RenderStripOptions,
  paperId: PaperSizeId
): Promise<Blob> {
  const offscreen = document.createElement('canvas');
  await renderStripToCanvas(offscreen, options);

  const paper = getPrintPaperById(paperId);
  const sheet = computePrintSheetLayout(paper, options.layout);

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: sheet.orientation,
    unit: 'in',
    format: [paper.widthIn, paper.heightIn],
    compress: true,
  });

  for (const tile of sheet.tiles) {
    doc.addImage(
      offscreen,
      'PNG',
      tile.xIn,
      tile.yIn,
      tile.widthIn,
      tile.heightIn,
      'kaleidosnap-strip',
      'FAST'
    );
  }

  if (sheet.hasCutMarks) {
    // 1. Full dashed cut border around every tile so white strips are clearly delineated
    doc.setDrawColor(145, 145, 145);
    doc.setLineWidth(0.008);
    doc.setLineDashPattern([0.07, 0.05], 0);

    for (const tile of sheet.tiles) {
      doc.rect(tile.xIn, tile.yIn, tile.widthIn, tile.heightIn, 'S');
    }

    // 2. Solid extended corner trim ticks outside each tile for guillotine/ruler alignment
    doc.setLineDashPattern([], 0);
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.01);
    const tickLen = 0.1;
    const gap = 0.03;

    for (const tile of sheet.tiles) {
      const x1 = tile.xIn;
      const y1 = tile.yIn;
      const x2 = tile.xIn + tile.widthIn;
      const y2 = tile.yIn + tile.heightIn;

      // Top-left
      doc.line(x1 - tickLen - gap, y1, x1 - gap, y1);
      doc.line(x1, y1 - tickLen - gap, x1, y1 - gap);
      // Top-right
      doc.line(x2 + gap, y1, x2 + tickLen + gap, y1);
      doc.line(x2, y1 - tickLen - gap, x2, y1 - gap);
      // Bottom-left
      doc.line(x1 - tickLen - gap, y2, x1 - gap, y2);
      doc.line(x1, y2 + gap, x1, y2 + tickLen + gap);
      // Bottom-right
      doc.line(x2 + gap, y2, x2 + tickLen + gap, y2);
      doc.line(x2, y2 + gap, x2, y2 + tickLen + gap);
    }

    // 3. Center split guide lines when multi-column or multi-row
    if ((sheet.cols > 1 || sheet.rows > 1) && sheet.tiles.length >= 2) {
      doc.setDrawColor(130, 130, 130);
      doc.setLineWidth(0.008);
      doc.setLineDashPattern([0.09, 0.06], 0);
      for (let c = 0; c < sheet.cols - 1; c++) {
        const leftTile = sheet.tiles[c];
        const rightTile = sheet.tiles[c + 1];
        const midX = (leftTile.xIn + leftTile.widthIn + rightTile.xIn) / 2;
        doc.line(midX, 0.08, midX, sheet.sheetHeightIn - 0.08);
      }
      for (let r = 0; r < sheet.rows - 1; r++) {
        const topTile = sheet.tiles[r * sheet.cols];
        const bottomTile = sheet.tiles[(r + 1) * sheet.cols];
        const midY = (topTile.yIn + topTile.heightIn + bottomTile.yIn) / 2;
        doc.line(0.08, midY, sheet.sheetWidthIn - 0.08, midY);
      }
      doc.setLineDashPattern([], 0);
    }
  }

  return doc.output('blob');
}
