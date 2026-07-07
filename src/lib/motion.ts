import type { Variants, Transition } from 'motion/react';

/** Shared easing — a calm, instrument-like settle. */
export const ease: Transition['ease'] = [0.16, 1, 0.3, 1];

/** Standard once-only scroll reveal: opacity + small translate, no bounce. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

/** Stagger container for lists of revealed children. */
export const revealGroup: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

/** Viewport config so reveals fire once, slightly before fully in view. */
export const inViewOnce = { once: true, margin: '0px 0px -12% 0px' } as const;
