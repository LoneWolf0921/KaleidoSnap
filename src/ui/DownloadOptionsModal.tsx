import { useEffect, useState } from 'react';
import { computePrintSheetLayout, getPrintPaperById, PRINT_PAPERS } from '../config/printPapers';
import type { LayoutDefinition, PaperSizeId } from '../types/booth';

interface DownloadOptionsModalProps {
  isOpen: boolean;
  layout: LayoutDefinition;
  isExporting: boolean;
  onClose: () => void;
  onExportPdf: (paperId: PaperSizeId) => Promise<void>;
}

export function DownloadOptionsModal({
  isOpen,
  layout,
  isExporting,
  onClose,
  onExportPdf,
}: DownloadOptionsModalProps) {
  const [paperId, setPaperId] = useState<PaperSizeId>('4x6');

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const paper = getPrintPaperById(paperId);
  const sheet = computePrintSheetLayout(paper, layout);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 backdrop-blur-xs sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[var(--ks-border-strong)] bg-[var(--ks-surface)] p-5 shadow-2xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-[var(--ks-border)] pb-3">
          <div>
            <h2 id="print-modal-title" className="text-base font-bold tracking-tight text-[var(--ks-ink)]">
              Print Options
            </h2>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--ks-muted)]">
              {layout.label} &bull; Auto-Layout PDF
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close print options"
            className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--ks-muted)] transition hover:bg-[var(--ks-recessed)] hover:text-[var(--ks-ink)]"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--ks-muted)]">
              Select Photo Paper Size
            </span>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {PRINT_PAPERS.map((item) => {
                const active = item.id === paperId;
                const itemSheet = computePrintSheetLayout(item, layout);
                const copyCount = itemSheet.tiles.length;
                const unitLabel = layout.id === 'strip-3'
                  ? copyCount === 1
                    ? '1 strip'
                    : `${copyCount} strips`
                  : copyCount === 1
                    ? '1 full print'
                    : `${copyCount} prints`;
                const gridTag =
                  copyCount > 1 ? ` (${itemSheet.cols}×${itemSheet.rows})` : '';
                const sizeNote =
                  item.id === 'a4'
                    ? '297×210 mm'
                    : item.id === 'letter'
                      ? '11×8.5"'
                      : item.id === '2x6'
                        ? 'Strip paper'
                        : item.id === '3r'
                          ? 'Compact print'
                          : item.id === '5x7'
                            ? 'Medium frame'
                            : 'Standard print';
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPaperId(item.id)}
                    className={`flex flex-col rounded-md border px-3 py-2 text-left transition ${
                      active
                        ? 'border-[var(--ks-accent)] bg-[var(--ks-accent-soft)] text-[var(--ks-ink)]'
                        : 'border-[var(--ks-border)] text-[var(--ks-muted)] hover:border-[var(--ks-border-strong)] hover:text-[var(--ks-ink)]'
                    }`}
                  >
                    <span className="text-xs font-bold text-[var(--ks-ink)]">{item.label}</span>
                    <span className="text-[11px] opacity-85">
                      {sizeNote} &bull; {unitLabel}{gridTag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Paper Sheet Auto-Layout Preview */}
          <div className="rounded-lg border border-[var(--ks-border)] bg-[var(--ks-recessed)] p-4">
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-[var(--ks-muted)]">
              <span>
                SHEET PREVIEW ({sheet.orientation.toUpperCase()} &bull; {sheet.sheetWidthIn}&times;{sheet.sheetHeightIn}&Prime;)
              </span>
              <span className="font-semibold text-[var(--ks-ink)]">
                {sheet.tiles.length} {sheet.tiles.length === 1 ? 'copy' : 'copies'}
              </span>
            </div>
            <div className="flex justify-center">
              <div
                className="relative w-full max-w-[220px] rounded-xs border border-[var(--ks-border-strong)] bg-white shadow-md"
                style={{
                  aspectRatio: `${sheet.sheetWidthIn} / ${sheet.sheetHeightIn}`,
                }}
              >
                {sheet.tiles.map((tile, idx) => (
                  <div
                    key={idx}
                    style={{
                      left: `${(tile.xIn / sheet.sheetWidthIn) * 100}%`,
                      top: `${(tile.yIn / sheet.sheetHeightIn) * 100}%`,
                      width: `${(tile.widthIn / sheet.sheetWidthIn) * 100}%`,
                      height: `${(tile.heightIn / sheet.sheetHeightIn) * 100}%`,
                    }}
                    className="absolute flex flex-col items-center justify-center border border-dashed border-stone-400 bg-stone-100/90 font-mono text-[10px] font-semibold text-stone-600"
                  >
                    <span>#{idx + 1}</span>
                    <span className="text-[9px] font-normal text-stone-500">
                      {tile.widthIn.toFixed(1)}&times;{tile.heightIn.toFixed(1)}&Prime;
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {sheet.hasCutMarks && (
              <p className="mt-2 text-center text-[11px] text-[var(--ks-muted)]">
                Includes full dashed cut borders &amp; corner trim ticks.
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={isExporting}
            onClick={() => void onExportPdf(paperId)}
            className="inline-flex min-h-[46px] w-full items-center justify-center rounded-md bg-[var(--ks-accent)] px-4 py-2.5 text-xs font-semibold tracking-wide text-white transition hover:bg-[var(--ks-accent-hover)] disabled:opacity-50"
          >
            {isExporting ? 'Generating Print PDF...' : `Save Print PDF (${paper.label})`}
          </button>
        </div>
      </div>
    </div>
  );
}
