import { useRef, type ReactNode } from 'react';

/**
 * 3D tilt + cursor spotlight for cards. On precise pointers the card rotates
 * toward the cursor (max ~7°) and a violet spotlight tracks it via the
 * --mx/--my custom properties consumed by the .spotlight overlay. Touch and
 * reduced-motion users get a plain (still fully readable) card.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 7,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    const rx = ((0.5 - py) * maxTilt).toFixed(2);
    const ry = ((px - 0.5) * maxTilt * 1.2).toFixed(2);
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`spotlight relative transition-transform duration-200 ease-out will-change-transform ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
