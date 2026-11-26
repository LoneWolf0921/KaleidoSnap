# KaleidoSnap

## How to Use

1. **Allow Camera Access** — Open the app and grant webcam permission to start the live viewfinder.
2. **Choose a Layout & Filter** — Pick a layout (`Single (1×1)`, `Strip (1×3)`, or `Grid (2×2)`) and preview a color filter before or after shooting.
3. **Capture Shots** — Start the timed countdown (`3s` by default, configurable from `1s` to `10s`) for automatic capture across all slots.
4. **Review & Retake** — Inspect each captured frame immediately. Click/tap any frame to retake just that slot while keeping the rest of your shots.
5. **Decorate** — Choose a frame style, drag and drop stickers onto your strip, and drag the rotate handle or resize/reposition them as needed.
6. **Export** — Download your finished strip as a lossless **PNG** (rendered offscreen on HTML5 Canvas with center-crop framing).

## Key Features

- **3 Layouts**: `Single (1×1)`, `Strip (1×3)`, and `Grid (2×2)` with distortion-free center-crop (`cover`) slot framing.
- **6 Color Filters**: `Natural`, `Soft Peach Glow`, `90s Disposable`, `Crisp Mono`, `Matcha Film`, and `Midnight Cyanotype`.
- **8 Frame Presets**: `Classic White`, `Photo Black`, `Scalloped Lace`, `Gingham Check`, `90s Film`, `Botanical Leaf`, `Starry Night`, and `Notebook Doodle`.
- **Original Vector Stickers**: Built-in, copyright-free SVG stickers across 6 categories (`Expressions`, `Doodles`, `Sparkles`, `Critters`, `Arcade`, `Stamps`) with drag-and-drop placement and drag-to-rotate controls.
- **6 App Themes**: `Light Paper`, `Dark Studio`, `Pink Neko`, `Midnight Arcade`, `Matcha Cream`, and `Lavender Soda`.
- **Studio Preferences**: Adjustable countdown (`1s–10s`), mirror camera toggle, Web Audio booth sound FX toggle, animations toggle, and camera device selector.
- **30-Minute Local Session Recovery**: Automatically saves your latest session in `IndexedDB` with a 30-minute TTL—offering **Resume** or **Start New** on reload (with an in-memory fallback notice if `IndexedDB` is unavailable).

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

