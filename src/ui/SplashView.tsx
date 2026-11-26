import { useEffect, useRef, useState } from 'react';
import { playThemeInteractionSound } from '../audio/boothAudio';
import type { SessionRecord, ThemeMode } from '../types/booth';

interface SplashViewProps {
  recoverableSession: SessionRecord | null;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  theme: ThemeMode;
  onEnterBooth: () => void;
  onResumeSession: () => void;
}

type SlotPose = 'smile' | 'neko' | 'wink' | 'hearts' | 'starry';

const SLOT_POSES: SlotPose[] = ['smile', 'neko', 'wink', 'hearts', 'starry'];

function SlotFaceArt({ pose, reacting }: { pose: SlotPose; reacting: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 120"
      fill="none"
      className={`h-full w-full transition-transform duration-200 ${
        reacting ? 'scale-110' : 'scale-100'
      }`}
    >
      {/* Cat ears for neko pose */}
      {pose === 'neko' && (
        <g stroke="white" strokeWidth="2" strokeLinejoin="round">
          <path d="M56 36 L52 16 L70 28" fill="rgba(255,255,255,0.18)" />
          <path d="M104 36 L108 16 L90 28" fill="rgba(255,255,255,0.18)" />
        </g>
      )}

      {/* Head & shoulders */}
      <circle cx="80" cy="50" r="22" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.08)" />
      <path
        d="M44 108c0-20 16.1-36 36-36s36 16 36 36"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Expressions */}
      {pose === 'smile' && (
        <g stroke="white" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="72" cy="47" r="2" fill="white" />
          <circle cx="88" cy="47" r="2" fill="white" />
          <path d="M74 55 Q80 61 86 55" />
        </g>
      )}

      {pose === 'neko' && (
        <g stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M69 47 Q72 43 75 47" />
          <path d="M85 47 Q88 43 91 47" />
          <path d="M74 55 Q77 59 80 55 Q83 59 86 55" />
          <path d="M54 50 L62 51 M54 55 L62 55 M106 50 L98 51 M106 55 L98 55" />
        </g>
      )}

      {pose === 'wink' && (
        <g stroke="white" strokeWidth="2.2" strokeLinecap="round">
          <path d="M68 47 Q72 43 76 47" />
          <circle cx="88" cy="47" r="2.2" fill="white" />
          <path d="M74 55 Q80 62 87 54" />
        </g>
      )}

      {pose === 'hearts' && (
        <g fill="white" stroke="white" strokeWidth="1.4" strokeLinecap="round">
          <path d="M72 50 l-3.2-3.2 a2.2 2.2 0 0 1 3.2-3.1 a2.2 2.2 0 0 1 3.2 3.1 Z" />
          <path d="M88 50 l-3.2-3.2 a2.2 2.2 0 0 1 3.2-3.1 a2.2 2.2 0 0 1 3.2 3.1 Z" />
          <path d="M75 56 Q80 61 85 56" fill="none" strokeWidth="2" />
        </g>
      )}

      {pose === 'starry' && (
        <g stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M72 42 L73.5 45.5 L77 47 L73.5 48.5 L72 52 L70.5 48.5 L67 47 L70.5 45.5 Z" fill="white" />
          <path d="M88 42 L89.5 45.5 L93 47 L89.5 48.5 L88 52 L86.5 48.5 L83 47 L86.5 45.5 Z" fill="white" />
          <circle cx="80" cy="57" r="3" fill="rgba(255,255,255,0.35)" />
        </g>
      )}

      {/* Reaction sparkle burst */}
      {reacting && (
        <g fill="white" opacity="0.9">
          <path d="M28 24 L30 30 L36 32 L30 34 L28 40 L26 34 L20 32 L26 30 Z" />
          <path d="M132 22 L134 27 L139 29 L134 31 L132 36 L130 31 L125 29 L130 27 Z" />
        </g>
      )}
    </svg>
  );
}

