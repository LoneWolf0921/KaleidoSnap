import { useEffect, useRef } from 'react';
import { playThemeInteractionSound } from '../audio/boothAudio';
import { formatStripDate } from '../compositor/canvasCompositor';
import { APP_THEMES } from '../config/themes';
import type { BoothSettings, DateFormatId } from '../types/booth';

interface SettingsModalProps {
  isOpen: boolean;
  settings: BoothSettings;
  devices: MediaDeviceInfo[];
  onClose: () => void;
  onUpdate: (patch: Partial<BoothSettings>) => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const DATE_FORMAT_OPTIONS: ReadonlyArray<{ id: DateFormatId; label: string }> = [
  { id: 'mm.dd.yyyy', label: 'MM.DD.YYYY' },
  { id: 'mm-dd-yyyy', label: 'MM-DD-YYYY' },
  { id: 'dd.mm.yyyy', label: 'DD.MM.YYYY' },
  { id: 'yyyy-mm-dd', label: 'YYYY-MM-DD' },
  { id: 'short-month', label: 'Mon DD, YYYY' },
];

export function SettingsModal({
  isOpen,
  settings,
  devices,
  onClose,
  onUpdate,
}: SettingsModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const rafId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );
        if (focusables.length === 0) {
          e.preventDefault();
          dialogRef.current.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-[var(--ks-border-strong)] bg-[var(--ks-surface)] p-5 shadow-2xl focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-[var(--ks-border)] pb-3">
          <div>
            <h2 id="settings-modal-title" className="text-base font-bold tracking-tight text-[var(--ks-ink)]">
              Studio Preferences
            </h2>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--ks-muted)]">
              Hardware &amp; Output
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close Settings"
            className="flex h-11 w-11 items-center justify-center rounded-md text-[var(--ks-muted)] transition hover:bg-[var(--ks-recessed)] hover:text-[var(--ks-ink)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="divide-y divide-[var(--ks-border)] text-sm">
          <div className="pb-4">
            <span className="mb-2 block font-mono text-[11px] font-semibold tracking-wider text-[var(--ks-muted)] uppercase">
              App Theme
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-1.5" role="group" aria-label="App Theme">
              {APP_THEMES.map((t) => {
                const active = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      onUpdate({ theme: t.id });
                      playThemeInteractionSound(t.id, settings.soundEnabled);
                    }}
                    className={`flex min-h-[44px] min-w-0 items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-xs font-semibold transition ${
                      active
                        ? 'border-[var(--ks-accent)] bg-[var(--ks-accent-soft)] text-[var(--ks-ink)]'
                        : 'border-[var(--ks-border)] text-[var(--ks-muted)] hover:border-[var(--ks-border-strong)] hover:text-[var(--ks-ink)]'
                    }`}
                  >
                    <span className="min-w-0 truncate">{t.label}</span>
                    <span aria-hidden="true" className="flex shrink-0 -space-x-1">
                      {t.swatches.map((hex, i) => (
                        <span
                          key={i}
                          style={{ backgroundColor: hex }}
                          className="h-3 w-3 rounded-full border border-black/15"
                        />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="py-4">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="countdown-select"
                className="font-mono text-[11px] font-semibold tracking-wider text-[var(--ks-muted)] uppercase"
              >
                Countdown Timer
              </label>
              <span className="rounded bg-[var(--ks-recessed)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--ks-ink)] tabular-nums">
                {settings.countdownSeconds}s
              </span>
            </div>
            <input
              id="countdown-select"
              type="range"
              min={1}
              max={10}
              step={1}
              value={settings.countdownSeconds}
              onChange={(e) => onUpdate({ countdownSeconds: Number(e.target.value) })}
              className="ks-range w-full"
            />
          </div>

          <div className="flex min-h-[60px] items-center justify-between gap-4 py-4">
            <div>
              <p className="text-xs font-semibold text-[var(--ks-ink)] sm:text-sm">Mirror Camera</p>
              <p className="text-xs text-[var(--ks-muted)]">
                Flip preview &amp; captured shots horizontally
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.mirrorCamera}
              aria-label="Mirror Camera"
              onClick={() => onUpdate({ mirrorCamera: !settings.mirrorCamera })}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
                settings.mirrorCamera ? 'bg-[var(--ks-accent)]' : 'bg-[var(--ks-border-strong)]'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 rounded-full bg-white shadow-xs transition-transform ${
                  settings.mirrorCamera ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex min-h-[60px] items-center justify-between gap-4 py-4">
            <div>
              <p className="text-xs font-semibold text-[var(--ks-ink)] sm:text-sm">Booth Sound FX</p>
              <p className="text-xs text-[var(--ks-muted)]">
                Arcade countdown chimes, shutter snap, and sticker pop
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              aria-label="Booth Sound FX"
              onClick={() => onUpdate({ soundEnabled: !settings.soundEnabled })}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
                settings.soundEnabled ? 'bg-[var(--ks-accent)]' : 'bg-[var(--ks-border-strong)]'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 rounded-full bg-white shadow-xs transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex min-h-[60px] items-center justify-between gap-4 py-4">
            <div>
              <p className="text-xs font-semibold text-[var(--ks-ink)] sm:text-sm">Animations</p>
              <p className="text-xs text-[var(--ks-muted)]">
                Opening shutter, physics strip, and theme worlds
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.animationsEnabled}
              aria-label="Animations"
              onClick={() => onUpdate({ animationsEnabled: !settings.animationsEnabled })}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
                settings.animationsEnabled ? 'bg-[var(--ks-accent)]' : 'bg-[var(--ks-border-strong)]'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 rounded-full bg-white shadow-xs transition-transform ${
                  settings.animationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="py-4">
            <label
              htmlFor="date-format-select"
              className="mb-2 block font-mono text-[11px] font-semibold tracking-wider text-[var(--ks-muted)] uppercase"
            >
              Date Stamp Format
            </label>
            <select
              id="date-format-select"
              value={settings.dateFormat}
              onChange={(e) => onUpdate({ dateFormat: e.target.value as DateFormatId })}
              className="min-h-[44px] w-full rounded-md border border-[var(--ks-border)] bg-[var(--ks-bg)] px-3 py-2 text-xs font-medium text-[var(--ks-ink)] sm:text-sm"
            >
              {DATE_FORMAT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} ({formatStripDate(new Date(), opt.id)})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <label
              htmlFor="camera-device"
              className="mb-2 block font-mono text-[11px] font-semibold tracking-wider text-[var(--ks-muted)] uppercase"
            >
              Camera Device
            </label>
            <select
              id="camera-device"
              value={settings.selectedDeviceId ?? ''}
              onChange={(e) => onUpdate({ selectedDeviceId: e.target.value || null })}
              className="min-h-[44px] w-full rounded-md border border-[var(--ks-border)] bg-[var(--ks-bg)] px-3 py-2 text-xs font-medium text-[var(--ks-ink)] sm:text-sm"
            >
              <option value="">Default Camera</option>
              {devices.map((d, idx) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
