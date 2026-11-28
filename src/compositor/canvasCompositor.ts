import { buildCssFilterString, getWarmthOverlayColor } from '../config/filters';
import { getStickerById } from '../config/stickers';
import type {
  CapturedFrame,
  DateFormatId,
  ExportFormat,
  FilterCalibration,
  FilterId,
  FooterFontStyle,
  FrameStyle,
  LayoutDefinition,
  PlacedSticker,
} from '../types/booth';

export interface CropRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export function computeCoverCrop(
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number
): CropRect {
  if (srcW <= 0 || srcH <= 0 || dstW <= 0 || dstH <= 0) {
    throw new Error('Invalid source or destination dimensions for center-crop.');
  }
  const srcRatio = srcW / srcH;
  const dstRatio = dstW / dstH;

  if (srcRatio > dstRatio) {
    const sw = srcH * dstRatio;
    return { sx: (srcW - sw) / 2, sy: 0, sw, sh: srcH };
  }
  const sh = srcW / dstRatio;
  return { sx: 0, sy: (srcH - sh) / 2, sw: srcW, sh };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode captured frame image.'));
    img.src = src;
  });
}

function clipRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function supportsCanvasFilter(ctx: CanvasRenderingContext2D): boolean {
  return typeof ctx.filter === 'string';
}

// shortcut: pixel fallback covers brightness/contrast/grayscale/sepia when ctx.filter is absent
function applyPixelFallback(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  cal: FilterCalibration
): void {
  const imgData = ctx.getImageData(x, y, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i] * cal.brightness;
    let g = d[i + 1] * cal.brightness;
    let b = d[i + 2] * cal.brightness;

    r = (r - 128) * cal.contrast + 128;
    g = (g - 128) * cal.contrast + 128;
    b = (b - 128) * cal.contrast + 128;

    if (cal.grayscale > 0) {
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      r = r * (1 - cal.grayscale) + luma * cal.grayscale;
      g = g * (1 - cal.grayscale) + luma * cal.grayscale;
      b = b * (1 - cal.grayscale) + luma * cal.grayscale;
    }

    if (cal.sepia > 0) {
      const sr = 0.393 * r + 0.769 * g + 0.189 * b;
      const sg = 0.349 * r + 0.686 * g + 0.168 * b;
      const sb = 0.272 * r + 0.534 * g + 0.131 * b;
      r = r * (1 - cal.sepia) + sr * cal.sepia;
      g = g * (1 - cal.sepia) + sg * cal.sepia;
      b = b * (1 - cal.sepia) + sb * cal.sepia;
    }

    d[i] = Math.max(0, Math.min(255, r));
    d[i + 1] = Math.max(0, Math.min(255, g));
    d[i + 2] = Math.max(0, Math.min(255, b));
  }
  ctx.putImageData(imgData, x, y);
}

