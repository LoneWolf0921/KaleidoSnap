import { useEffect, useRef, useState } from 'react';
import { playSessionComplete, playThemeInteractionSound } from './audio/boothAudio';
import { useCameraController } from './camera/cameraController';
import { getFilterPreset } from './config/filters';
import { FRAME_PRESETS, LAYOUTS } from './config/layouts';
import { APP_THEMES, resolveThemeState } from './config/themes';
import {
  clearCurrentSession,
  DEFAULT_SESSION_TTL_MS,
  loadCurrentSession,
  saveCurrentSession,
} from './storage/sessionStore';
import type {
  BoothSettings,
  CapturedFrame,
  FilterCalibration,
  FilterId,
  LayoutId,
  PlacedSticker,
  SessionRecord,
  StorageMode,
} from './types/booth';
import { BoothView } from './ui/BoothView';
import { MascotMark } from './ui/BrandLogo';
import { DesktopBackdrop } from './ui/DesktopBackdrop';
import { OpeningShutterSplash } from './ui/OpeningShutterSplash';
import { RecoveryBanner } from './ui/RecoveryBanner';
import { ReviewStrip } from './ui/ReviewStrip';
import { SettingsModal } from './ui/SettingsModal';
import { SplashView } from './ui/SplashView';

const SETTINGS_STORAGE_KEY = 'kaleidosnap-settings-v1';

const DEFAULT_SETTINGS: BoothSettings = {
  exportFormat: 'png',
  jpegQuality: 0.92,
  theme: 'light',
  countdownSeconds: 3,
  mirrorCamera: true,
  soundEnabled: true,
  animationsEnabled: true,
  ttlMs: DEFAULT_SESSION_TTL_MS,
  selectedDeviceId: null,
};

function loadSettings(): BoothSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<BoothSettings> & { theme?: string };
    const { dataTheme } = resolveThemeState(parsed.theme ?? DEFAULT_SETTINGS.theme);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      theme: dataTheme,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function createEmptySession(layoutId: LayoutId = 'strip-3', ttlMs = DEFAULT_SESSION_TTL_MS): SessionRecord {
  const now = Date.now();
  return {
    id: 'current',
    layoutId,
    frames: [],
    filterId: 'normal',
    calibration: getFilterPreset('normal').calibration,
    frameId: FRAME_PRESETS[0].id,
    footerText: 'KaleidoSnap',
    showDate: true,
    stickers: [],
    createdAt: now,
    updatedAt: now,
    expiresAt: now + ttlMs,
  };
}

