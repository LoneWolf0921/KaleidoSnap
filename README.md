# KaleidoSnap

A client-side browser Purikura photobooth built with **Vite + React + TypeScript**. Everything runs locally in your browser—zero backend, zero database, and zero cloud photo uploads.

## User Guide

1. **Allow Camera Access** — Open the app and grant camera permission to start the live viewfinder (portrait-friendly on mobile with slot framing guides).
2. **Choose a Format** — Pick `Single (1×1)`, `Strip (1×3)`, or `Grid (2×2)`. Switching formats with existing shots lets you choose which frames to preserve.
3. **Capture Shots** — Click **Capture** (or press `Space` / `Enter` on desktop) to run the timed countdown (`3s` default, configurable `1s–10s`). Press `Escape` to cancel a countdown or close modals.
4. **Review, Swap & Retake** — Inspect your strip on the Light Table. Retake any individual slot while preserving the rest, or use **Swap Shots** to reorder captured frames (`#01 ↔ #02`).
5. **Style & Decorate** — Pick a color filter, choose from 12 frame stocks, customize the footer caption, font style (`Modern`, `Mono`, `Script`), and date stamp, and add from 119 original vector stickers.
   - **Zoom & Pan**: Use `+` / `−`, mouse-wheel/trackpad scroll, or two-finger pinch to zoom up to `300%` and pan around while placing stickers.
   - **Sticker Controls**: Drag to move, drag corner handles to resize, drag the top stem to rotate, or use arrow keys / `+` / `-` / `[` / `]` / `Delete` on desktop.
6. **Download or Print** — Click **Download PNG** for a lossless full-resolution image, or open **Print PDF** to auto-layout your strip onto standard photo paper (`3R`, `4R`, `5R`, `2×6" Strip`, `A4`, or `US Letter`) with dashed cut guides and corner trim ticks.

## Features

- **3 Layouts**: `Single (1×1)`, `Strip (1×3)`, and `Grid (2×2)` with distortion-free center-crop (`cover`) slot framing.
- **6 Color Filters**: `Natural`, `Soft Peach Glow`, `90s Disposable`, `Crisp Mono`, `Matcha Film`, and `Midnight Cyanotype`.
- **12 Frame Presets**: `Classic White`, `Photo Black`, `Scalloped Lace`, `Gingham Check`, `90s Film`, `Botanical Leaf`, `Starry Night`, `Notebook Doodle`, `8-Bit Pixel`, `Pixel Cafe`, `Holo Gradient`, and `Polaroid Tape`.
- **119 Original Vector Stickers**: Built-in, copyright-free SVG stickers across 11 categories (`Props`, `Food`, `Y2K`, `Nature`, `Scrapbook`, `Expressions`, `Doodles`, `Sparkles`, `Critters`, `Arcade`, `Stamps`).
- **Print-Ready PDF Auto-Layout**: Client-side PDF generation via `jsPDF` with multi-up tiling, dashed cut borders, and corner trim ticks for `3.5×5" (3R)`, `4×6" (4R)`, `5×7" (5R)`, `2×6" Strip`, `A4 (Landscape)`, and `US Letter (Landscape)`.
- **8 App Themes (with Unique Icons & Web Audio SFX)**: `Light Paper`, `Dark Studio`, `Pink Neko`, `Midnight Arcade`, `Matcha Cream`, `Lavender Soda`, `8-Bit Retro`, and `Pixel Art Cafe`.
- **Studio Preferences**: Adjustable countdown (`1s–10s`), date stamp format (`MM.DD.YYYY`, `MM-DD-YYYY`, `DD.MM.YYYY`, `YYYY-MM-DD`, `Mon DD, YYYY`), mirror camera toggle, Web Audio booth sound FX toggle, animations toggle, and camera device selector.
- **30-Minute Local Session Recovery**: Automatically saves your latest session in `IndexedDB` with a 30-minute TTL—offering **Resume** or **Start New** on reload (with an in-memory fallback notice if `IndexedDB` is unavailable).

## Local Development

```bash
npm install
npm run dev
```

Type-check and build for production:

```bash
npm run build
```

## GitHub Pages Deployment

This repository includes `.github/workflows/deploy.yml`, which automatically type-checks, builds `dist/`, and deploys to GitHub Pages on every push to `main`.

1. Push your updates to `main`:
   ```bash
   git push origin main
   ```
2. In your GitHub repository, confirm **Settings → Pages → Source** is set to **GitHub Actions**.
3. Check the **Actions** tab to watch the `Deploy to GitHub Pages` workflow finish and view your live URL.
