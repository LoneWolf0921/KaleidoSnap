import type { StorageMode } from '../types/booth';

interface RecoveryBannerProps {
  storageMode: StorageMode;
  storageNotice: string | null;
  onDismissNotice: () => void;
}

export function RecoveryBanner({
  storageMode,
  storageNotice,
  onDismissNotice,
}: RecoveryBannerProps) {
  if (storageMode !== 'memory-fallback' || !storageNotice) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm text-[var(--ks-ink)]"
    >
      <div className="flex items-center gap-2.5">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
        <span className="text-xs sm:text-sm">{storageNotice}</span>
      </div>
      <button
        type="button"
        onClick={onDismissNotice}
        className="inline-flex min-h-[44px] shrink-0 items-center rounded-md px-3 text-xs font-semibold text-amber-800 transition hover:bg-amber-500/15 dark:text-amber-300"
      >
        Dismiss
      </button>
    </div>
  );
}
