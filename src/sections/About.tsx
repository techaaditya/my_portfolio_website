import { useEffect, useRef } from 'react';
import { useScroll } from 'motion/react';
import { about } from '@/data/about';
import { skillGroups } from '@/data/skills';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:px-8 md:py-36">
      <SectionHeader index="02" label="About" title="A researcher-in-training" accent="who ships" />

      <div className="space-y-8">
        {about.map((para, i) => (
          <FadeWords key={i} text={para} emphasis={i === 0} />
        ))}
      </div>

      <SkillsTicker />

      <Reveal className="mt-14">
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div key={group.label} className="border-t border-[color:var(--line)] pt-4">
              <dt className="readout text-signal">{group.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-foam">{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

/**
 * Scroll-driven paragraph: each word brightens as it crosses the reading
 * zone — the text feels like it's being lit while you read it. The words are
 * plain spans (cheap to mount); one scroll subscription writes their opacity
 * directly, so neither mounting nor scrolling does any React work per word.
 * Resting opacity stays ≥4.5:1 contrast — a highlight, never a hide.
 */
const REST = 0.55;

function FadeWords({ text, emphasis }: { text: string; emphasis?: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.5'],
  });
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = el.children as HTMLCollectionOf<HTMLElement>;
    const n = spans.length;
    const apply = (v: number) => {
      for (let i = 0; i < n; i++) {
        const p = Math.min(1, Math.max(0, v * n - i));
        spans[i].style.opacity = String(REST + (1 - REST) * p);
      }
    };
    apply(scrollYProgress.get());
    return scrollYProgress.on('change', apply);
  }, [scrollYProgress]);

  return (
    <p
      ref={ref}
      className={`max-w-3xl font-display leading-snug tracking-tight text-foam ${
        emphasis ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
      }`}
    >
      {words.map((word, i) => (
        <span key={i} style={{ opacity: REST }}>
          {word}{' '}
        </span>
      ))}
    </p>
  );
}

/** Two opposing infinite marquee rows of everything in the (honest) toolkit. */
function SkillsTicker() {
  const all = skillGroups.flatMap((g) => g.items);
  const rowA = all;
  const rowB = [...all].reverse();

  return (
    <div className="mt-16 space-y-4" aria-label="Skills ticker">
      <MarqueeRow items={rowA} />
      <MarqueeRow items={rowB} reverse />
    </div>
  );
}

function MarqueeRow({ items, reverse }: { items: readonly string[]; reverse?: boolean }) {
  // content duplicated once; the keyframes travel exactly -50% for a seamless loop
  const doubled = [...items, ...items];
  return (
    <div className="marquee border-y border-[color:var(--line)] py-4">
      <div className={reverse ? 'marquee-track-reverse' : 'marquee-track'}>
        {doubled.map((item, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length || undefined}
            className="flex shrink-0 items-center gap-6 px-6 font-display text-2xl tracking-tight text-mist transition-colors hover:text-foam md:text-3xl"
          >
            {item}
            <span className="text-aurora text-lg" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
