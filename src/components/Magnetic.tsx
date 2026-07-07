import { useRef, type ReactNode } from 'react';

/**
 * Magnetic hover: the child is gently pulled toward the cursor while it's
 * over the wrapper, and springs back on leave. CSS-transition based (no
 * per-frame JS), disabled automatically for touch pointers, and the global
 * reduced-motion rule zeroes the transition so it degrades to a plain button.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const innerRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = innerRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  };

  const onLeave = () => {
    const el = innerRef.current;
    if (el) el.style.transform = 'translate3d(0, 0, 0)';
  };

  return (
    <div className={className} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        ref={innerRef}
        className="transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
      >
        {children}
      </div>
    </div>
  );
}