export function App() {
  const [settings, setSettings] = useState<BoothSettings>(loadSettings);
  const [session, setSession] = useState<SessionRecord>(() =>
    createEmptySession('strip-3', settings.ttlMs)
  );
  const [view, setView] = useState<'splash' | 'booth' | 'review'>('splash');
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement | null>(null);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [splashIntroActive, setSplashIntroActive] = useState(() => settings.animationsEnabled);

  const [recoverableSession, setRecoverableSession] = useState<SessionRecord | null>(null);
  const [storageMode, setStorageMode] = useState<StorageMode>('indexeddb');
  const [storageNotice, setStorageNotice] = useState<string | null>(null);

  const camera = useCameraController(settings.selectedDeviceId, view === 'booth');
  const resolvedTheme = resolveThemeState(settings.theme).dataTheme;

  // Close quick theme switcher on outside click or Escape
  useEffect(() => {
    if (!themeMenuOpen) return;
    function handlePointerDown(e: PointerEvent): void {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        setThemeMenuOpen(false);
      }
    }
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [themeMenuOpen]);

  // Sync theme mode & animation flag to <html>
  useEffect(() => {
    const root = document.documentElement;
    const { dataTheme, isDark } = resolveThemeState(settings.theme);
    root.dataset.theme = dataTheme;
    root.dataset.animations = settings.animationsEnabled ? 'on' : 'off';
    root.classList.toggle('dark', isDark);
  }, [settings.theme, settings.animationsEnabled]);

  // Startup IndexedDB recovery check
  useEffect(() => {
    let active = true;
    void loadCurrentSession().then((res) => {
      if (!active) return;
      setStorageMode(res.storageMode);
      setStorageNotice(res.notice ?? null);
      if (res.status === 'recoverable' && res.session && res.session.frames.length > 0) {
        setRecoverableSession(res.session);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  function updateSettings(patch: Partial<BoothSettings>): void {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors for settings
      }
      return next;
    });
  }

  function persistSession(next: SessionRecord): void {
    setSession(next);
    void saveCurrentSession(next, settings.ttlMs).then((res) => {
      setStorageMode(res.storageMode);
      if (res.notice) setStorageNotice(res.notice);
    });
  }

  function handleSelectLayout(layoutId: LayoutId): void {
    persistSession(createEmptySession(layoutId, settings.ttlMs));
    setRetakeIndex(null);
  }

  function handleSelectFilter(filterId: FilterId): void {
    const preset = getFilterPreset(filterId);
    persistSession({
      ...session,
      filterId,
      calibration: preset.calibration,
    });
  }

  function handleUpdateCalibration(calibration: FilterCalibration): void {
    persistSession({ ...session, calibration });
  }

  function handleFrameCaptured(frame: CapturedFrame): void {
    setSession((prev) => {
      const filtered = prev.frames.filter((f) => f.slotIndex !== frame.slotIndex);
      const nextFrames = [...filtered, frame].sort((a, b) => a.slotIndex - b.slotIndex);
      const next = { ...prev, frames: nextFrames };
      void saveCurrentSession(next, settings.ttlMs).then((res) => {
        setStorageMode(res.storageMode);
        if (res.notice) setStorageNotice(res.notice);
      });
      return next;
    });
  }

  function handleSequenceComplete(): void {
    playSessionComplete(settings.soundEnabled, resolvedTheme);
    setRetakeIndex(null);
    setView('review');
  }

  function handleRetakeSlot(slotIndex: number): void {
    setRetakeIndex(slotIndex);
    setView('booth');
  }

  function handleAddSticker(stickerId: string, x = 0.5, y = 0.5): void {
    const placed: PlacedSticker = {
      instanceId: `${stickerId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      stickerId,
      x,
      y,
      scale: 1,
      rotation: 0,
    };
    persistSession({ ...session, stickers: [...session.stickers, placed] });
  }

  function handleUpdateSticker(instanceId: string, patch: Partial<PlacedSticker>): void {
    persistSession({
      ...session,
      stickers: session.stickers.map((s) =>
        s.instanceId === instanceId ? { ...s, ...patch } : s
      ),
    });
  }

  function handleRemoveSticker(instanceId: string): void {
    persistSession({
      ...session,
      stickers: session.stickers.filter((s) => s.instanceId !== instanceId),
    });
  }

  function handleResume(): void {
    if (!recoverableSession) return;
    setSession(recoverableSession);
    setRecoverableSession(null);
    const needed = LAYOUTS[recoverableSession.layoutId].shotCount;
    setView(recoverableSession.frames.length >= needed ? 'review' : 'booth');
  }

  function handleStartNew(): void {
    setRecoverableSession(null);
    void clearCurrentSession();
    setSession(createEmptySession('strip-3', settings.ttlMs));
    setRetakeIndex(null);
    setView('booth');
  }

  function handleHeaderHomeClick(): void {
    if (view === 'splash') return;
    if (session.frames.length > 0) {
      setLeaveConfirmOpen(true);
      return;
    }
    setView('splash');
  }

  function handleConfirmLeaveToMenu(): void {
    setLeaveConfirmOpen(false);
    if (session.frames.length > 0) {
      setRecoverableSession(session);
    }
    setView('splash');
  }

  return (
    <DesktopBackdrop
      theme={resolvedTheme}
      animationsEnabled={settings.animationsEnabled}
      soundEnabled={settings.soundEnabled}
    >
      <OpeningShutterSplash
        active={splashIntroActive}
        animationsEnabled={settings.animationsEnabled}
        onComplete={() => setSplashIntroActive(false)}
      />

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Full-Bleed Purikura Kiosk Top Floating Bar */}
      <header className="relative z-30 mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        {/* Top-Left: Brand Pill + Stage Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleHeaderHomeClick}
            aria-label="KaleidoSnap Home"
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--ks-border-strong)] bg-[var(--ks-surface)]/90 px-3.5 py-1 shadow-sm backdrop-blur-md transition hover:opacity-85"
          >
            <MascotMark size="sm" />
            <h1 className="font-mono text-xs font-bold tracking-tight text-[var(--ks-ink)] sm:text-sm">
              KaleidoSnap
            </h1>
          </button>

          <nav
            aria-label="Booth stage"
            className="flex items-center gap-1 rounded-full border border-[var(--ks-border-strong)] bg-[var(--ks-surface)]/90 p-1 shadow-sm backdrop-blur-md"
          >
            <button
              type="button"
              onClick={handleHeaderHomeClick}
              aria-current={view === 'splash' ? 'page' : undefined}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                view === 'splash'
                  ? 'bg-[var(--ks-accent)] text-white'
                  : 'text-[var(--ks-muted)] hover:text-[var(--ks-ink)]'
              }`}
            >
              Welcome
            </button>
            <button
              type="button"
              onClick={() => {
                if (view !== 'booth') setView('booth');
              }}
              aria-current={view === 'booth' ? 'page' : undefined}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                view === 'booth'
                  ? 'bg-[var(--ks-accent)] text-white'
                  : 'text-[var(--ks-muted)] hover:text-[var(--ks-ink)]'
              }`}
            >
              Booth
            </button>
            <button
              type="button"
              disabled={session.frames.length === 0}
              onClick={() => setView('review')}
              aria-current={view === 'review' ? 'page' : undefined}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-40 ${
                view === 'review'
                  ? 'bg-[var(--ks-accent)] text-white'
                  : 'text-[var(--ks-muted)] hover:text-[var(--ks-ink)]'
              }`}
            >
              Light Table
            </button>
          </nav>
        </div>

        {/* Top-Right: Theme + Sound + Settings Pills */}
        <div className="relative flex flex-wrap items-center gap-2">
          <div ref={themeMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setThemeMenuOpen((prev) => !prev)}
              aria-expanded={themeMenuOpen}
              aria-label="Switch app theme"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--ks-border-strong)] bg-[var(--ks-surface)]/90 px-3.5 text-xs font-semibold text-[var(--ks-ink)] shadow-sm backdrop-blur-md transition hover:border-[var(--ks-accent)] active:scale-[0.98]"
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-full border border-black/15 bg-[var(--ks-accent)]"
              />
              <span>
                {APP_THEMES.find((t) => t.id === resolveThemeState(settings.theme).dataTheme)?.label ?? 'Theme'}
              </span>
            </button>

            {themeMenuOpen && (
              <div
                role="menu"
                aria-label="Quick Theme Switcher"
                className="absolute right-0 top-full z-40 mt-2 w-52 rounded-xl border border-[var(--ks-border-strong)] bg-[var(--ks-surface)] p-1.5 shadow-2xl"
              >
                {APP_THEMES.map((t) => {
                  const active = resolveThemeState(settings.theme).dataTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={active}
                      onClick={() => {
                        updateSettings({ theme: t.id });
                        playThemeInteractionSound(t.id, settings.soundEnabled);
                        setThemeMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${
                        active
                          ? 'bg-[var(--ks-accent-soft)] text-[var(--ks-ink)]'
                          : 'text-[var(--ks-muted)] hover:bg-[var(--ks-recessed)] hover:text-[var(--ks-ink)]'
                      }`}
                    >
                      <span>{t.label}</span>
                      <span aria-hidden="true" className="flex -space-x-1">
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
            )}
          </div>

          <button
            type="button"
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            aria-label={settings.soundEnabled ? 'Mute booth sound FX' : 'Unmute booth sound FX'}
            aria-pressed={settings.soundEnabled}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-[var(--ks-border-strong)] bg-[var(--ks-surface)]/90 px-3.5 text-xs font-semibold text-[var(--ks-ink)] shadow-sm backdrop-blur-md transition hover:border-[var(--ks-accent)] active:scale-[0.98]"
          >
            <span>{settings.soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open Settings"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-[var(--ks-border-strong)] bg-[var(--ks-surface)]/90 px-3.5 text-xs font-semibold text-[var(--ks-ink)] shadow-sm backdrop-blur-md transition hover:border-[var(--ks-accent)] active:scale-[0.98]"
          >
            Settings
          </button>
        </div>
      </header>

      {/* Centered Full-Bleed Kiosk Stage */}
      <div className="mx-auto flex w-full max-w-[1260px] flex-1 flex-col px-4 pb-6 sm:px-6 lg:min-h-0 lg:pb-4">
        <RecoveryBanner
          storageMode={storageMode}
          storageNotice={storageNotice}
          onDismissNotice={() => setStorageNotice(null)}
        />

        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none lg:min-h-0 lg:overflow-y-auto">
          {view === 'splash' ? (
            <SplashView
              recoverableSession={recoverableSession}
              soundEnabled={settings.soundEnabled}
              animationsEnabled={settings.animationsEnabled}
              theme={resolvedTheme}
              onEnterBooth={handleStartNew}
              onResumeSession={handleResume}
            />
          ) : view === 'booth' ? (
            <BoothView
              camera={camera}
              layoutId={session.layoutId}
              frames={session.frames}
              calibration={session.calibration}
              countdownSeconds={settings.countdownSeconds}
              mirrorCamera={settings.mirrorCamera}
              soundEnabled={settings.soundEnabled}
              theme={resolvedTheme}
              retakeIndex={retakeIndex}
              onSelectLayout={handleSelectLayout}
              onFrameCaptured={handleFrameCaptured}
              onSequenceComplete={handleSequenceComplete}
              onCancelRetake={() => {
                setRetakeIndex(null);
                setView('review');
              }}
              onGoToReview={() => setView('review')}
            />
          ) : (
            <ReviewStrip
              layoutId={session.layoutId}
              frames={session.frames}
              filterId={session.filterId}
              calibration={session.calibration}
              frameId={session.frameId}
              footerText={session.footerText}
              showDate={session.showDate}
              stickers={session.stickers}
              settings={settings}
              theme={resolvedTheme}
              onSelectFilter={handleSelectFilter}
              onUpdateCalibration={handleUpdateCalibration}
              onSelectFrame={(frameId) => persistSession({ ...session, frameId })}
              onUpdateFooterText={(footerText) => persistSession({ ...session, footerText })}
              onToggleDate={(showDate) => persistSession({ ...session, showDate })}
              onAddSticker={handleAddSticker}
              onUpdateSticker={handleUpdateSticker}
              onRemoveSticker={handleRemoveSticker}
              onRetakeSlot={handleRetakeSlot}
              onBackToBooth={() => setView('booth')}
            />
          )}
        </main>
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        settings={settings}
        devices={camera.devices}
        onClose={() => setSettingsOpen(false)}
        onUpdate={updateSettings}
      />

      {leaveConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-confirm-title"
          onClick={() => setLeaveConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-[var(--ks-border-strong)] bg-[var(--ks-surface)] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="leave-confirm-title" className="text-base font-bold text-[var(--ks-ink)]">
              Return to menu?
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--ks-muted)]">
              Your current shots are saved locally and can be resumed from the menu.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLeaveConfirmOpen(false)}
                className="inline-flex min-h-[44px] items-center rounded-md border border-[var(--ks-border)] px-3.5 py-2 text-xs font-semibold text-[var(--ks-ink)] transition hover:bg-[var(--ks-recessed)]"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={handleConfirmLeaveToMenu}
                className="inline-flex min-h-[44px] items-center rounded-md bg-[var(--ks-accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--ks-accent-hover)]"
              >
                Return to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </DesktopBackdrop>
  );
}

export default App;
