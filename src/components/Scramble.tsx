import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/hooks/useLowPowerTier';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

/**
 * Mechanical character-scramble: while `active`, characters flicker through
 * glyphs and lock in left-to-right over ~450ms. Layout is stable (same char
 * count) so there's zero CLS. No-ops under reduced motion.
 */
export function Scramble({ text, active }: { text: string; active: boolean }) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  useEffect(() => {
    if (!active || prefersReducedMotion()) {
      cancelAnimationFrame(raf.current);
      setDisplay(text);
      return;
    }
    frame.current = 0;
    const total = 24; // frames until fully locked
    const loop = () => {
      frame.current++;
      const lockUpTo = (frame.current / total) * text.length;
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ' || i < lockUpTo) out += ch;
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (frame.current < total) raf.current = requestAnimationFrame(loop);
      else setDisplay(text);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [active, text]);

  return <span aria-label={text}>{display}</span>;
}
