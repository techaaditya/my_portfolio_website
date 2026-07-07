import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, FileText } from 'lucide-react';
import { site } from '@/data/site';
import { SocialLinks } from '@/components/SocialLinks';
import { Magnetic } from '@/components/Magnetic';
import { ease } from '@/lib/motion';

const KATHMANDU = '27.6194°N · 85.5388°E';

// all true — derived from the confirmed role line and real shipped work
const WORDS = ['data science', 'machine learning', 'web platforms', 'research'] as const;

/**
 * One line of the name. Letters (or the whole gradient line) rise into
 * place with transform-only animation — opacity stays 1 and nothing is
 * clipped, so the browser paints the h1 at first frame and LCP fires
 * immediately instead of waiting for a reveal. (Gradient lines animate as
 * one piece because background-clip:text can't paint through transformed
 * child spans.)
 */
function KineticLine({
  text,
  delay,
  className,
  gradient,
}: {
  text: string;
  delay: number;
  className?: string;
  gradient?: boolean;
}) {
  if (gradient) {
    return (
      <span className={`block ${className ?? ''}`}>
        <m.span
          className="text-aurora inline-block will-change-transform"
          variants={{
            hidden: { y: '0.28em' },
            show: { y: 0, transition: { duration: 0.9, ease, delay } },
          }}
        >
          {text}
        </m.span>
      </span>
    );
  }
  return (
    <span className={`block ${className ?? ''}`}>
      {text.split('').map((ch, i) => (
        <m.span
          key={i}
          className="inline-block will-change-transform"
          variants={{
            hidden: { y: '0.32em' },
            show: {
              y: 0,
              transition: { duration: 0.75, ease, delay: delay + i * 0.028 },
            },
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </m.span>
      ))}
    </span>
  );
}

/** Cycles through what Aaditya actually works in, one word at a time. */
function WordCycle() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % WORDS.length), 2400);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={WORDS[i]}
          className="text-aurora font-medium whitespace-nowrap [grid-area:1/1]"
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          exit={{ y: '-105%' }}
          transition={{ duration: 0.55, ease }}
        >
          {WORDS[i]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  // the hero recedes and dims as you scroll into the page — a scene change
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 pt-24 pb-20 md:px-8"
    >
      <m.div
        style={{ y, opacity }}
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.09 } } }}
      >
        <m.p
          className="readout flex items-center gap-2.5"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.5, ease, delay: 0.15 } },
          }}
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan" />
          <span>{site.location}</span>
          <span className="text-signal/60" aria-hidden="true">
            ·
          </span>
          <span>{KATHMANDU}</span>
        </m.p>

        <h1
          className="mt-6 font-display leading-[0.92] tracking-tight text-foam"
          style={{ fontSize: 'var(--text-hero)' }}
        >
          <KineticLine text="Aaditya" delay={0.05} />
          <KineticLine text="Sapkota" delay={0.25} gradient className="italic" />
        </h1>

        {/* transform-only: this is the LCP element — an opacity fade would
            delay LCP by the full entrance (see docs/DECISIONS.md) */}
        <m.p
          className="mt-8 max-w-2xl text-xl leading-relaxed text-mist md:text-2xl"
          variants={{
            hidden: { y: 18 },
            show: { y: 0, transition: { duration: 0.7, ease, delay: 0.35 } },
          }}
        >
          Kathmandu University student working in <WordCycle /> — building toward research, and
          shipping real products on the way there.
        </m.p>

        <m.div
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: 0.95 } },
          }}
        >
          <Magnetic>
            <a
              href={site.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="aurora-border group inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium text-foam transition-shadow duration-300 hover:shadow-[0_0_36px_-6px_var(--color-signal)]"
            >
              <FileText size={16} className="text-signal" />
              Résumé
              <ArrowUpRight
                size={15}
                className="text-cyan transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-6 py-3 text-sm font-medium text-mist transition-colors duration-300 hover:border-signal/60 hover:text-foam"
            >
              Explore work
              <ArrowDown size={15} className="transition-transform group-hover:translate-y-0.5" />
            </a>
          </Magnetic>

          <SocialLinks />
        </m.div>
      </m.div>

      {/* scroll cue */}
      <m.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        aria-hidden="true"
      >
        <span className="readout text-[0.6rem]">scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-[color:var(--line-strong)]">
          <span className="absolute inset-x-0 h-full animate-scroll-cue bg-gradient-to-b from-transparent via-cyan to-transparent" />
        </span>
      </m.div>
    </section>
  );
}
