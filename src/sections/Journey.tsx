import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { timeline } from '@/data/timeline';
import type { Milestone } from '@/data/timeline';
import { SectionMark } from './Telemetry';
import { isLowPower, prefersReducedMotion } from '@/hooks/useLowPowerTier';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 6 — the horizontal journey. Vertical scroll pins the section and
 * slides the milestone track sideways (GSAP ScrollTrigger scrub); the big
 * year figures parallax against the panels. Mobile/low-power/reduced-motion
 * degrade to a clean vertical list — same real milestones.
 */
export function Journey() {
  const horizontal = !isLowPower() && !prefersReducedMotion();

  return (
    <section id="journey" className="scroll-mt-16 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionMark index="04" label="JOURNEY" title="FLIGHT LOG" />
      </div>
      {horizontal ? <HorizontalTrack /> : <VerticalList />}
    </section>
  );
}

function HorizontalTrack() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      // parallax the oversized year figures against the slide
      gsap.utils.toArray<HTMLElement>('.journey-year').forEach((el) => {
        gsap.to(el, {
          x: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 1.2,
          },
        });
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="overflow-hidden">
      <div ref={trackRef} className="flex h-svh w-max items-center">
        {timeline.map((mstone, i) => (
          <Panel key={i} milestone={mstone} index={i} />
        ))}
        {/* terminal card */}
        <div className="flex h-[70svh] w-[60vw] min-w-[420px] flex-col items-start justify-center border-l border-[color:var(--line-strong)] px-14">
          <p className="readout text-cyan">[EOF]</p>
          <p className="display mt-4 max-w-md text-3xl text-ice">
            The log continues — <span className="text-cyan">next entry unwritten.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Panel({ milestone: mstone, index }: { milestone: Milestone; index: number }) {
  return (
    <article className="relative flex h-[70svh] w-[78vw] min-w-[540px] flex-col justify-center border-l border-[color:var(--line-strong)] px-14 md:w-[62vw]">
      <span
        className="journey-year display pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-[11rem] leading-none text-ghost select-none md:text-[15rem]"
        aria-hidden="true"
      >
        {mstone.year}
      </span>
      <div className="relative max-w-lg">
        <p className="readout flex items-center gap-3 text-cyan">
          <span aria-hidden="true">LOG {String(index + 1).padStart(2, '0')}</span>
          <span className="h-px w-10 bg-cyan/40" aria-hidden="true" />
          {mstone.tag}
          {mstone.status === 'building' && <span className="text-amber">· IN PROGRESS</span>}
        </p>
        <h3 className="display mt-5 text-3xl text-ice md:text-5xl">{mstone.title}</h3>
        <p className="mt-5 leading-relaxed text-dim">{mstone.detail}</p>
      </div>
    </article>
  );
}

function VerticalList() {
  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10">
      <ol className="space-y-0 border-t border-[color:var(--line-strong)]">
        {timeline.map((mstone, i) => (
          <li key={i} className="grid gap-3 border-b border-[color:var(--line)] py-7 md:grid-cols-[7rem_1fr]">
            <span className="display text-3xl text-cyan/60">{mstone.year}</span>
            <div>
              <p className="readout text-[0.6rem] text-cyan">
                LOG {String(i + 1).padStart(2, '0')} · {mstone.tag}
                {mstone.status === 'building' && <span className="text-amber"> · IN PROGRESS</span>}
              </p>
              <h3 className="display mt-2 text-2xl text-ice">{mstone.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dim">{mstone.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