function drawFramePattern(
  ctx: CanvasRenderingContext2D,
  layout: LayoutDefinition,
  frame: FrameStyle
): void {
  const { canvasWidth: w, canvasHeight: h } = layout;
  if (frame.pattern === 'none') return;

  ctx.save();
  if (frame.pattern === 'scalloped-lace') {
    ctx.fillStyle = frame.accentColor;
    ctx.globalAlpha = 0.55;
    const r = Math.round(w * 0.028);
    const step = r * 1.85;
    for (let x = r; x < w; x += step) {
      ctx.beginPath();
      ctx.arc(x, 0, r, 0, Math.PI);
      ctx.arc(x, h, r, Math.PI, Math.PI * 2);
      ctx.fill();
    }
    for (let y = r; y < h; y += step) {
      ctx.beginPath();
      ctx.arc(0, y, r, -Math.PI / 2, Math.PI / 2);
      ctx.arc(w, y, r, Math.PI / 2, Math.PI * 1.5);
      ctx.fill();
    }
    ctx.strokeStyle = frame.textColor;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.strokeRect(r * 1.3, r * 1.3, w - r * 2.6, h - r * 2.6);
  } else if (frame.pattern === 'strawberry-gingham') {
    const band = Math.round(w * 0.055);
    ctx.fillStyle = frame.accentColor;
    ctx.globalAlpha = 0.14;
    for (let x = 0; x < w; x += band * 2) {
      ctx.fillRect(x, 0, band, h);
    }
    for (let y = 0; y < h; y += band * 2) {
      ctx.fillRect(0, y, w, band);
    }
    // Corner berry dots
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#E11D48';
    const inset = Math.round(w * 0.036);
    for (const [cx, cy] of [
      [inset, inset],
      [w - inset, inset],
      [inset, h - inset],
      [w - inset, h - inset],
    ]) {
      ctx.beginPath();
      ctx.arc(cx, cy, Math.round(w * 0.012), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (frame.pattern === 'film-sprocket') {
    ctx.fillStyle = frame.accentColor;
    ctx.globalAlpha = 0.85;
    const holeW = Math.round(w * 0.022);
    const holeH = Math.round(holeW * 1.55);
    const step = holeH * 2;
    const inset = Math.round(w * 0.016);
    for (let y = 36; y < h - 36; y += step) {
      ctx.fillRect(inset, y, holeW, holeH);
      ctx.fillRect(w - inset - holeW, y, holeW, holeH);
    }
    ctx.strokeStyle = '#FDE68A';
    ctx.globalAlpha = 0.28;
    ctx.lineWidth = 2;
    ctx.strokeRect(inset + holeW + 10, 20, w - (inset + holeW + 10) * 2, h - 40);
  } else if (frame.pattern === 'matcha-botanical') {
    ctx.fillStyle = frame.accentColor;
    ctx.globalAlpha = 0.32;
    const leafSize = Math.round(w * 0.045);
    const corners: [number, number, number][] = [
      [leafSize, leafSize, 0.4],
      [w - leafSize, leafSize, -0.4],
      [leafSize, h - leafSize, 2.6],
      [w - leafSize, h - leafSize, -2.6],
    ];
    for (const [cx, cy, rot] of corners) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, leafSize * 0.65, leafSize * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(leafSize * 0.4, leafSize * 0.35, leafSize * 0.5, leafSize * 0.22, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else if (frame.pattern === 'midnight-starry') {
    ctx.fillStyle = frame.accentColor;
    const count = 34;
    for (let i = 0; i < count; i++) {
      const px = ((i * 223 + 37) % (w - 50)) + 25;
      const py = ((i * 347 + 61) % (h - 50)) + 25;
      const r = (i % 3) * 2 + 3;
      ctx.globalAlpha = i % 2 === 0 ? 0.65 : 0.35;
      ctx.beginPath();
      ctx.moveTo(px, py - r * 2);
      ctx.lineTo(px + r * 0.55, py - r * 0.55);
      ctx.lineTo(px + r * 2, py);
      ctx.lineTo(px + r * 0.55, py + r * 0.55);
      ctx.lineTo(px, py + r * 2);
      ctx.lineTo(px - r * 0.55, py + r * 0.55);
      ctx.lineTo(px - r * 2, py);
      ctx.lineTo(px - r * 0.55, py - r * 0.55);
      ctx.closePath();
      ctx.fill();
    }
  } else if (frame.pattern === 'sketchbook-doodle') {
    const lineGap = Math.round(h * 0.032);
    ctx.strokeStyle = frame.accentColor;
    ctx.globalAlpha = 0.28;
    ctx.lineWidth = 2;
    for (let y = lineGap; y < h; y += lineGap) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.strokeStyle = '#F43F5E';
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(Math.round(w * 0.045), 0);
    ctx.lineTo(Math.round(w * 0.045), h);
    ctx.stroke();
  } else if (frame.pattern === 'pixel-8bit') {
    const px = Math.max(8, Math.round(w * 0.01));
    // Outer pixel arcade border
    ctx.fillStyle = frame.accentColor;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(px * 2, px * 2, w - px * 4, px);
    ctx.fillRect(px * 2, h - px * 3, w - px * 4, px);
    ctx.fillRect(px * 2, px * 2, px, h - px * 4);
    ctx.fillRect(w - px * 3, px * 2, px, h - px * 4);

    // Stepped pixel-art gold corners
    ctx.fillStyle = frame.textColor;
    ctx.globalAlpha = 0.95;
    const drawPixelCorner = (cx: number, cy: number, sx: number, sy: number) => {
      ctx.fillRect(cx, cy, px * 3 * sx, px * sy);
      ctx.fillRect(cx, cy, px * sx, px * 3 * sy);
      ctx.fillRect(cx + px * 2 * sx, cy + px * 2 * sy, px * sx, px * sy);
    };
    drawPixelCorner(px, px, 1, 1);
    drawPixelCorner(w - px, px, -1, 1);
    drawPixelCorner(px, h - px, 1, -1);
    drawPixelCorner(w - px, h - px, -1, -1);

    // Neon pixel confetti squares in margins
    const confettiColors = ['#EF4444', '#FDE047', '#22D3EE', '#A855F7'];
    for (let i = 0; i < 28; i++) {
      const cx = ((i * 211 + 47) % (w - px * 10)) + px * 5;
      const cy = ((i * 317 + 71) % (h - px * 10)) + px * 5;
      ctx.fillStyle = confettiColors[i % confettiColors.length];
      ctx.globalAlpha = 0.6;
      ctx.fillRect(cx, cy, px, px);
    }
  } else if (frame.pattern === 'pixel-cafe') {
    const sq = Math.max(12, Math.round(w * 0.018));
    // Warm cream & caramel/espresso checkered outer border
    for (let x = 0; x < w; x += sq) {
      const col = Math.floor(x / sq);
      ctx.fillStyle = col % 2 === 0 ? '#7C4A2D' : '#E7C9A9';
      ctx.globalAlpha = 0.72;
      ctx.fillRect(x, 0, sq, sq);
      ctx.fillRect(x, h - sq, sq, sq);
    }
    for (let y = sq; y < h - sq; y += sq) {
      const row = Math.floor(y / sq);
      ctx.fillStyle = row % 2 === 0 ? '#7C4A2D' : '#E7C9A9';
      ctx.globalAlpha = 0.72;
      ctx.fillRect(0, y, sq, sq);
      ctx.fillRect(w - sq, y, sq, sq);
    }

    // Tiny pixel coffee & heart accents in footer corners
    const ps = Math.max(4, Math.round(sq * 0.32));
    const drawMiniHeart = (ox: number, oy: number) => {
      const rows = ['.#.#.', '#####', '.###.', '..#..'];
      ctx.fillStyle = '#C26D27';
      ctx.globalAlpha = 0.85;
      for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < rows[r].length; c++) {
          if (rows[r][c] === '#') {
            ctx.fillRect(ox + c * ps, oy + r * ps, ps, ps);
          }
        }
      }
    };
    drawMiniHeart(sq * 2, h - layout.footerHeight * 0.55);
    drawMiniHeart(w - sq * 2 - ps * 5, h - layout.footerHeight * 0.55);
  } else if (frame.pattern === 'holo-gradient') {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#F5D0FE');
    grad.addColorStop(0.28, '#E0F2FE');
    grad.addColorStop(0.58, '#FCE7F3');
    grad.addColorStop(0.82, '#DCFCE7');
    grad.addColorStop(1, '#DDD6FE');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle iridescent diagonal sheen
    const sheen = ctx.createLinearGradient(0, h * 0.2, w, h * 0.8);
    sheen.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sheen.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
    sheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);

    // 4-point chrome sparkles
    const sparkleCount = 26;
    for (let i = 0; i < sparkleCount; i++) {
      const px = ((i * 239 + 41) % (w - 60)) + 30;
      const py = ((i * 359 + 53) % (h - 60)) + 30;
      const r = (i % 3) * 4 + 6;
      ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#E879F9';
      ctx.globalAlpha = i % 2 === 0 ? 0.85 : 0.45;
      ctx.beginPath();
      ctx.moveTo(px, py - r * 1.8);
      ctx.lineTo(px + r * 0.4, py - r * 0.4);
      ctx.lineTo(px + r * 1.8, py);
      ctx.lineTo(px + r * 0.4, py + r * 0.4);
      ctx.lineTo(px, py + r * 1.8);
      ctx.lineTo(px - r * 0.4, py + r * 0.4);
      ctx.lineTo(px - r * 1.8, py);
      ctx.lineTo(px - r * 0.4, py - r * 0.4);
      ctx.closePath();
      ctx.fill();
    }
  } else if (frame.pattern === 'polaroid-tape') {
    // Subtle warm paper border
    ctx.strokeStyle = '#E5DEC9';
    ctx.lineWidth = Math.max(4, Math.round(w * 0.008));
    ctx.strokeRect(0, 0, w, h);

    // Decorative corner masking-tape strips
    const tapeW = Math.round(w * 0.14);
    const tapeH = Math.round(w * 0.042);
    const drawTape = (cx: number, cy: number, angle: number, color: string) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.72;
      ctx.fillRect(-tapeW / 2, -tapeH / 2, tapeW, tapeH);
      ctx.strokeStyle = 'rgba(120, 96, 68, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(-tapeW / 2, -tapeH / 2, tapeW, tapeH);
      ctx.restore();
    };
    drawTape(w * 0.08, w * 0.05, -0.58, '#E6C99C');
    drawTape(w * 0.92, w * 0.05, 0.58, '#E6C99C');
    drawTape(w * 0.91, h - w * 0.05, -0.52, '#D8C3A5');
  }
  ctx.restore();
}

function drawStickers(
  ctx: CanvasRenderingContext2D,
  stickers: PlacedSticker[],
  canvasWidth: number,
  canvasHeight: number
): void {
  const baseSize = Math.min(canvasWidth, canvasHeight) * 0.14;

  for (const placed of stickers) {
    const def = getStickerById(placed.stickerId);
    if (!def) continue;

    ctx.save();
    ctx.translate(placed.x * canvasWidth, placed.y * canvasHeight);
    ctx.rotate((placed.rotation * Math.PI) / 180);
    const scaleFactor = (baseSize * placed.scale) / 100;
    ctx.scale(scaleFactor, scaleFactor);
    ctx.translate(-50, -50);

    for (const p of def.paths) {
      const path = new Path2D(p.d);
      ctx.globalAlpha = p.opacity ?? 1;
      if (p.fill && p.fill !== 'none') {
        ctx.fillStyle = p.fill;
        ctx.fill(path);
      }
      if (p.stroke) {
        ctx.strokeStyle = p.stroke;
        ctx.lineWidth = p.strokeWidth ?? 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke(path);
      }
    }
    ctx.restore();
  }
}

function applySignatureFilterOverlay(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  filterId: FilterId | undefined
): void {
  if (!filterId || filterId === 'normal') return;
  ctx.save();

  if (filterId === 'soft-peach') {
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = 'rgba(255, 195, 170, 0.35)';
    ctx.fillRect(x, y, w, h);
    const bloom = ctx.createRadialGradient(
      x + w * 0.5,
      y + h * 0.45,
      w * 0.1,
      x + w * 0.5,
      y + h * 0.5,
      w * 0.72
    );
    bloom.addColorStop(0, 'rgba(255, 240, 232, 0.16)');
    bloom.addColorStop(1, 'rgba(120, 60, 50, 0.14)');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = bloom;
    ctx.fillRect(x, y, w, h);
  } else if (filterId === 'disposable-90s' || filterId === 'crisp-mono') {
    const vig = ctx.createRadialGradient(
      x + w * 0.5,
      y + h * 0.5,
      w * 0.25,
      x + w * 0.5,
      y + h * 0.5,
      w * 0.75
    );
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(1, 'rgba(0, 0, 0, 0.32)');
    ctx.fillStyle = vig;
    ctx.fillRect(x, y, w, h);

    // Deterministic fine grain specks
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 180; i++) {
      const gx = x + ((i * 197 + 29) % Math.max(1, Math.floor(w)));
      const gy = y + ((i * 313 + 53) % Math.max(1, Math.floor(h)));
      ctx.fillRect(gx, gy, 2, 2);
    }
  } else if (filterId === 'matcha-film') {
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = 'rgba(145, 185, 125, 0.34)';
    ctx.fillRect(x, y, w, h);
  } else if (filterId === 'cyanotype') {
    ctx.globalCompositeOperation = 'color';
    ctx.fillStyle = 'rgba(30, 75, 165, 0.78)';
    ctx.fillRect(x, y, w, h);
  }

  ctx.restore();
}

