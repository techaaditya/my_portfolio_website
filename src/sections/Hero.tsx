import { m } from 'motion/react';
import { ArrowDown, FileText } from 'lucide-react';
import { site } from '@/data/site';
import { useSound } from '@/audio/SoundProvider';
import { ease } from '@/lib/motion';

/**
 * Section 2 — the point-cloud hero. The cloud itself lives in the fixed GL
 * layer behind/over this section; here is the oversized split display type.
 * Type is real DOM (selectable, SEO-visible) and animates transform-only so
 * the LCP element is painted from its first frame.
 */
export function Hero({ revealed }: { revealed: boolean }) {
  const { click, tick } = useSound();

  const rise = (delay: number) => ({
    initial: { y: 26 },
    animate: revealed ? { y: 0 } : { y: 26 },
    transition: { duration: 0.85, ease, delay },
  });

  return (
    <section
      id="home"
      className="relative mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-5 pt-20 pb-16 md:px-10"
    >
      <m.p className="readout flex items-center gap-2.5 text-cyan" {...rise(0.05)}>
        <span className="inline-block h-1.5 w-1.5 animate-blink rounded-full bg-cyan" />
        SYS ONLINE · KATHMANDU UNIVERSITY · 27.6194°N 85.5388°E
      </m.p>

      <h1
        className="display mt-6 text-ice"
        style={{ fontSize: 'var(--text-hero)' }}
      >
        <m.span className="block" {...rise(0.12)}>
          AADITYA
        </m.span>
        <m.span className="block" {...rise(0.24)}>
          SAPKOTA<span className="text-cyan glow">_</span>
        </m.span>
      </h1>

      <m.p
        className="mt-7 max-w-2xl font-mono text-sm leading-relaxed tracking-wide text-dim md:text-base"
        {...rise(0.38)}
      >
        <span className="text-cyan" aria-hidden="true">
          ▸{' '}
        </span>
        {site.roleLine}. Shipping real products from {site.location} on the way there.
      </m.p>

      <m.div className="mt-10 flex flex-wrap items-center gap-4" {...rise(0.5)}>
        <a
          href={site.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="instrument-btn"
          onClick={() => click()}
          onMouseEnter={() => tick()}
        >
          <FileText size={14} className="text-cyan" />
          RÉSUMÉ
        </a>
        <a
          href="#telemetry"
          className="instrument-btn"
          onClick={() => click()}
          onMouseEnter={() => tick()}
        >
          INITIALIZE SCAN
          <ArrowDown size={14} className="text-cyan" />
        </a>
      </m.div>

      {/* scroll cue */}
      <div
        className="readout absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.55rem]"
        aria-hidden="true"
      >
        SCROLL
        <span className="block h-10 w-px bg-[color:var(--line-strong)]" />
      </div>

      {/* interaction hint for the cloud */}
      <p
        className="readout absolute right-5 top-1/2 hidden -translate-y-1/2 rotate-90 text-[0.55rem] opacity-60 lg:block"
        aria-hidden="true"
      >
        CURSOR = FORCE FIELD · PRESS TO ATTRACT
      </p>
    </section>
  );
}
