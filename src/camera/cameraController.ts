import { useCallback, useEffect, useRef, useState } from 'react';
import type { CapturedFrame } from '../types/booth';

export function stopMediaStream(stream: MediaStream | null): void {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    track.stop();
  }
}

function formatCameraError(err: unknown): string {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      return 'Camera permission was denied. Please allow camera access in your browser settings.';
    }
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      return 'No camera device was found.';
    }
    if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      return 'Camera is currently in use by another application.';
    }
    return `Camera error (${err.name}): ${err.message}`;
  }
  return err instanceof Error ? err.message : 'Unable to start camera.';
}

export interface CameraControllerState {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  devices: MediaDeviceInfo[];
  activeDeviceId: string | null;
  isReady: boolean;
  error: string | null;
  retry: () => void;
  captureFrame: (slotIndex: number, mirror: boolean) => CapturedFrame;
}

export function useCameraController(
  selectedDeviceId: string | null,
  enabled = true
): CameraControllerState {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(selectedDeviceId);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsReady(false);
      return;
    }

    async function startCamera(): Promise<void> {
      setIsReady(false);
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        setError('This browser does not support camera capture (getUserMedia).');
        return;
      }

      stopMediaStream(streamRef.current);
      streamRef.current = null;

      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            ...(selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : { facingMode: 'user' }),
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (cancelled) {
          stopMediaStream(stream);
          return;
        }

        streamRef.current = stream;
        const currentTrack = stream.getVideoTracks()[0];
        const trackDeviceId = currentTrack?.getSettings().deviceId ?? selectedDeviceId;
        setActiveDeviceId(trackDeviceId ?? null);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        if (!cancelled) {
          setDevices(allDevices.filter((d) => d.kind === 'videoinput'));
          setIsReady(true);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(formatCameraError(err));
          setIsReady(false);
        }
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [selectedDeviceId, enabled, attempt]);

  const captureFrame = useCallback((slotIndex: number, mirror: boolean): CapturedFrame => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      throw new Error('Camera stream is not ready for capture.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to create 2D context for frame capture.');
    }

    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return {
      slotIndex,
      dataUrl: canvas.toDataURL('image/jpeg', 0.95),
      width: canvas.width,
      height: canvas.height,
      capturedAt: Date.now(),
    };
  }, []);

  return {
    videoRef,
    devices,
    activeDeviceId,
    isReady,
    error,
    retry,
    captureFrame,
  };
}
