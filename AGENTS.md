# AGENTS.md

## Stack & Hosting
- Build a client-side static web application using **Vite + React + TypeScript** (optional Tailwind CSS) deployable on **GitHub Pages**.
- Zero backend server, zero database, and zero cloud photo uploads.
- All layouts, frames, and stickers must be original or free of copyright restrictions.

## Locked v1 Specification
- Layouts: `single` (1 frame), `strip-3` (3-shot vertical strip), and `grid-4` (4-shot grid) using center-crop (`cover`) framing so slots have no distortion or bars.
- Capture & Retake: Timed countdown (`3s` default) with automatic capture, immediate preview, and single-frame retake (`retakeSlot(index)`) preserving other frames.
- Settings: Export defaults to `png` (lossless). Settings supports app theme (`light` | `dark` | `system`), countdown seconds, and mirror toggle.
- Session Recovery: Persist only the latest `"current"` session in `IndexedDB` with a **30-minute** (`1_800_000 ms`) TTL.
  - On startup: delete expired records immediately; if unexpired, offer **Resume** or **Start New**.
  - If `IndexedDB` is unavailable, blocked, or fails: continue in-memory for the active tab and show a clear notice that reload recovery is unavailable.

## Engineering Rules
- Strict TypeScript, zero `any`, zero `// TODO` placeholders, and explicit error handling.
- Stop active `MediaStreamTrack` instances (`track.stop()`) when switching cameras or unmounting.
- Always run `npx tsc --noEmit` and `npm run build` in the terminal and verify zero errors before finishing.

## UI Skills Precedence (Impeccable & Taste)
- `AGENTS.md` and `.agents/skills/canvas-compositor/SKILL.md` override `impeccable` and `taste` whenever aesthetic advice conflicts with locked v1 behavior.
- Preserve zero-backend GitHub Pages hosting, single-frame retake, lossless `png` export, 30-minute `IndexedDB` TTL (`Resume` / `Start New`) + in-memory fallback notice, and original/non-copyrighted assets.
