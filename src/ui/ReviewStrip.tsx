import { useEffect, useRef, useState } from 'react';
import { playStickerPop } from '../audio/boothAudio';
import {
  downloadBlob,
  exportStripToBlob,
  renderStripToCanvas,
} from '../compositor/canvasCompositor';
import { FILTER_PRESETS } from '../config/filters';
import { FRAME_PRESETS, getFrameById, LAYOUTS } from '../config/layouts';
import { getStickerById, STICKER_CATEGORIES, STICKERS } from '../config/stickers';
import type {
  BoothSettings,
  CapturedFrame,
  FilterCalibration,
  FilterId,
  LayoutId,
  PlacedSticker,
  StickerCategory,
  ThemeMode,
} from '../types/booth';

interface ReviewStripProps {
  layoutId: LayoutId;
  frames: CapturedFrame[];
  filterId: FilterId;
  calibration: FilterCalibration;
  frameId: string;
  footerText: string;
  showDate: boolean;
  stickers: PlacedSticker[];
  settings: BoothSettings;
  theme: ThemeMode;
  onSelectFilter: (id: FilterId) => void;
  onUpdateCalibration: (cal: FilterCalibration) => void;
  onSelectFrame: (frameId: string) => void;
  onUpdateFooterText: (text: string) => void;
  onToggleDate: (show: boolean) => void;
  onAddSticker: (stickerId: string, x?: number, y?: number) => void;
  onUpdateSticker: (instanceId: string, patch: Partial<PlacedSticker>) => void;
  onRemoveSticker: (instanceId: string) => void;
  onRetakeSlot: (slotIndex: number) => void;
  onBackToBooth: () => void;
}

type InspectorTab = 'look' | 'print';

const CALIBRATE_DEV_MODE =
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('calibrate') === '1';

