import { useEffect, useRef, useState } from 'react';

interface OpeningShutterSplashProps {
  active: boolean;
  animationsEnabled: boolean;
  onComplete: () => void;
}

const SPLASH_DURATION_MS = 1600;

export function OpeningShutterSplash({
  active,
  animationsEnabled,
  onComplete,
}: OpeningShutterSplashProps) {
  const [progress, setProgress] = useState(0);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const lengthsRef = useRef<number[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    if (!animationsEnabled) {
      setProgress(0);
      onCompleteRef.current();
      return;
    }

    setProgress(0);
    lengthsRef.current = pathRefs.current.map((el) => (el ? el.getTotalLength() : 200));

    let rafId = 0;
    const start = performance.now();

    function step(now: number): void {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / SPLASH_DURATION_MS);
      setProgress(t);
      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        onCompleteRef.current();
      }
    }

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        onCompleteRef.current();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    rafId = window.requestAnimationFrame(step);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [active, animationsEnabled]);

  if (!active || !animationsEnabled) return null;

  // Phase 1: 0 -> 0.58 (draw SVG art)
  const drawT = Math.min(1, progress / 0.58);
  const easedDraw = 1 - Math.pow(1 - drawT, 3);

  // Phase 2: 0.58 -> 0.82 (shutter flash + blades part)
  const openT = Math.max(0, Math.min(1, (progress - 0.58) / 0.24));
  const easedOpen = 1 - Math.pow(1 - openT, 3);

  // Phase 3: 0.82 -> 1.0 (fade out)
  const fadeT = Math.max(0, Math.min(1, (progress - 0.82) / 0.18));

  const flashAlpha =
    progress > 0.55 && progress < 0.76
      ? Math.sin(((progress - 0.55) / 0.21) * Math.PI) * 0.72
      : 0;

  const bladeOffset = easedOpen * 105;
  const overlayOpacity = 1 - fadeT;
  const artScale = 0.94 + easedDraw * 0.06 + easedOpen * 0.08;
  const artOpacity = progress < 0.65 ? 1 : Math.max(0, 1 - (progress - 0.65) / 0.2);

  const drawnPaths = [
    // Camera body outline
    'M 56 88 H 184 Q 198 88 198 102 V 176 Q 198 190 184 190 H 56 Q 42 190 42 176 V 102 Q 42 88 56 88 Z',
    // Top viewfinder hump
    'M 86 88 L 98 66 H 142 L 154 88',
    // Outer lens ring
    'M 120 105 A 34 34 0 1 1 119.9 105 Z',
    // Inner iris ring
    'M 120 120 A 19 19 0 1 1 119.9 120 Z',
    // Left & right sparkles
    'M 28 58 L 32 70 L 44 74 L 32 78 L 28 90 L 24 78 L 12 74 L 24 70 Z',
    'M 210 52 L 214 64 L 226 68 L 214 72 L 210 84 L 206 72 L 194 68 L 206 64 Z',
  ];

  return (
    <div
      role="presentation"
      onClick={() => onComplete()}
      style={{ opacity: overlayOpacity }}
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center overflow-hidden select-none"
    >
      {/* Left & Right Shutter Blades */}
      <div
        aria-hidden="true"
        style={{ transform: `translateX(-${bladeOffset}%)` }}
        className="absolute inset-y-0 left-0 w-[calc(50%+1px)] bg-[var(--ks-bg)]"
      />
      <div
        aria-hidden="true"
        style={{ transform: `translateX(${bladeOffset}%)` }}
        className="absolute inset-y-0 right-0 w-[calc(50%+1px)] bg-[var(--ks-bg)]"
      />

      {/* Drawn SVG Splash Art */}
      <div
        style={{
          opacity: artOpacity,
          transform: `scale(${artScale})`,
        }}
        className="relative z-10 flex flex-col items-center gap-3"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 240 220"
          className="h-44 w-48 sm:h-52 sm:w-56"
          fill="none"
        >
          {drawnPaths.map((d, idx) => {
            const len = lengthsRef.current[idx] ?? 400;
            const stagger = idx * 0.06;
            const localT = Math.max(0, Math.min(1, (easedDraw - stagger) / (1 - stagger)));
            const isAccent = idx >= 3;
            return (
              <path
                key={idx}
                ref={(el) => {
                  pathRefs.current[idx] = el;
                }}
                d={d}
                stroke={isAccent ? 'var(--ks-accent)' : 'var(--ks-ink)'}
                strokeWidth={idx === 2 ? 4.5 : 3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - localT)}
              />
            );
          })}
        </svg>
        <span
          style={{ opacity: Math.max(0, Math.min(1, (easedDraw - 0.35) / 0.45)) }}
          className="font-mono text-xs font-bold tracking-[0.26em] text-[var(--ks-ink)] uppercase"
        >
          KaleidoSnap
        </span>
      </div>

      {/* Shutter Flash Pulse */}
      {flashAlpha > 0 && (
        <div
          aria-hidden="true"
          style={{ opacity: flashAlpha }}
          className="pointer-events-none absolute inset-0 z-20 bg-white"
        />
      )}
    </div>
  );
}