export function formatStripDate(
  date: Date,
  format: DateFormatId = 'mm.dd.yyyy'
): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = String(date.getFullYear());

  switch (format) {
    case 'mm-dd-yyyy':
      return `${mm}-${dd}-${yyyy}`;
    case 'dd.mm.yyyy':
      return `${dd}.${mm}.${yyyy}`;
    case 'yyyy-mm-dd':
      return `${yyyy}-${mm}-${dd}`;
    case 'short-month':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    case 'mm.dd.yyyy':
    default:
      return `${mm}.${dd}.${yyyy}`;
  }
}

export function getFooterFontFamily(style: FooterFontStyle = 'modern'): string {
  switch (style) {
    case 'mono':
      return 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    case 'handwritten':
      return '"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive';
    case 'modern':
    default:
      return 'ui-sans-serif, system-ui, -apple-system, sans-serif';
  }
}

export interface RenderStripOptions {
  layout: LayoutDefinition;
  frames: CapturedFrame[];
  filterId?: FilterId;
  calibration: FilterCalibration;
  frameStyle: FrameStyle;
  footerText: string;
  footerFont?: FooterFontStyle;
  showDate: boolean;
  dateFormat?: DateFormatId;
  stickers: PlacedSticker[];
}

export async function renderStripToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderStripOptions
): Promise<void> {
  const {
    layout,
    frames,
    filterId,
    calibration,
    frameStyle,
    footerText,
    footerFont = 'modern',
    showDate,
    dateFormat = 'mm.dd.yyyy',
    stickers,
  } = options;
  canvas.width = layout.canvasWidth;
  canvas.height = layout.canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to acquire 2D canvas context.');
  }

  ctx.fillStyle = frameStyle.backgroundColor;
  ctx.fillRect(0, 0, layout.canvasWidth, layout.canvasHeight);

  drawFramePattern(ctx, layout, frameStyle);

  const hasCssFilter = supportsCanvasFilter(ctx);
  const filterString = buildCssFilterString(calibration);
  const warmthOverlay = getWarmthOverlayColor(calibration.warmth);

  const frameMap = new Map<number, CapturedFrame>();
  for (const f of frames) {
    frameMap.set(f.slotIndex, f);
  }

  const loadedImages = await Promise.all(
    layout.slots.map(async (slot) => {
      const frame = frameMap.get(slot.index);
      if (!frame) return null;
      return loadImage(frame.dataUrl);
    })
  );

  for (let i = 0; i < layout.slots.length; i++) {
    const slot = layout.slots[i];
    const img = loadedImages[i];
    const radius = frameStyle.slotRadius ?? slot.borderRadius;

    ctx.save();
    clipRoundedRect(ctx, slot.x, slot.y, slot.width, slot.height, radius);
    ctx.clip();

    if (img) {
      const crop = computeCoverCrop(img.naturalWidth, img.naturalHeight, slot.width, slot.height);
      if (hasCssFilter) {
        ctx.filter = filterString;
      }
      ctx.drawImage(
        img,
        crop.sx,
        crop.sy,
        crop.sw,
        crop.sh,
        slot.x,
        slot.y,
        slot.width,
        slot.height
      );
      ctx.filter = 'none';

      if (!hasCssFilter) {
        applyPixelFallback(ctx, slot.x, slot.y, slot.width, slot.height, calibration);
      }

      if (warmthOverlay) {
        ctx.fillStyle = warmthOverlay;
        ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
      }

      applySignatureFilterOverlay(ctx, slot.x, slot.y, slot.width, slot.height, filterId);
    } else {
      ctx.fillStyle = frameStyle.accentColor;
      ctx.globalAlpha = 0.25;
      ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
    }

    ctx.restore();
  }

  // Footer watermark & optional date
  const footerTop = layout.canvasHeight - layout.footerHeight;
  const centerX = layout.canvasWidth / 2;
  const title = footerText.trim() || 'KaleidoSnap';
  const fontSize = Math.round(layout.canvasWidth * 0.036);
  const fontFamily = getFooterFontFamily(footerFont);

  ctx.save();
  ctx.fillStyle = frameStyle.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${fontSize}px ${fontFamily}`;

  if (showDate) {
    const dateStr = formatStripDate(new Date(), dateFormat);
    ctx.fillText(title, centerX, footerTop + layout.footerHeight * 0.36);
    ctx.globalAlpha = 0.72;
    ctx.font = `500 ${Math.round(fontSize * 0.56)}px ${fontFamily}`;
    ctx.fillText(dateStr, centerX, footerTop + layout.footerHeight * 0.68);
  } else {
    ctx.fillText(title, centerX, footerTop + layout.footerHeight * 0.5);
  }
  ctx.restore();

  drawStickers(ctx, stickers, layout.canvasWidth, layout.canvasHeight);
}

export async function exportStripToBlob(
  options: RenderStripOptions,
  format: ExportFormat,
  jpegQuality = 0.92
): Promise<Blob> {
  const offscreen = document.createElement('canvas');
  await renderStripToCanvas(offscreen, options);

  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const quality = format === 'jpeg' ? jpegQuality : undefined;

  return new Promise((resolve, reject) => {
    offscreen.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(`Failed to encode ${mimeType} image.`));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