export function ReviewStrip({
  layoutId,
  frames,
  filterId,
  calibration,
  frameId,
  footerText,
  showDate,
  stickers,
  settings,
  theme,
  onSelectFilter,
  onUpdateCalibration,
  onSelectFrame,
  onUpdateFooterText,
  onToggleDate,
  onAddSticker,
  onUpdateSticker,
  onRemoveSticker,
  onRetakeSlot,
  onBackToBooth,
}: ReviewStripProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<InspectorTab>('look');
  const [stickerCategory, setStickerCategory] = useState<'all' | StickerCategory>('all');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [copiedPreset, setCopiedPreset] = useState(false);

  const layout = LAYOUTS[layoutId];
  const frameStyle = getFrameById(frameId);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;

    void renderStripToCanvas(canvas, {
      layout,
      frames,
      filterId,
      calibration,
      frameStyle,
      footerText,
      showDate,
      stickers: [],
    }).catch((err: unknown) => {
      if (!cancelled) {
        setExportError(err instanceof Error ? err.message : 'Preview render failed.');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [layout, frames, filterId, calibration, frameStyle, footerText, showDate]);

  useEffect(() => {
    const activeId = draggingId ?? resizingId ?? rotatingId;
    if (!activeId) return;

    function handleWindowPointerMove(e: PointerEvent): void {
      if (!overlayRef.current) return;
      const rect = overlayRef.current.getBoundingClientRect();

      if (rotatingId) {
        const target = stickers.find((s) => s.instanceId === rotatingId);
        if (!target) return;
        const cx = target.x * rect.width;
        const cy = target.y * rect.height;
        const dx = e.clientX - rect.left - cx;
        const dy = e.clientY - rect.top - cy;
        const deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI + 90);
        const norm = (((deg + 180) % 360) + 360) % 360 - 180;
        onUpdateSticker(rotatingId, { rotation: norm });
        return;
      }

      if (resizingId) {
        const target = stickers.find((s) => s.instanceId === resizingId);
        if (!target) return;
        const cx = target.x * rect.width;
        const cy = target.y * rect.height;
        const dx = e.clientX - rect.left - cx;
        const dy = e.clientY - rect.top - cy;
        const dist = Math.hypot(dx, dy);
        const baseHalfDiag = 0.07 * Math.SQRT2 * rect.width;
        const nextScale = Math.max(0.35, Math.min(2.4, Number((dist / baseHalfDiag).toFixed(2))));
        onUpdateSticker(resizingId, { scale: nextScale });
        return;
      }

      if (draggingId) {
        const x = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height));
        onUpdateSticker(draggingId, { x, y });
      }
    }

    function handleWindowPointerUp(): void {
      setDraggingId(null);
      setResizingId(null);
      setRotatingId(null);
    }

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [draggingId, resizingId, rotatingId, stickers, onUpdateSticker]);

  function handleDropSticker(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    const stickerId = e.dataTransfer.getData('text/plain');
    if (!stickerId || !getStickerById(stickerId) || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height));
    onAddSticker(stickerId, x, y);
  }

  async function handleExport(): Promise<void> {
    setIsExporting(true);
    setExportError(null);
    try {
      const blob = await exportStripToBlob(
        {
          layout,
          frames,
          filterId,
          calibration,
          frameStyle,
          footerText,
          showDate,
          stickers,
        },
        'png',
        settings.jpegQuality
      );
      downloadBlob(blob, `kaleidosnap-${layout.id}-${Date.now()}.png`);
    } catch (err: unknown) {
      setExportError(err instanceof Error ? err.message : 'Export failed.');
    } finally {
      setIsExporting(false);
    }
  }

  function handleCopyCalibration(): void {
    const json = JSON.stringify(calibration, null, 2);
    void navigator.clipboard?.writeText(json);
    setCopiedPreset(true);
    window.setTimeout(() => setCopiedPreset(false), 1500);
  }

  function handleStickerKeyDown(
    e: React.KeyboardEvent<HTMLDivElement>,
    placed: PlacedSticker
  ): void {
    const step = e.shiftKey ? 0.05 : 0.02;
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        onUpdateSticker(placed.instanceId, { y: Math.max(0.05, placed.y - step) });
        break;
      case 'ArrowDown':
        e.preventDefault();
        onUpdateSticker(placed.instanceId, { y: Math.min(0.95, placed.y + step) });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onUpdateSticker(placed.instanceId, { x: Math.max(0.05, placed.x - step) });
        break;
      case 'ArrowRight':
        e.preventDefault();
        onUpdateSticker(placed.instanceId, { x: Math.min(0.95, placed.x + step) });
        break;
      case '+':
      case '=':
        e.preventDefault();
        onUpdateSticker(placed.instanceId, {
          scale: Math.min(2, Number((placed.scale + 0.1).toFixed(1))),
        });
        break;
      case '-':
      case '_':
        e.preventDefault();
        onUpdateSticker(placed.instanceId, {
          scale: Math.max(0.5, Number((placed.scale - 0.1).toFixed(1))),
        });
        break;
      case '[':
        e.preventDefault();
        onUpdateSticker(placed.instanceId, {
          rotation: Math.max(-180, placed.rotation - 5),
        });
        break;
      case ']':
        e.preventDefault();
        onUpdateSticker(placed.instanceId, {
          rotation: Math.min(180, placed.rotation + 5),
        });
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        onRemoveSticker(placed.instanceId);
        setSelectedStickerId(null);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        setSelectedStickerId(placed.instanceId);
        break;
      case 'Escape':
        e.preventDefault();
        setSelectedStickerId(null);
        break;
    }
  }



  return (
    <div className="grid gap-5 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_348px]">
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-[var(--ks-border)] bg-[var(--ks-recessed)] p-4 sm:p-6 lg:h-full lg:min-h-0 lg:max-h-[780px]">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div
            ref={overlayRef}
            onPointerDown={() => setSelectedStickerId(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropSticker}
            className="relative max-h-[60vh] w-auto overflow-visible rounded shadow-2xl ring-1 ring-black/15 select-none lg:max-h-full"
            style={{ aspectRatio: `${layout.canvasWidth} / ${layout.canvasHeight}` }}
          >
            <canvas
              ref={canvasRef}
              aria-label={`${layout.label} photobooth strip preview`}
              className="block h-full w-full overflow-hidden rounded"
            />

            {stickers.map((placed) => {
              const def = getStickerById(placed.stickerId);
              if (!def) return null;
              const isSelected = placed.instanceId === selectedStickerId;
              return (
                <div
                  key={placed.instanceId}
                  style={{
                    left: `${placed.x * 100}%`,
                    top: `${placed.y * 100}%`,
                    width: `${14 * placed.scale}%`,
                    transform: `translate(-50%, -50%) rotate(${placed.rotation}deg)`,
                  }}
                  className="absolute aspect-square"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`${def.label} sticker, ${Math.round(placed.x * 100)}% across, ${Math.round(placed.y * 100)}% down`}
                    onKeyDown={(e) => handleStickerKeyDown(e, placed)}
                    onFocus={() => {
                      setSelectedStickerId(placed.instanceId);
                      setActiveTab('print');
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setDraggingId(placed.instanceId);
                      setSelectedStickerId(placed.instanceId);
                      setActiveTab('print');
                    }}
                    className={`h-full w-full cursor-grab active:cursor-grabbing ${
                      isSelected ? 'rounded ring-2 ring-[var(--ks-accent)]' : ''
                    }`}
                  >
                    <svg aria-hidden="true" viewBox={def.viewBox} className="h-full w-full drop-shadow">
                      {def.paths.map((p, idx) => (
                        <path
                          key={idx}
                          d={p.d}
                          fill={p.fill ?? 'none'}
                          stroke={p.stroke}
                          strokeWidth={p.strokeWidth}
                          opacity={p.opacity}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ))}
                    </svg>
                  </div>

                  {isSelected && (
                    <>
                      {/* Top stem rotate handle (Canva-style) */}
                      <div className="absolute -top-9 left-1/2 flex -translate-x-1/2 flex-col items-center">
                        <button
                          type="button"
                          aria-label={`Drag to rotate ${def.label} sticker`}
                          title="Drag to rotate"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            setRotatingId(placed.instanceId);
                          }}
                          className="touch-none flex h-6 w-6 cursor-grab items-center justify-center rounded-full border border-[var(--ks-border-strong)] bg-[var(--ks-surface)] text-xs font-bold text-[var(--ks-ink)] shadow-md transition hover:scale-110 active:cursor-grabbing"
                        >
                          &#8635;
                        </button>
                        <span aria-hidden="true" className="h-3 w-0.5 bg-[var(--ks-accent)]" />
                      </div>

                      {/* 4 corner resize handles */}
                      {[
                        { pos: '-top-2 -left-2 cursor-nwse-resize', label: 'top-left' },
                        { pos: '-top-2 -right-2 cursor-nesw-resize', label: 'top-right' },
                        { pos: '-bottom-2 -left-2 cursor-nesw-resize', label: 'bottom-left' },
                        { pos: '-bottom-2 -right-2 cursor-nwse-resize', label: 'bottom-right' },
                      ].map((corner) => (
                        <button
                          key={corner.label}
                          type="button"
                          aria-label={`Drag ${corner.label} corner to resize ${def.label}`}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            setResizingId(placed.instanceId);
                          }}
                          className={`touch-none absolute ${corner.pos} h-4 w-4 rounded-full border-2 border-[var(--ks-accent)] bg-white shadow-sm transition hover:scale-125`}
                        />
                      ))}

                      {/* Quick delete pill */}
                      <button
                        type="button"
                        aria-label={`Remove ${def.label} sticker`}
                        title="Remove sticker"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          onRemoveSticker(placed.instanceId);
                          setSelectedStickerId(null);
                        }}
                        className="absolute -right-2.5 -bottom-9 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--ks-border-strong)] bg-[var(--ks-surface)] text-xs font-bold text-red-600 shadow-md transition hover:bg-red-500/15 dark:text-red-400"
                      >
                        &times;
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-2 border-t border-[var(--ks-border)] pt-3"
          role="group"
          aria-label="Retake individual frame"
        >
          <span className="font-mono text-[11px] font-medium tracking-wider text-[var(--ks-muted)] uppercase">
            Retake Frame
          </span>
          {layout.slots.map((slot) => (
            <button
              key={slot.index}
              type="button"
              onClick={() => onRetakeSlot(slot.index)}
              aria-label={`Retake frame ${slot.index + 1}`}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-md border border-[var(--ks-border-strong)] bg-[var(--ks-surface)] px-3 py-1.5 font-mono text-xs font-semibold text-[var(--ks-ink)] transition hover:border-[var(--ks-ink)] active:scale-[0.99]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 text-[var(--ks-muted)]"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              #{String(slot.index + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>

      <aside className="flex flex-col overflow-hidden rounded-lg border border-[var(--ks-border)] bg-[var(--ks-surface)] lg:h-full lg:min-h-0 lg:max-h-[780px]">
        <div
          role="tablist"
          aria-label="Studio Inspector"
          className="grid grid-cols-2 border-b border-[var(--ks-border)] bg-[var(--ks-recessed)]/60 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'look'}
            onClick={() => setActiveTab('look')}
            className={`min-h-[44px] rounded-md px-3 py-2 text-xs font-semibold tracking-wide transition ${
              activeTab === 'look'
                ? 'bg-[var(--ks-surface)] text-[var(--ks-ink)] shadow-2xs ring-1 ring-[var(--ks-border)]'
                : 'text-[var(--ks-muted)] hover:text-[var(--ks-ink)]'
            }`}
          >
            Look &amp; Frame
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'print'}
            onClick={() => setActiveTab('print')}
            className={`min-h-[44px] rounded-md px-3 py-2 text-xs font-semibold tracking-wide transition ${
              activeTab === 'print'
                ? 'bg-[var(--ks-surface)] text-[var(--ks-ink)] shadow-2xs ring-1 ring-[var(--ks-border)]'
                : 'text-[var(--ks-muted)] hover:text-[var(--ks-ink)]'
            }`}
          >
            Print &amp; Stickers
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {activeTab === 'look' ? (
            <>
              <section aria-labelledby="review-filter-heading">
                <h2
                  id="review-filter-heading"
                  className="mb-2.5 font-mono text-[11px] font-semibold tracking-widest text-[var(--ks-muted)] uppercase"
                >
                  Color Filter
                </h2>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Color filter">
                  {FILTER_PRESETS.map((preset) => {
                    const active = filterId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onSelectFilter(preset.id)}
                        className={`inline-flex min-h-[44px] items-center rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                          active
                            ? 'border-[var(--ks-ink)] bg-[var(--ks-ink)] text-[var(--ks-bg)]'
                            : 'border-[var(--ks-border)] text-[var(--ks-muted)] hover:border-[var(--ks-border-strong)] hover:text-[var(--ks-ink)]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {CALIBRATE_DEV_MODE && (
                <div className="space-y-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-800 dark:text-amber-300">
                    <span>Dev Filter Calibration</span>
                    <button
                      type="button"
                      onClick={handleCopyCalibration}
                      className="min-h-[36px] rounded bg-amber-500/20 px-2.5 text-xs"
                    >
                      {copiedPreset ? 'Copied!' : 'Copy Preset TS'}
                    </button>
                  </div>
                  {(
                    [
                      ['brightness', 0.6, 1.5, 0.01],
                      ['contrast', 0.6, 1.6, 0.01],
                      ['saturate', 0, 1.8, 0.02],
                      ['sepia', 0, 1, 0.02],
                      ['grayscale', 0, 1, 0.05],
                      ['hueRotate', -45, 45, 1],
                      ['warmth', -0.5, 0.5, 0.02],
                    ] as const
                  ).map(([key, min, max, step]) => (
                    <label key={key} className="flex items-center justify-between gap-2">
                      <span className="w-20 capitalize">{key}</span>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={calibration[key]}
                        onChange={(e) =>
                          onUpdateCalibration({ ...calibration, [key]: Number(e.target.value) })
                        }
                        className="ks-range flex-1"
                      />
                      <span className="w-10 text-right font-mono tabular-nums">{calibration[key]}</span>
                    </label>
                  ))}
                </div>
              )}

              <section aria-labelledby="review-frame-heading" className="border-t border-[var(--ks-border)] pt-4">
                <h2
                  id="review-frame-heading"
                  className="mb-2.5 font-mono text-[11px] font-semibold tracking-widest text-[var(--ks-muted)] uppercase"
                >
                  Frame Stock
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {FRAME_PRESETS.map((f) => {
                    const selected = frameId === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onSelectFrame(f.id)}
                        className={`flex min-h-[44px] flex-col items-center gap-1.5 rounded-md border p-2 text-[11px] font-semibold transition ${
                          selected
                            ? 'border-[var(--ks-accent)] bg-[var(--ks-accent-soft)] text-[var(--ks-ink)]'
                            : 'border-[var(--ks-border)] text-[var(--ks-muted)] hover:border-[var(--ks-border-strong)] hover:text-[var(--ks-ink)]'
                        }`}
                      >
                        <span
                          className="h-4 w-full rounded-xs border border-black/15 dark:border-white/15"
                          style={{ backgroundColor: f.backgroundColor }}
                        />
                        <span className="w-full truncate text-center">{f.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2.5">
                <label
                  htmlFor="footer-caption-input"
                  className="block font-mono text-[11px] font-semibold tracking-widest text-[var(--ks-muted)] uppercase"
                >
                  Footer Caption
                </label>
                <input
                  id="footer-caption-input"
                  type="text"
                  maxLength={32}
                  value={footerText}
                  onChange={(e) => onUpdateFooterText(e.target.value)}
                  placeholder="KaleidoSnap"
                  className="min-h-[44px] w-full rounded-md border border-[var(--ks-border)] bg-[var(--ks-bg)] px-3 py-2 text-sm text-[var(--ks-ink)] transition"
                />
                <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5 text-xs font-medium text-[var(--ks-ink)]">
                  <input
                    type="checkbox"
                    checked={showDate}
                    onChange={(e) => onToggleDate(e.target.checked)}
                    className="h-4 w-4 rounded-xs accent-[var(--ks-accent)]"
                  />
                  Include date stamp on print
                </label>
              </section>

              <section aria-labelledby="review-stickers-heading" className="border-t border-[var(--ks-border)] pt-4">
                <h2
                  id="review-stickers-heading"
                  className="mb-2.5 font-mono text-[11px] font-semibold tracking-widest text-[var(--ks-muted)] uppercase"
                >
                  Stickers ({stickers.length})
                </h2>
                <div className="mb-2.5 flex flex-wrap gap-1" role="tablist" aria-label="Sticker categories">
                  {STICKER_CATEGORIES.map((cat) => {
                    const active = stickerCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setStickerCategory(cat.id)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                          active
                            ? 'bg-[var(--ks-accent)] text-white'
                            : 'bg-[var(--ks-bg)] text-[var(--ks-muted)] hover:text-[var(--ks-ink)]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {STICKERS.filter(
                    (s) => stickerCategory === 'all' || s.category === stickerCategory
                  ).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', s.id);
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                      onClick={() => {
                        playStickerPop(settings.soundEnabled, theme);
                        onAddSticker(s.id);
                      }}
                      title={`Drag or click to add ${s.label}`}
                      aria-label={`Add ${s.label} sticker`}
                      className="flex h-11 w-11 cursor-grab items-center justify-center rounded-md border border-[var(--ks-border)] bg-[var(--ks-bg)] p-2 transition hover:border-[var(--ks-border-strong)] active:scale-95 active:cursor-grabbing"
                    >
                      <svg aria-hidden="true" viewBox={s.viewBox} className="h-full w-full">
                        {s.paths.map((p, idx) => (
                          <path
                            key={idx}
                            d={p.d}
                            fill={p.fill ?? 'none'}
                            stroke={p.stroke}
                            strokeWidth={p.strokeWidth}
                            opacity={p.opacity}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        ))}
                      </svg>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {exportError && (
            <p
              role="alert"
              className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-300"
            >
              {exportError}
            </p>
          )}
        </div>

        <div className="flex gap-2 border-t border-[var(--ks-border)] bg-[var(--ks-surface)] p-3.5">
          <button
            type="button"
            onClick={onBackToBooth}
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[var(--ks-border)] px-3.5 py-2 text-xs font-semibold text-[var(--ks-ink)] transition hover:bg-[var(--ks-recessed)]"
          >
            &larr; Booth
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => void handleExport()}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md bg-[var(--ks-accent)] px-4 py-2 text-xs font-semibold tracking-wide text-white transition hover:bg-[var(--ks-accent-hover)] active:scale-[0.99] disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Download PNG'}
          </button>
        </div>
      </aside>
    </div>
  );
}