export function SplashView({
  recoverableSession,
  soundEnabled,
  animationsEnabled,
  theme,
  onEnterBooth,
  onResumeSession,
}: SplashViewProps) {
  const [slotPoses, setSlotPoses] = useState<[number, number, number]>([0, 1, 2]);
  const [reactingSlot, setReactingSlot] = useState<number | null>(null);
  const [pawPressed, setPawPressed] = useState(false);

  const physicsRef = useRef({
    angle: 0.08,
    velocity: 0,
    isDragging: false,
    didDrag: false,
    startPointerX: 0,
    lastPointerX: 0,
  });
  const stripRef = useRef<HTMLDivElement | null>(null);
  const reactTimerRef = useRef<number | null>(null);
  const lastHoverSoundRef = useRef(0);

  useEffect(() => {
    return () => {
      if (reactTimerRef.current !== null) {
        window.clearTimeout(reactTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!animationsEnabled) {
      physicsRef.current.angle = 0;
      physicsRef.current.velocity = 0;
      if (stripRef.current) {
        stripRef.current.style.transform = 'rotate(0deg)';
      }
      return;
    }

    let rafId = 0;
    function step(): void {
      const p = physicsRef.current;
      if (!p.isDragging) {
        const stiffness = 0.065;
        const damping = 0.94;
        const accel = -stiffness * p.angle;
        p.velocity = (p.velocity + accel) * damping;
        p.angle += p.velocity;
      }
      if (stripRef.current) {
        const deg = (p.angle * (180 / Math.PI)).toFixed(2);
        stripRef.current.style.transform = `rotate(${deg}deg)`;
      }
      rafId = window.requestAnimationFrame(step);
    }

    rafId = window.requestAnimationFrame(step);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [animationsEnabled]);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent): void {
      const p = physicsRef.current;
      if (!p.isDragging) return;
      const dx = e.clientX - p.lastPointerX;
      p.lastPointerX = e.clientX;
      if (Math.abs(e.clientX - p.startPointerX) > 4) {
        p.didDrag = true;
      }
      // Top-pinned pendulum: dragging left (dx < 0) swings bottom left (+angle)
      p.angle = Math.max(-0.55, Math.min(0.55, p.angle - dx * 0.0045));
      p.velocity = -dx * 0.0022;
    }

    function handlePointerUp(): void {
      physicsRef.current.isDragging = false;
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  function kickStrip(impulse: number): void {
    if (!animationsEnabled) return;
    physicsRef.current.velocity += impulse;
  }

  function triggerSlotReaction(slotIdx: number, fromHover = false): void {
    if (fromHover) {
      const now = performance.now();
      if (now - lastHoverSoundRef.current < 220) return;
      lastHoverSoundRef.current = now;
    }

    playThemeInteractionSound(theme, soundEnabled);
    setSlotPoses((prev) => {
      const next: [number, number, number] = [...prev] as [number, number, number];
      next[slotIdx] = (next[slotIdx] + 1) % SLOT_POSES.length;
      return next;
    });
    setReactingSlot(slotIdx);
    if (reactTimerRef.current !== null) {
      window.clearTimeout(reactTimerRef.current);
    }
    reactTimerRef.current = window.setTimeout(() => {
      setReactingSlot(null);
    }, 320);
    kickStrip((slotIdx === 0 ? -1 : slotIdx === 2 ? 1 : Math.random() > 0.5 ? 1 : -1) * 0.055);
  }

  function handlePawToyBoop(): void {
    const targetSlot = Math.floor(Math.random() * 3);
    setPawPressed(true);
    window.setTimeout(() => setPawPressed(false), 180);
    triggerSlotReaction(targetSlot, false);
  }

  return (
    <section
      aria-labelledby="splash-heading"
      className="ks-enter mx-auto flex min-h-[calc(100dvh-7.5rem)] w-full max-w-3xl flex-col items-center justify-between gap-3 py-1 text-center lg:h-full lg:min-h-0"
    >
      <div className="pt-1">
        <h2
          id="splash-heading"
          className="text-3xl font-bold tracking-tight text-[var(--ks-ink)] sm:text-5xl"
        >
          Step in. Make faces.
        </h2>
      </div>

      {/* Interactive Swing-Physics Photo Strip + Cat Paw Shutter Toy */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex flex-col items-center pt-1">
          {/* Hanging Pin */}
          <span
            aria-hidden="true"
            className="z-10 h-3.5 w-3.5 rounded-full border-2 border-[var(--ks-ink)] bg-[var(--ks-accent)] shadow-sm"
          />

          {/* Swinging Photo Strip */}
          <div
            ref={stripRef}
            onPointerDown={(e) => {
              physicsRef.current.isDragging = true;
              physicsRef.current.didDrag = false;
              physicsRef.current.startPointerX = e.clientX;
              physicsRef.current.lastPointerX = e.clientX;
            }}
            style={{
              transformOrigin: '50% -6px',
            }}
            aria-label="Interactive swinging photo strip"
            className="mt-1 w-[144px] touch-none cursor-grab rounded-xl border-2 border-[var(--ks-border-strong)] bg-[var(--ks-surface)] p-2 shadow-2xl select-none active:cursor-grabbing sm:w-[154px]"
          >
            <div className="space-y-2">
              {[0, 1, 2].map((slotIdx) => {
                const pose = SLOT_POSES[slotPoses[slotIdx]];
                const isReacting = reactingSlot === slotIdx;
                return (
                  <button
                    key={slotIdx}
                    type="button"
                    onPointerEnter={(e) => {
                      if (e.pointerType === 'mouse' && !physicsRef.current.isDragging) {
                        triggerSlotReaction(slotIdx, true);
                      }
                    }}
                    onClick={() => {
                      if (!physicsRef.current.didDrag) {
                        triggerSlotReaction(slotIdx, false);
                      }
                    }}
                    aria-label={`React to frame ${slotIdx + 1}`}
                    className={`relative block aspect-[4/3] w-full overflow-hidden rounded-md transition-transform ${
                      isReacting ? 'scale-[1.03] ring-2 ring-white/75' : ''
                    } ${
                      slotIdx === 2
                        ? 'bg-[var(--ks-accent)]/85'
                        : slotIdx === 1
                          ? 'bg-[var(--ks-ink)]/75'
                          : 'bg-[var(--ks-ink)]/90'
                    }`}
                  >
                    <SlotFaceArt pose={pose} reacting={isReacting} />

                    <span className="absolute bottom-1 left-1.5 rounded bg-black/45 px-1.5 py-0.5 font-mono text-[9px] font-medium text-white">
                      0{slotIdx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-[var(--ks-border)] pt-2">
              <span className="text-[10px] font-bold tracking-tight text-[var(--ks-ink)]">
                KaleidoSnap
              </span>
              <span className="font-mono text-[9px] font-semibold text-[var(--ks-accent)]">
                1&times;3
              </span>
            </div>
          </div>
        </div>

        {/* Sleek Minimal Cat Paw / Shutter Toy Pill */}
        <button
          type="button"
          onClick={handlePawToyBoop}
          aria-label="Boop the strip toy"
          className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--ks-border-strong)] bg-[var(--ks-surface)]/90 px-4 py-1.5 text-xs font-semibold text-[var(--ks-ink)] shadow-md backdrop-blur-sm transition hover:border-[var(--ks-accent)] active:scale-95 ${
            pawPressed ? 'scale-95 border-[var(--ks-accent)] bg-[var(--ks-accent-soft)]' : ''
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 text-[var(--ks-accent)]"
          >
            <ellipse cx="12" cy="15.5" rx="4.5" ry="3.5" />
            <circle cx="6.5" cy="10.5" r="1.7" />
            <circle cx="10" cy="7.5" r="1.7" />
            <circle cx="14" cy="7.5" r="1.7" />
            <circle cx="17.5" cy="10.5" r="1.7" />
          </svg>
          <span>Boop Strip</span>
        </button>
      </div>

      {/* Single Bold Bottom-Center CTA */}
      <div className="pb-2">
        {recoverableSession ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onResumeSession}
              className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-[var(--ks-accent)] px-8 py-3 text-base font-bold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[var(--ks-accent-hover)] active:scale-[0.97]"
            >
              Resume Session ({recoverableSession.frames.length})
            </button>
            <button
              type="button"
              onClick={onEnterBooth}
              className="inline-flex min-h-[52px] items-center rounded-full border-2 border-[var(--ks-border-strong)] bg-[var(--ks-surface)]/95 px-6 py-3 text-sm font-bold text-[var(--ks-ink)] shadow-md backdrop-blur-sm transition hover:bg-[var(--ks-recessed)] active:scale-[0.97]"
            >
              Start Fresh
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onEnterBooth}
            className="inline-flex min-h-[54px] items-center gap-3 rounded-full bg-[var(--ks-accent)] px-9 py-3.5 text-base font-bold text-white shadow-xl transition hover:scale-[1.03] hover:bg-[var(--ks-accent-hover)] active:scale-[0.97]"
          >
            <span
              aria-hidden="true"
              className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white/85"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            Enter Booth
          </button>
        )}
      </div>
    </section>
  );
}
