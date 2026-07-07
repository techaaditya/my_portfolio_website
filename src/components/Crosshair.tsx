import { cn } from '@/lib/cn';

/**
 * The plotted-point motif: a small coordinate crosshair. Recurs beside project
 * rows, section headers, and corners — the site's ownable mark. Decorative.
 */
export function Crosshair({ className, size = 12 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d="M6 0.5V11.5M0.5 6H11.5" stroke="currentColor" strokeWidth="1" opacity="0.9" />
      <circle cx="6" cy="6" r="1.6" fill="currentColor" />
    </svg>
  );
}
