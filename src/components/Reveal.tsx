import type { ReactNode } from 'react';
import { m } from 'motion/react';
import { reveal, inViewOnce } from '@/lib/motion';

/**
 * Once-only scroll reveal (opacity + small translate). Motion automatically
 * respects prefers-reduced-motion via its reducedMotion setting in App.
 */
export function Reveal({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
}) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
    >
      {children}
    </Comp>
  );
}
