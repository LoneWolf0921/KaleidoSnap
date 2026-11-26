import type { ThemeMode } from '../types/booth';

// Zero-asset Web Audio API synthesizer for KaleidoSnap theme soundscapes & booth FX.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  if (!audioCtx) {
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  durationSec: number,
  type: OscillatorType,
  gainPeak: number,
  delaySec = 0,
  endFreq?: number
): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (endFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), start + durationSec);
    }

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(gainPeak, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + durationSec + 0.02);
  } catch {
    // Ignore audio context restrictions
  }
}

function playNoiseBurst(
  durationSec: number,
  filterFreq: number,
  filterType: BiquadFilterType,
  gainPeak: number,
  delaySec = 0,
  endFilterFreq?: number
): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const start = ctx.currentTime + delaySec;
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, start);
    if (endFilterFreq !== undefined) {
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(40, endFilterFreq),
        start + durationSec
      );
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(gainPeak, start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(start);
    source.stop(start + durationSec + 0.02);
  } catch {
    // Ignore audio context restrictions
  }
}

export function playThemeInteractionSound(theme: ThemeMode, enabled: boolean): void {
  if (!enabled) return;

  switch (theme) {
    case 'light':
      // Crisp paper swoosh / fold chime
      playNoiseBurst(0.09, 1400, 'bandpass', 0.075, 0, 3400);
      playTone(1174.66, 0.09, 'triangle', 0.06, 0.025, 1479.98);
      break;
    case 'dark':
      // Mechanical camera aperture click
      playNoiseBurst(0.024, 2200, 'highpass', 0.11, 0);
      playTone(150, 0.045, 'triangle', 0.12, 0, 58);
      playNoiseBurst(0.02, 2800, 'highpass', 0.07, 0.036);
      break;
    case 'pink-neko':
      // Cute synth "mew!" chirp
      playTone(680, 0.075, 'sine', 0.11, 0, 1140);
      playTone(1140, 0.11, 'triangle', 0.09, 0.065, 840);
      break;
    case 'midnight-arcade':
      // Retro 8-bit star laser / arpeggio
      playTone(523.25, 0.055, 'square', 0.055, 0);
      playTone(659.25, 0.055, 'square', 0.055, 0.045);
      playTone(783.99, 0.055, 'square', 0.055, 0.09);
      playTone(1046.5, 0.09, 'square', 0.06, 0.135);
      break;
    case 'matcha-cream':
      // Soft bamboo / pentatonic wind chime
      playTone(587.33, 0.22, 'sine', 0.08, 0);
      playTone(739.99, 0.24, 'sine', 0.065, 0.055);
      playTone(880, 0.28, 'sine', 0.05, 0.11);
      break;
    case 'lavender-soda':
      // Fizzy bubble pop
      playTone(340, 0.065, 'sine', 0.12, 0, 980);
      playTone(1480, 0.05, 'sine', 0.055, 0.045, 1760);
      break;
  }
}

export function playCountdownTick(
  secondsLeft: number,
  enabled: boolean,
  theme: ThemeMode = 'light'
): void {
  if (!enabled) return;
  const baseFreq = secondsLeft <= 1 ? 880 : secondsLeft === 2 ? 660 : 523.25;
  const oscType: OscillatorType =
    theme === 'midnight-arcade' ? 'square' : theme === 'matcha-cream' ? 'sine' : 'triangle';
  const peak = theme === 'midnight-arcade' ? 0.065 : 0.11;
  playTone(baseFreq, 0.11, oscType, peak);
}

export function playShutterClick(enabled: boolean, theme: ThemeMode = 'light'): void {
  if (!enabled) return;

  switch (theme) {
    case 'dark':
      playNoiseBurst(0.03, 2400, 'highpass', 0.13, 0);
      playTone(165, 0.055, 'triangle', 0.14, 0, 55);
      playNoiseBurst(0.024, 3000, 'highpass', 0.09, 0.045);
      break;
    case 'pink-neko':
      playNoiseBurst(0.02, 2200, 'highpass', 0.06, 0);
      playTone(784, 0.08, 'sine', 0.12, 0.015, 1318.5);
      playTone(1318.5, 0.12, 'triangle', 0.1, 0.075, 1046.5);
      break;
    case 'midnight-arcade':
      playTone(987.77, 0.06, 'square', 0.065, 0);
      playTone(1318.5, 0.11, 'square', 0.065, 0.05);
      break;
    case 'matcha-cream':
      playNoiseBurst(0.025, 1600, 'bandpass', 0.06, 0);
      playTone(587.33, 0.16, 'sine', 0.1, 0.02);
      playTone(880, 0.2, 'sine', 0.085, 0.07);
      break;
    case 'lavender-soda':
      playTone(440, 0.07, 'sine', 0.12, 0, 1174.66);
      playTone(1567.98, 0.1, 'sine', 0.08, 0.055);
      break;
    case 'light':
    default:
      playNoiseBurst(0.022, 1800, 'bandpass', 0.065, 0, 3200);
      playTone(1046.5, 0.09, 'sine', 0.13, 0.01, 1318.5);
      playTone(1567.98, 0.14, 'triangle', 0.1, 0.06);
      break;
  }
}

export function playStickerPop(enabled: boolean, theme: ThemeMode = 'light'): void {
  if (!enabled) return;
  if (theme === 'pink-neko') {
    playTone(720, 0.07, 'sine', 0.1, 0, 1180);
    return;
  }
  if (theme === 'midnight-arcade') {
    playTone(660, 0.06, 'square', 0.055, 0, 1100);
    return;
  }
  if (theme === 'matcha-cream') {
    playTone(739.99, 0.11, 'sine', 0.09, 0, 987.77);
    return;
  }
  playTone(587.33, 0.08, 'sine', 0.11, 0, 987.77);
}

export function playSessionComplete(enabled: boolean, theme: ThemeMode = 'light'): void {
  if (!enabled) return;
  const notes =
    theme === 'matcha-cream'
      ? [587.33, 739.99, 880, 1174.66]
      : [523.25, 659.25, 783.99, 1046.5];
  const oscType: OscillatorType =
    theme === 'midnight-arcade' ? 'square' : theme === 'matcha-cream' ? 'sine' : 'triangle';
  const peak = theme === 'midnight-arcade' ? 0.06 : 0.1;
  notes.forEach((freq, i) => {
    playTone(freq, 0.16, oscType, peak, i * 0.075);
  });
}
