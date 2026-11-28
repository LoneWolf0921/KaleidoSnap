import { useEffect, useRef, useState } from 'react';
import { playCountdownTick, playShutterClick } from '../audio/boothAudio';
import type { CameraControllerState } from '../camera/cameraController';
import { buildCssFilterString, getWarmthOverlayColor } from '../config/filters';
import { LAYOUT_LIST, LAYOUTS } from '../config/layouts';
import type {
  CapturedFrame,
  FilterCalibration,
  LayoutId,
  ThemeMode,
} from '../types/booth';

interface BoothViewProps {
  camera: CameraControllerState;
  layoutId: LayoutId;
  frames: CapturedFrame[];
  calibration: FilterCalibration;
  countdownSeconds: number;
  mirrorCamera: boolean;
  soundEnabled: boolean;
  theme: ThemeMode;
  retakeIndex: number | null;
  onSelectLayout: (id: LayoutId, preservedFrames?: CapturedFrame[]) => void;
  onFrameCaptured: (frame: CapturedFrame) => void;
  onSequenceComplete: () => void;
  onCancelRetake: () => void;
  onGoToReview: () => void;
}

function LayoutIcon({ id }: { id: LayoutId }) {
  if (id === 'single') {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
        <rect x="3" y="3" width="14" height="14" rx="1.5" fill="currentColor" opacity="0.85" />
      </svg>
    );
  }
  if (id === 'strip-3') {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
        <rect x="6" y="2" width="8" height="4.5" rx="0.8" fill="currentColor" opacity="0.85" />
        <rect x="6" y="7.75" width="8" height="4.5" rx="0.8" fill="currentColor" opacity="0.85" />
        <rect x="6" y="13.5" width="8" height="4.5" rx="0.8" fill="currentColor" opacity="0.85" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
      <rect x="3" y="3" width="6" height="6" rx="1" fill="currentColor" opacity="0.85" />
      <rect x="11" y="3" width="6" height="6" rx="1" fill="currentColor" opacity="0.85" />
      <rect x="3" y="11" width="6" height="6" rx="1" fill="currentColor" opacity="0.85" />
      <rect x="11" y="11" width="6" height="6" rx="1" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

export function BoothView({
  camera,
  layoutId,
  frames,
  calibration,
  countdownSeconds,
  mirrorCamera,
  soundEnabled,
  theme,
  retakeIndex,
  onSelectLayout,
  onFrameCaptured,
  onSequenceComplete,
  onCancelRetake,
  onGoToReview,
}: BoothViewProps) {
  const layout = LAYOUTS[layoutId];
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentShotNumber, setCurrentShotNumber] = useState<number>(0);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [pendingLayoutId, setPendingLayoutId] = useState<LayoutId | null>(null);
  const [selectedKeepIndices, setSelectedKeepIndices] = useState<number[]>([]);
  const [overwriteConfirmOpen, setOverwriteConfirmOpen] = useState(false);
  const cancelRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  async function runCountdownAndCapture(): Promise<void> {
    if (!camera.isReady || isCapturing) return;
    cancelRef.current = false;
    setCaptureError(null);
    setIsCapturing(true);

    const filledSet = new Set(frames.map((f) => f.slotIndex));
    const allSlots = Array.from({ length: layout.shotCount }, (_, i) => i);
    const missingSlots = allSlots.filter((i) => !filledSet.has(i));
    const targetSlots =
      retakeIndex !== null
        ? [retakeIndex]
        : missingSlots.length > 0 && missingSlots.length < layout.shotCount
          ? missingSlots
          : allSlots;

    try {
      for (let i = 0; i < targetSlots.length; i++) {
        if (cancelRef.current) break;
        const slotIndex = targetSlots[i];
        setCurrentShotNumber(retakeIndex !== null ? 1 : slotIndex + 1);
        setActiveSlotIndex(slotIndex);

        for (let sec = countdownSeconds; sec >= 1; sec--) {
          if (cancelRef.current) break;
          setCountdown(sec);
          playCountdownTick(sec, soundEnabled, theme);
          await new Promise((r) => window.setTimeout(r, 1000));
        }
        if (cancelRef.current) break;

        setCountdown(null);
        playShutterClick(soundEnabled, theme);
        const frame = camera.captureFrame(slotIndex, mirrorCamera);
        setFlash(true);
        window.setTimeout(() => setFlash(false), 180);
        onFrameCaptured(frame);

        if (i < targetSlots.length - 1) {
          await new Promise((r) => window.setTimeout(r, 650));
        }
      }

      if (!cancelRef.current) {
        onSequenceComplete();
      }
    } catch (err: unknown) {
      setCaptureError(err instanceof Error ? err.message : 'Capture failed.');
    } finally {
      setCountdown(null);
      setActiveSlotIndex(null);
      setIsCapturing(false);
    }
  }

  function handleStopCapture(): void {
    cancelRef.current = true;
    setCountdown(null);
    setActiveSlotIndex(null);
    setIsCapturing(false);
  }

  function handleFormatClick(nextId: LayoutId): void {
    if (nextId === layoutId) return;
    if (frames.length === 0) {
      onSelectLayout(nextId, []);
      return;
    }
    const maxKeep = LAYOUTS[nextId].shotCount;
    setSelectedKeepIndices(frames.slice(0, maxKeep).map((f) => f.slotIndex));
    setPendingLayoutId(nextId);
  }

  function handleToggleKeepSlot(slotIndex: number): void {
    if (!pendingLayoutId) return;
    const maxKeep = LAYOUTS[pendingLayoutId].shotCount;
    setSelectedKeepIndices((prev) => {
      if (prev.includes(slotIndex)) {
        return prev.filter((i) => i !== slotIndex);
      }
      if (maxKeep === 1) {
        return [slotIndex];
      }
      if (prev.length >= maxKeep) {
        return [...prev.slice(1), slotIndex];
      }
      return [...prev, slotIndex];
    });
  }

  function handleConfirmLayoutSwitch(keepSelected: boolean): void {
    if (!pendingLayoutId) return;
    const preserved = keepSelected
      ? frames.filter((f) => selectedKeepIndices.includes(f.slotIndex))
      : [];
    onSelectLayout(pendingLayoutId, preserved);
    setPendingLayoutId(null);
    setSelectedKeepIndices([]);
  }

  const warmthOverlay = getWarmthOverlayColor(calibration.warmth);
  const totalInRun = retakeIndex !== null ? 1 : layout.shotCount;
  const filledSlotSet = new Set(frames.map((f) => f.slotIndex));
  const remainingCount = Array.from({ length: layout.shotCount }, (_, i) => i).filter(
    (i) => !filledSlotSet.has(i)
  ).length;
  const allSlotsFull = retakeIndex === null && remainingCount === 0;

  const keyHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {});
  keyHandlerRef.current = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (overwriteConfirmOpen) {
        e.preventDefault();
        setOverwriteConfirmOpen(false);
        return;
      }
      if (pendingLayoutId !== null) {
        e.preventDefault();
        setPendingLayoutId(null);
        setSelectedKeepIndices([]);
        return;
      }
      if (document.querySelector('[role="dialog"], [role="menu"]')) {
        return;
      }
      if (isCapturing) {
        e.preventDefault();
        handleStopCapture();
      }
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (overwriteConfirmOpen || pendingLayoutId !== null) return;
      if (document.querySelector('[role="dialog"], [role="menu"]')) return;
      if (!camera.isReady || isCapturing) return;

      const activeEl = document.activeElement;
      if (activeEl instanceof HTMLElement) {
        const tag = activeEl.tagName;
        if (
          tag === 'INPUT' ||
          tag === 'SELECT' ||
          tag === 'TEXTAREA' ||
          tag === 'BUTTON' ||
          tag === 'A' ||
          activeEl.isContentEditable ||
          activeEl.closest('button, a, input, select, textarea, [role="button"], [role="menu"]')
        ) {
          return;
        }
      }

      e.preventDefault();
      if (allSlotsFull) {
        setOverwriteConfirmOpen(true);
      } else {
        void runCountdownAndCapture();
      }
    }
  };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent): void {
      keyHandlerRef.current(e);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const slotGridClass =
    layoutId === 'single'
      ? 'grid-cols-1 max-w-[200px] mx-auto'
      : layoutId === 'strip-3'
        ? 'grid-cols-1 max-w-[148px] mx-auto gap-2'
        : 'grid-cols-2 gap-2';

  return (
    <div className="ks-enter grid gap-5 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_288px]">
      <div className="flex flex-col gap-3.5 lg:h-full lg:min-h-0">
        {retakeIndex !== null && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--ks-border-strong)] bg-[var(--ks-surface)] px-4 py-2 text-xs sm:text-sm">
            <span className="text-[var(--ks-ink)]">
              Retaking <strong className="font-mono">#{String(retakeIndex + 1).padStart(2, '0')}</strong> &mdash; other frames preserved
            </span>
            <button
              type="button"
              onClick={onCancelRetake}
              disabled={isCapturing}
              className="inline-flex min-h-[44px] items-center rounded-md border border-[var(--ks-border)] px-3 py-1.5 text-xs font-semibold text-[var(--ks-ink)] transition hover:bg-[var(--ks-recessed)] disabled:opacity-50"
            >
              Back to Light Table
            </button>
          </div>
        )}

        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-[var(--ks-border-strong)] bg-[#0D0C0B] sm:aspect-[4/3] lg:aspect-auto lg:min-h-0 lg:flex-1">
          {camera.error ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center text-stone-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-white/15 bg-white/5 text-[var(--ks-accent)]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M10.66 6H14l2 2h4a2 2 0 0 1 2 2v7.34" />
                  <path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              </div>
              <p className="max-w-md text-sm text-stone-300">{camera.error}</p>
              <button
                type="button"
                onClick={camera.retry}
                className="inline-flex min-h-[44px] items-center rounded-md bg-[var(--ks-accent)] px-5 py-2.5 text-xs font-semibold tracking-wide text-white transition hover:bg-[var(--ks-accent-hover)]"
              >
                Retry Camera
              </button>
            </div>
          ) : (
            <>
              <video
                ref={camera.videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  transform: mirrorCamera ? 'scaleX(-1)' : 'none',
                  filter: buildCssFilterString(calibration),
                }}
                className="h-full w-full object-cover"
              />
              {warmthOverlay && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ backgroundColor: warmthOverlay }}
                />
              )}

              {/* Optical viewfinder corner reticles + slot framing guide */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-3 flex items-center justify-center">
                <span className="absolute top-0 left-0 h-3.5 w-3.5 border-t border-l border-white/30" />
                <span className="absolute top-0 right-0 h-3.5 w-3.5 border-t border-r border-white/30" />
                <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-white/30" />
                <span className="absolute right-0 bottom-0 h-3.5 w-3.5 border-r border-b border-white/30" />
                <div
                  className="h-[88%] max-w-[90%] rounded-sm border border-dashed border-white/25"
                  style={{
                    aspectRatio: `${layout.slots[0].width} / ${layout.slots[0].height}`,
                  }}
                />
              </div>

              <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded bg-black/65 px-2 py-1 font-mono text-[11px] font-medium tracking-wider text-white uppercase backdrop-blur-xs">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      camera.isReady ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                    }`}
                  />
                  {camera.isReady ? 'Live' : 'Connecting'}
                </span>
                {mirrorCamera && (
                  <span className="rounded bg-black/65 px-2 py-1 font-mono text-[11px] font-medium tracking-wider text-stone-200 uppercase backdrop-blur-xs">
                    Mirror
                  </span>
                )}
              </div>

              <div className="pointer-events-none absolute top-4 right-4 hidden sm:block">
                <span className="rounded bg-black/65 px-2 py-1 font-mono text-[11px] font-medium tracking-wider text-stone-200 uppercase backdrop-blur-xs">
                  {countdownSeconds}s Timer
                </span>
              </div>

              {!camera.isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0D0C0B]/80 font-mono text-xs tracking-wider text-stone-300 uppercase">
                  Initializing sensor...
                </div>
              )}
            </>
          )}

          {countdown !== null && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[1px]">
              <span className="font-mono text-7xl font-semibold tracking-tighter text-white tabular-nums drop-shadow-xl sm:text-8xl">
                {countdown}
              </span>
              <span className="mt-2 rounded bg-black/70 px-3 py-1 font-mono text-[11px] font-medium tracking-widest text-white uppercase backdrop-blur-xs">
                Shot {currentShotNumber} / {totalInRun}
              </span>
            </div>
          )}

          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {countdown !== null ? `Shot ${currentShotNumber} of ${totalInRun}, ${countdown}` : ''}
          </div>

          {flash && <div className="pointer-events-none absolute inset-0 bg-white/85 transition-opacity" />}
        </div>

        {captureError && (
          <p
            role="alert"
            className="rounded-md border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-700 dark:text-red-300"
          >
            {captureError}
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
          {isCapturing ? (
            <>
              <span className="hidden font-mono text-[11px] text-[var(--ks-muted)] sm:inline">
                Esc to cancel
              </span>
              <button
                type="button"
                onClick={handleStopCapture}
                className="inline-flex min-h-[44px] items-center rounded-md border border-[var(--ks-border-strong)] bg-[var(--ks-recessed)] px-5 py-2 text-xs font-semibold tracking-wide text-[var(--ks-ink)] transition hover:opacity-90"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {camera.isReady && (
                <span className="hidden font-mono text-[11px] text-[var(--ks-muted)] sm:inline">
                  Space / Enter to capture
                </span>
              )}
              <button
                type="button"
                disabled={!camera.isReady}
                onClick={() => {
                  if (allSlotsFull) {
                    setOverwriteConfirmOpen(true);
                  } else {
                    void runCountdownAndCapture();
                  }
                }}
                className="inline-flex min-h-[44px] items-center gap-2.5 rounded-md bg-[var(--ks-accent)] px-6 py-2.5 text-xs font-semibold tracking-wide text-white transition hover:bg-[var(--ks-accent-hover)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span
                  aria-hidden="true"
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/80"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                {retakeIndex !== null
                  ? `Retake #${String(retakeIndex + 1).padStart(2, '0')}`
                  : remainingCount > 0 && remainingCount < layout.shotCount
                    ? `Capture ${remainingCount} More Shot${remainingCount > 1 ? 's' : ''}`
                    : `Capture ${layout.shotCount} Shot${layout.shotCount > 1 ? 's' : ''}`}
              </button>
            </>
          )}
        </div>
      </div>

      <aside className="flex flex-col justify-between gap-5 rounded-lg border border-[var(--ks-border)] bg-[var(--ks-surface)] p-4 lg:h-full lg:max-h-full lg:overflow-y-auto">
        <div className="space-y-5">
          <section aria-labelledby="booth-layout-heading">
            <h2
              id="booth-layout-heading"
              className="mb-2.5 font-mono text-[11px] font-semibold tracking-widest text-[var(--ks-muted)] uppercase"
            >
              Format
            </h2>
            <div className="space-y-1.5">
              {LAYOUT_LIST.map((item) => {
                const selected = layoutId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={isCapturing || retakeIndex !== null}
                    onClick={() => handleFormatClick(item.id)}
                    className={`flex min-h-[44px] w-full items-center justify-between rounded-md border px-3 py-2 text-left text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${
                      selected
                        ? 'border-[var(--ks-accent)] bg-[var(--ks-accent-soft)] text-[var(--ks-ink)]'
                        : 'border-[var(--ks-border)] bg-transparent text-[var(--ks-muted)] hover:border-[var(--ks-border-strong)] hover:text-[var(--ks-ink)]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={selected ? 'text-[var(--ks-accent)]' : ''}>
                        <LayoutIcon id={item.id} />
                      </span>
                      <span>{item.label}</span>
                    </span>
                    <span className="font-mono text-[11px] font-medium opacity-80">
                      {item.shotCount}F
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="booth-slots-heading" className="border-t border-[var(--ks-border)] pt-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2
                id="booth-slots-heading"
                className="font-mono text-[11px] font-semibold tracking-widest text-[var(--ks-muted)] uppercase"
              >
                Film Strip ({frames.length}/{layout.shotCount})
              </h2>
              {frames.length === layout.shotCount && (
                <button
                  type="button"
                  onClick={onGoToReview}
                  className="inline-flex min-h-[36px] items-center rounded-md px-2 text-xs font-semibold text-[var(--ks-accent)] transition hover:bg-[var(--ks-accent-soft)]"
                >
                  Light Table &rarr;
                </button>
              )}
            </div>

            <div className={`grid ${slotGridClass}`}>
              {layout.slots.map((slot) => {
                const frame = frames.find((f) => f.slotIndex === slot.index);
                const isSlotActive = activeSlotIndex === slot.index;
                return (
                  <div
                    key={slot.index}
                    className={`relative aspect-[4/3] overflow-hidden rounded border transition ${
                      isSlotActive
                        ? 'border-[var(--ks-accent)] ring-2 ring-[var(--ks-accent)]/30'
                        : 'border-[var(--ks-border)] bg-[var(--ks-recessed)]'
                    }`}
                  >
                    {frame ? (
                      <>
                        <img
                          src={frame.dataUrl}
                          alt={`Captured shot ${slot.index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white tabular-nums">
                          #{String(slot.index + 1).padStart(2, '0')}
                        </span>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center font-mono text-[11px] font-medium text-[var(--ks-muted)] tabular-nums">
                        #{String(slot.index + 1).padStart(2, '0')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </aside>

      {overwriteConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="overwrite-confirm-title"
          onClick={() => setOverwriteConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-[var(--ks-border-strong)] bg-[var(--ks-surface)] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="overwrite-confirm-title" className="text-base font-bold text-[var(--ks-ink)]">
              Overwrite existing photo{layout.shotCount > 1 ? 's' : ''}?
            </h3>
            <p className="mt-1.5 text-xs text-[var(--ks-muted)]">
              All {layout.shotCount} slot{layout.shotCount > 1 ? 's' : ''} in{' '}
              <strong className="text-[var(--ks-ink)]">{layout.label}</strong> are already filled.
              Capturing again will replace your current photo{layout.shotCount > 1 ? 's' : ''}.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOverwriteConfirmOpen(false)}
                className="inline-flex min-h-[40px] items-center rounded-md border border-[var(--ks-border)] px-3.5 py-2 text-xs font-semibold text-[var(--ks-ink)] transition hover:bg-[var(--ks-recessed)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setOverwriteConfirmOpen(false);
                  void runCountdownAndCapture();
                }}
                className="inline-flex min-h-[40px] items-center rounded-md bg-[var(--ks-accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--ks-accent-hover)]"
              >
                Overwrite &amp; Capture
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingLayoutId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="switch-format-title"
          onClick={() => setPendingLayoutId(null)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[var(--ks-border-strong)] bg-[var(--ks-surface)] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="switch-format-title" className="text-base font-bold text-[var(--ks-ink)]">
              Switch to {LAYOUTS[pendingLayoutId].label}?
            </h3>
            <p className="mt-1 text-xs text-[var(--ks-muted)]">
              You have {frames.length} captured shot{frames.length > 1 ? 's' : ''}. Select up to{' '}
              {LAYOUTS[pendingLayoutId].shotCount} shot{LAYOUTS[pendingLayoutId].shotCount > 1 ? 's' : ''} to
              preserve, or clear all and start fresh.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {frames.map((frame) => {
                const isKept = selectedKeepIndices.includes(frame.slotIndex);
                return (
                  <button
                    key={frame.slotIndex}
                    type="button"
                    aria-pressed={isKept}
                    onClick={() => handleToggleKeepSlot(frame.slotIndex)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                      isKept
                        ? 'border-[var(--ks-accent)] ring-2 ring-[var(--ks-accent)]/30'
                        : 'border-[var(--ks-border)] opacity-55 hover:opacity-85'
                    }`}
                  >
                    <img
                      src={frame.dataUrl}
                      alt={`Shot ${frame.slotIndex + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-1 left-1 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                      #{String(frame.slotIndex + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`absolute right-1 bottom-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                        isKept
                          ? 'bg-[var(--ks-accent)] text-white'
                          : 'border border-white/70 bg-black/40 text-transparent'
                      }`}
                    >
                      &#10003;
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingLayoutId(null)}
                className="inline-flex min-h-[40px] items-center rounded-md border border-[var(--ks-border)] px-3.5 py-2 text-xs font-semibold text-[var(--ks-ink)] transition hover:bg-[var(--ks-recessed)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmLayoutSwitch(false)}
                className="inline-flex min-h-[40px] items-center rounded-md border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-500/20 dark:text-red-300"
              >
                Clear All
              </button>
              <button
                type="button"
                disabled={selectedKeepIndices.length === 0}
                onClick={() => handleConfirmLayoutSwitch(true)}
                className="inline-flex min-h-[40px] items-center rounded-md bg-[var(--ks-accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--ks-accent-hover)] disabled:opacity-45"
              >
                Keep {selectedKeepIndices.length} &amp; Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
