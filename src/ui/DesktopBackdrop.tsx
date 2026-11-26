import { useEffect, useRef } from 'react';
import { playThemeInteractionSound } from '../audio/boothAudio';
import type { ThemeMode } from '../types/booth';

interface DesktopBackdropProps {
  theme: ThemeMode;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  children: React.ReactNode;
}

interface Plane {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  trail: { x: number; y: number }[];
}

interface BokehOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: string;
  alpha: number;
}

interface NekoItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  kind: 'cat' | 'paw' | 'yarn';
  angle: number;
  spin: number;
  chirpScale: number;
  wobble: number;
}

interface SplashDrop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface Star3D {
  x: number;
  y: number;
  z: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface MatchaLeaf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  size: number;
  isCream: boolean;
}

interface SodaBubble {
  x: number;
  y: number;
  vy: number;
  wobblePhase: number;
  r: number;
}

interface FizzRing {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
  color: string;
}

export function DesktopBackdrop({
  theme,
  animationsEnabled,
  soundEnabled,
  children,
}: DesktopBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = {
      x: width * 0.5,
      y: height * 0.5,
      vx: 0,
      vy: 0,
      active: false,
    };

    function resize(): void {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Cached dot-grid pattern for 'light' theme (avoids 2,000+ fillRect calls/frame)
    let dotPattern: CanvasPattern | null = null;
    const patCanvas = document.createElement('canvas');
    patCanvas.width = 32;
    patCanvas.height = 32;
    const patCtx = patCanvas.getContext('2d');
    if (patCtx) {
      patCtx.fillStyle = 'rgba(197, 190, 176, 0.42)';
      patCtx.fillRect(16, 16, 1.5, 1.5);
      dotPattern = ctx.createPattern(patCanvas, 'repeat');
    }

    // Theme-specific state
    const planes: Plane[] = Array.from({ length: 10 }, (_, i) => ({
      x: (width / 10) * i + 40,
      y: ((i * 137) % Math.max(200, height - 80)) + 40,
      vx: 0.9 + (i % 3) * 0.35,
      vy: ((i % 2 === 0 ? 1 : -1) * 0.35),
      size: 13 + (i % 3) * 3,
      trail: [],
    }));

    const orbs: BokehOrb[] = Array.from({ length: 18 }, (_, i) => ({
      x: ((i * 193) % width),
      y: ((i * 271) % height),
      vx: ((i % 2 === 0 ? 1 : -1) * (0.15 + (i % 4) * 0.08)),
      vy: ((i % 3 === 0 ? 1 : -1) * (0.12 + (i % 3) * 0.07)),
      r: 36 + (i % 5) * 26,
      hue: i % 3 === 0 ? '232, 74, 48' : i % 3 === 1 ? '245, 158, 11' : '244, 241, 234',
      alpha: 0.05 + (i % 4) * 0.025,
    }));

    const nekoItems: NekoItem[] = Array.from({ length: 20 }, (_, i) => ({
      x: (i * 179) % width,
      y: (i * 251) % height,
      vx: (i % 2 === 0 ? 1 : -1) * (0.45 + (i % 3) * 0.18),
      vy: (i % 3 === 0 ? 1 : -1) * (0.35 + (i % 4) * 0.14),
      size: 14 + (i % 4) * 3.5,
      kind: i % 3 === 0 ? 'cat' : i % 3 === 1 ? 'paw' : 'yarn',
      angle: (i * 0.5) % (Math.PI * 2),
      spin: (i % 2 === 0 ? 1 : -1) * 0.008,
      chirpScale: 1,
      wobble: i * 0.9,
    }));
    let lastHoverSfxAt = 0;

    const splashes: SplashDrop[] = [];

    const stars: Star3D[] = Array.from({ length: 110 }, () => ({
      x: (Math.random() - 0.5) * width * 1.4,
      y: (Math.random() - 0.5) * height * 1.4,
      z: Math.random() * 900 + 80,
    }));
    const shootingStars: ShootingStar[] = [];

    const leaves: MatchaLeaf[] = Array.from({ length: 24 }, (_, i) => ({
      x: ((i * 163) % width),
      y: ((i * 229) % height),
      vx: 0.35 + (i % 3) * 0.15,
      vy: 0.25 + (i % 4) * 0.12,
      angle: (i * 0.7) % (Math.PI * 2),
      spin: ((i % 2 === 0 ? 1 : -1) * 0.015),
      size: 10 + (i % 4) * 4,
      isCream: i % 5 === 0,
    }));

    const bubbles: SodaBubble[] = Array.from({ length: 30 }, (_, i) => ({
      x: ((i * 149) % width),
      y: ((i * 211) % height),
      vy: 0.55 + (i % 5) * 0.28,
      wobblePhase: i * 0.8,
      r: 6 + (i % 5) * 4,
    }));

    const rings: FizzRing[] = [];

    function handlePointerMove(e: PointerEvent): void {
      pointer.vx = e.clientX - pointer.x;
      pointer.vy = e.clientY - pointer.y;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;

      if (!animationsEnabled) return;

      if (theme === 'midnight-arcade' && Math.random() < 0.08) {
        const angle = Math.atan2(pointer.y - height * 0.2, pointer.x - width * 0.2);
        shootingStars.push({
          x: pointer.x - Math.cos(angle) * 180,
          y: pointer.y - Math.sin(angle) * 180,
          vx: Math.cos(angle) * 11,
          vy: Math.sin(angle) * 11,
          life: 1,
        });
      }

      if (theme === 'pink-neko') {
        const now = performance.now();
        for (const item of nekoItems) {
          const dist = Math.hypot(item.x - pointer.x, item.y - pointer.y);
          if (dist < item.size + 32 && item.chirpScale < 1.15) {
            item.chirpScale = 1.32;
            const safeDist = Math.max(1, dist);
            item.vx += ((item.x - pointer.x) / safeDist) * 1.1;
            item.vy += ((item.y - pointer.y) / safeDist) * 1.1;
            if (now - lastHoverSfxAt > 280) {
              lastHoverSfxAt = now;
              playThemeInteractionSound('pink-neko', soundEnabledRef.current);
            }
          }
        }
      }

      if (theme === 'lavender-soda') {
        const now = performance.now();
        for (const b of bubbles) {
          if (Math.hypot(b.x - pointer.x, b.y - pointer.y) < b.r + 18) {
            rings.push({
              x: b.x,
              y: b.y,
              r: b.r * 0.6,
              maxR: b.r * 2.8,
              alpha: 0.75,
              color: '#8b5cf6',
            });
            b.y = height + b.r + Math.random() * 60;
            b.x = Math.random() * width;
            if (now - lastHoverSfxAt > 220) {
              lastHoverSfxAt = now;
              playThemeInteractionSound('lavender-soda', soundEnabledRef.current);
            }
          }
        }
      }
    }

    function handlePointerDown(e: PointerEvent): void {
      if (!animationsEnabled) return;
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest(
          'button, a, input, select, textarea, [role="button"], [role="tab"], [role="menuitemradio"], [role="dialog"], [role="menu"]'
        )
      );
      if (!isInteractive) {
        playThemeInteractionSound(theme, soundEnabledRef.current);
      }

      const cx = e.clientX;
      const cy = e.clientY;

      if (theme === 'light') {
        const angle = Math.atan2(pointer.vy || -0.4, pointer.vx || 1.2);
        planes.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * 2.4,
          vy: Math.sin(angle) * 2.4,
          size: 16,
          trail: [],
        });
        if (planes.length > 16) planes.shift();
      } else if (theme === 'dark') {
        rings.push({
          x: cx,
          y: cy,
          r: 8,
          maxR: 130,
          alpha: 0.7,
          color: '#e84a30',
        });
      } else if (theme === 'pink-neko') {
        for (const item of nekoItems) {
          const dist = Math.hypot(item.x - cx, item.y - cy);
          if (dist < item.size + 95) {
            item.chirpScale = 1.48;
            const safeDist = Math.max(1, dist);
            item.vx += ((item.x - cx) / safeDist) * 2.2;
            item.vy += ((item.y - cy) / safeDist) * 2.2 - 1.2;
            for (let k = 0; k < 5; k++) {
              const a = (Math.PI * 2 * k) / 5;
              splashes.push({
                x: item.x,
                y: item.y,
                vx: Math.cos(a) * (1.8 + Math.random() * 1.4),
                vy: Math.sin(a) * (1.8 + Math.random() * 1.4),
                life: 1,
                color: k % 2 === 0 ? '#ec4899' : '#f472b6',
                size: 3.2,
              });
            }
          }
        }
        rings.push({
          x: cx,
          y: cy,
          r: 6,
          maxR: 76,
          alpha: 0.7,
          color: '#ec4899',
        });
      } else if (theme === 'midnight-arcade') {
        shootingStars.push({
          x: cx - 140,
          y: cy - 90,
          vx: 10,
          vy: 6.5,
          life: 1,
        });
        for (let k = 0; k < 8; k++) {
          const a = (Math.PI * 2 * k) / 8;
          splashes.push({
            x: cx,
            y: cy,
            vx: Math.cos(a) * 3,
            vy: Math.sin(a) * 3,
            life: 1,
            color: k % 2 === 0 ? '#22d3ee' : '#f472b6',
            size: 3,
          });
        }
      } else if (theme === 'matcha-cream') {
        for (const l of leaves) {
          const dx = l.x - cx;
          const dy = l.y - cy;
          const dist = Math.hypot(dx, dy);
          if (dist < 180 && dist > 1) {
            l.vx += (-dy / dist) * 2.2;
            l.vy += (dx / dist) * 2.2;
          }
        }
      } else if (theme === 'lavender-soda') {
        rings.push({
          x: cx,
          y: cy,
          r: 8,
          maxR: 88,
          alpha: 0.8,
          color: '#8b5cf6',
        });
      }
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    let rafId = 0;
    let tick = 0;

    function drawFrame(): void {
      if (!ctx) return;
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      if (theme === 'light') {
        // Subtle warm dot grid (cached pattern)
        if (dotPattern) {
          ctx.fillStyle = dotPattern;
          ctx.fillRect(0, 0, width, height);
        }

        // Origami paper planes dodging cursor
        for (const p of planes) {
          if (animationsEnabled) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (pointer.active && dist < 150 && dist > 1) {
              const force = (150 - dist) / 150;
              p.vx += (dx / dist) * force * 0.35;
              p.vy += (dy / dist) * force * 0.35;
            }
            const speed = Math.hypot(p.vx, p.vy);
            if (speed > 2.6) {
              p.vx = (p.vx / speed) * 2.6;
              p.vy = (p.vy / speed) * 2.6;
            } else if (speed < 0.8) {
              p.vx *= 1.05;
              p.vy *= 1.05;
            }
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -30) p.x = width + 30;
            if (p.x > width + 30) p.x = -30;
            if (p.y < -30) p.y = height + 30;
            if (p.y > height + 30) p.y = -30;

            if (tick % 3 === 0) {
              p.trail.push({ x: p.x, y: p.y });
              if (p.trail.length > 10) p.trail.shift();
            }
          }

          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(217, 56, 30, 0.18)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            p.trail.forEach((pt, idx) => {
              if (idx === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();
            ctx.setLineDash([]);
          }

          const angle = Math.atan2(p.vy, p.vx);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(p.size, 0);
          ctx.lineTo(-p.size * 0.8, -p.size * 0.58);
          ctx.lineTo(-p.size * 0.45, 0);
          ctx.lineTo(-p.size * 0.8, p.size * 0.58);
          ctx.closePath();
          ctx.fillStyle = 'rgba(250, 248, 244, 0.92)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(217, 56, 30, 0.55)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(p.size, 0);
          ctx.lineTo(-p.size * 0.45, 0);
          ctx.stroke();
          ctx.restore();
        }
      } else if (theme === 'dark') {
        // Studio cursor spotlight + floating bokeh orbs
        if (pointer.active) {
          const spot = ctx.createRadialGradient(
            pointer.x,
            pointer.y,
            10,
            pointer.x,
            pointer.y,
            260
          );
          spot.addColorStop(0, 'rgba(232, 74, 48, 0.14)');
          spot.addColorStop(0.5, 'rgba(245, 158, 11, 0.05)');
          spot.addColorStop(1, 'rgba(19, 18, 16, 0)');
          ctx.fillStyle = spot;
          ctx.fillRect(0, 0, width, height);
        }

        for (const o of orbs) {
          if (animationsEnabled) {
            if (pointer.active) {
              o.x += (pointer.x - o.x) * 0.002 + o.vx;
              o.y += (pointer.y - o.y) * 0.002 + o.vy;
            } else {
              o.x += o.vx;
              o.y += o.vy;
            }
            if (o.x < -o.r) o.x = width + o.r;
            if (o.x > width + o.r) o.x = -o.r;
            if (o.y < -o.r) o.y = height + o.r;
            if (o.y > height + o.r) o.y = -o.r;
          }
          const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
          grad.addColorStop(0, `rgba(${o.hue}, ${o.alpha * 1.4})`);
          grad.addColorStop(0.7, `rgba(${o.hue}, ${o.alpha * 0.5})`);
          grad.addColorStop(1, `rgba(${o.hue}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (theme === 'pink-neko') {
        // Bouncing kawaii cat heads, paw prints, and yarn balls
        for (const item of nekoItems) {
          if (animationsEnabled) {
            if (pointer.active) {
              const dx = item.x - pointer.x;
              const dy = item.y - pointer.y;
              const dist = Math.hypot(dx, dy);
              if (dist < item.size + 65 && dist > 1) {
                item.vx += (dx / dist) * 0.18;
                item.vy += (dy / dist) * 0.18;
              }
            }
            item.x += item.vx;
            item.y += item.vy;
            item.vx *= 0.992;
            item.vy *= 0.992;
            if (Math.hypot(item.vx, item.vy) < 0.35) {
              item.vx += Math.cos(item.wobble + tick * 0.01) * 0.02;
              item.vy += Math.sin(item.wobble + tick * 0.01) * 0.02;
            }
            item.angle += item.spin;
            item.chirpScale += (1 - item.chirpScale) * 0.12;

            if (item.x < item.size) {
              item.x = item.size;
              item.vx = Math.abs(item.vx);
            } else if (item.x > width - item.size) {
              item.x = width - item.size;
              item.vx = -Math.abs(item.vx);
            }
            if (item.y < item.size) {
              item.y = item.size;
              item.vy = Math.abs(item.vy);
            } else if (item.y > height - item.size) {
              item.y = height - item.size;
              item.vy = -Math.abs(item.vy);
            }
          }

          ctx.save();
          ctx.translate(item.x, item.y);
          ctx.rotate(Math.sin(item.angle) * 0.22);
          ctx.scale(item.chirpScale, item.chirpScale);
          const s = item.size;

          if (item.kind === 'cat') {
            // Left & right cat ears
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.strokeStyle = 'rgba(236, 72, 153, 0.45)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(-s * 0.72, -s * 0.25);
            ctx.lineTo(-s * 0.82, -s * 0.98);
            ctx.lineTo(-s * 0.22, -s * 0.68);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(s * 0.72, -s * 0.25);
            ctx.lineTo(s * 0.82, -s * 0.98);
            ctx.lineTo(s * 0.22, -s * 0.68);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Inner ears
            ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
            ctx.beginPath();
            ctx.moveTo(-s * 0.64, -s * 0.38);
            ctx.lineTo(-s * 0.7, -s * 0.78);
            ctx.lineTo(-s * 0.34, -s * 0.58);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(s * 0.64, -s * 0.38);
            ctx.lineTo(s * 0.7, -s * 0.78);
            ctx.lineTo(s * 0.34, -s * 0.58);
            ctx.closePath();
            ctx.fill();

            // Cat head
            ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
            ctx.beginPath();
            ctx.ellipse(0, 0, s * 0.86, s * 0.72, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Eyes & :3 mouth
            ctx.fillStyle = 'rgba(59, 18, 40, 0.62)';
            ctx.beginPath();
            ctx.arc(-s * 0.3, -s * 0.06, s * 0.09, 0, Math.PI * 2);
            ctx.arc(s * 0.3, -s * 0.06, s * 0.09, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(59, 18, 40, 0.58)';
            ctx.lineWidth = 1.3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-s * 0.14, s * 0.12);
            ctx.quadraticCurveTo(-s * 0.07, s * 0.22, 0, s * 0.12);
            ctx.quadraticCurveTo(s * 0.07, s * 0.22, s * 0.14, s * 0.12);
            ctx.stroke();

            // Blush cheeks
            ctx.fillStyle = 'rgba(236, 72, 153, 0.26)';
            ctx.beginPath();
            ctx.ellipse(-s * 0.48, s * 0.14, s * 0.16, s * 0.09, 0, 0, Math.PI * 2);
            ctx.ellipse(s * 0.48, s * 0.14, s * 0.16, s * 0.09, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tiny whiskers
            ctx.strokeStyle = 'rgba(236, 72, 153, 0.38)';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(-s * 0.55, s * 0.02);
            ctx.lineTo(-s * 1.02, -s * 0.06);
            ctx.moveTo(-s * 0.55, s * 0.14);
            ctx.lineTo(-s * 1.02, s * 0.2);
            ctx.moveTo(s * 0.55, s * 0.02);
            ctx.lineTo(s * 1.02, -s * 0.06);
            ctx.moveTo(s * 0.55, s * 0.14);
            ctx.lineTo(s * 1.02, s * 0.2);
            ctx.stroke();
          } else if (item.kind === 'paw') {
            // Kawaii cat paw print
            ctx.fillStyle = 'rgba(236, 72, 153, 0.24)';
            ctx.beginPath();
            ctx.ellipse(0, s * 0.2, s * 0.52, s * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            const toes = [
              [-s * 0.52, -s * 0.25],
              [-s * 0.18, -s * 0.48],
              [s * 0.18, -s * 0.48],
              [s * 0.52, -s * 0.25],
            ];
            for (const [tx, ty] of toes) {
              ctx.beginPath();
              ctx.ellipse(tx, ty, s * 0.17, s * 0.22, 0, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            // Yarn ball
            ctx.fillStyle = 'rgba(244, 114, 182, 0.22)';
            ctx.strokeStyle = 'rgba(236, 72, 153, 0.42)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, s * 0.72, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-s * 0.18, 0, s * 0.5, -0.8, 1.4);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(s * 0.2, s * 0.1, s * 0.48, 1.6, 3.8);
            ctx.stroke();
          }

          ctx.restore();
        }
      } else if (theme === 'midnight-arcade') {
        // 3D Starfield + shooting stars
        const cx = width * 0.5 + (pointer.active ? (pointer.x - width * 0.5) * 0.15 : 0);
        const cy = height * 0.5 + (pointer.active ? (pointer.y - height * 0.5) * 0.15 : 0);

        for (const s of stars) {
          if (animationsEnabled) {
            s.z -= 2.4;
            if (s.z <= 1) {
              s.z = 950;
              s.x = (Math.random() - 0.5) * width * 1.4;
              s.y = (Math.random() - 0.5) * height * 1.4;
            }
          }
          const k = 320 / s.z;
          const px = cx + s.x * k;
          const py = cy + s.y * k;
          if (px < 0 || px > width || py < 0 || py > height) continue;
          const size = Math.max(1, (1 - s.z / 950) * 3.2);
          ctx.fillStyle = s.z % 2 < 1 ? 'rgba(34, 211, 238, 0.75)' : 'rgba(245, 243, 255, 0.75)';
          ctx.fillRect(px, py, size, size);
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const st = shootingStars[i];
          st.x += st.vx;
          st.y += st.vy;
          st.life -= 0.03;
          if (st.life <= 0) {
            shootingStars.splice(i, 1);
            continue;
          }
          const grad = ctx.createLinearGradient(st.x, st.y, st.x - st.vx * 5, st.y - st.vy * 5);
          grad.addColorStop(0, `rgba(34, 211, 238, ${st.life})`);
          grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(st.x, st.y);
          ctx.lineTo(st.x - st.vx * 5, st.y - st.vy * 5);
          ctx.stroke();
        }
      } else if (theme === 'matcha-cream') {
        // Swirling matcha leaves & cream wisps
        for (const l of leaves) {
          if (animationsEnabled) {
            if (pointer.active) {
              const dist = Math.hypot(l.x - pointer.x, l.y - pointer.y);
              if (dist < 140) {
                l.vx += pointer.vx * 0.018;
                l.vy += pointer.vy * 0.018;
              }
            }
            l.x += l.vx + Math.sin(tick * 0.02 + l.angle) * 0.35 + 0.25;
            l.y += l.vy;
            l.vx *= 0.98;
            l.vy = l.vy * 0.98 + 0.01;
            l.angle += l.spin;
            if (l.x > width + 30) l.x = -30;
            if (l.x < -30) l.x = width + 30;
            if (l.y > height + 30) {
              l.y = -30;
              l.x = Math.random() * width;
            }
          }
          ctx.save();
          ctx.translate(l.x, l.y);
          ctx.rotate(l.angle);
          ctx.fillStyle = l.isCream ? 'rgba(255, 255, 255, 0.72)' : 'rgba(101, 163, 13, 0.28)';
          ctx.beginPath();
          ctx.ellipse(0, 0, l.size, l.size * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else if (theme === 'lavender-soda') {
        // Rising fizzy carbonation bubbles
        for (const b of bubbles) {
          if (animationsEnabled) {
            b.y -= b.vy;
            b.wobblePhase += 0.04;
            b.x += Math.sin(b.wobblePhase) * 0.45;
            if (b.y < -b.r * 2) {
              b.y = height + b.r * 2;
              b.x = Math.random() * width;
            }
          }
          ctx.save();
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.36)';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.beginPath();
          ctx.arc(b.x - b.r * 0.32, b.y - b.r * 0.32, b.r * 0.22, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Shared splash droplets & fizz rings
      for (let i = splashes.length - 1; i >= 0; i--) {
        const sp = splashes[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= 0.035;
        if (sp.life <= 0) {
          splashes.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = sp.life;
        ctx.fillStyle = sp.color;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i];
        rg.r += (rg.maxR - rg.r) * 0.14;
        rg.alpha -= 0.028;
        if (rg.alpha <= 0) {
          rings.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = rg.color;
        ctx.globalAlpha = rg.alpha;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rg.x, rg.y, rg.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      pointer.vx *= 0.85;
      pointer.vy *= 0.85;

      if (animationsEnabled) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    }

    drawFrame();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [theme, animationsEnabled]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden lg:h-dvh lg:overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      />
      {children}
    </div>
  );
}
