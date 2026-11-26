interface BrandLogoProps {
  size?: 'sm' | 'lg';
  animated?: boolean;
  winking?: boolean;
}

export function MascotMark({
  size = 'sm',
  animated = false,
  winking = false,
}: BrandLogoProps) {
  const px = size === 'lg' ? 84 : 34;
  return (
    <svg
      aria-hidden="true"
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      className="shrink-0"
    >
      {/* Two-tone pixel-kawaii camera badge using active theme tokens (zero rainbow) */}
      <rect
        x="4"
        y="6"
        width="56"
        height="52"
        rx="14"
        fill="var(--ks-ink)"
      />
      <rect
        x="8"
        y="18"
        width="48"
        height="34"
        rx="9"
        fill="var(--ks-surface)"
        stroke="var(--ks-ink)"
        strokeWidth="2.5"
      />
      <path
        d="M22 18 L26 11 H38 L42 18 Z"
        fill="var(--ks-accent)"
        stroke="var(--ks-ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle
        cx="32"
        cy="35"
        r="11"
        fill="var(--ks-accent)"
        stroke="var(--ks-ink)"
        strokeWidth="2.5"
      />
      <g className={animated ? 'ks-neko-eyes' : undefined}>
        {winking ? (
          <path
            d="M27 35 Q32 30 37 35"
            stroke="#ffffff"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <>
            <circle cx="32" cy="35" r="5" fill="var(--ks-ink)" />
            <circle cx="29.5" cy="32.5" r="2" fill="#ffffff" />
          </>
        )}
      </g>
      <rect x="45" y="23" width="6" height="4" rx="1.5" fill="var(--ks-ink)" />
    </svg>
  );
}
