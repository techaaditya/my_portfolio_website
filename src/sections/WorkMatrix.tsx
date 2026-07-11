import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import gsap from 'gsap';
import { m } from 'motion/react';
import { projects } from '@/data/projects';
import type { Project } from '@/data/projects';
import { SectionMark } from './Telemetry';
import { useSound } from '@/audio/SoundProvider';
import { isLowPower, prefersReducedMotion } from '@/hooks/useLowPowerTier';
import { reveal, revealGroup, inViewOnce } from '@/lib/motion';
import { cn } from '@/lib/cn';

const LiquidPreview = lazy(() => import('@/gl/LiquidPreview'));

/**
 * Section 4 — the Work Matrix: a full-width 1px-ruled shipment table.
 * Hover floats the project's capture beside the cursor through the liquid
 * shader (desktop only); click expands the row inline (GSAP height) with the
 * full technical description and links. All rows are real, verified work.
 */
export function WorkMatrix() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const showPreview = !isLowPower() && !prefersReducedMotion();

  // cursor-following preview frame (rAF lerp, no React re-renders)
  useEffect(() => {
    if (!showPreview) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    };
    const loop = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.12;
      p.y += (p.ty - p.y) * 0.12;
      const el = previewRef.current;
      if (el) el.style.transform = `translate3d(${p.x + 28}px, ${p.y - 110}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [showPreview]);

  return (
    <section id="work" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24 md:px-10 md:py-32">
      <SectionMark index="02" label="WORK" title="SHIPMENT MATRIX" />

      {/* column headers */}
      <div className="readout grid grid-cols-[3rem_1fr_auto] gap-4 border-b border-[color:var(--line-strong)] pb-3 text-[0.6rem] md:grid-cols-[3.5rem_5rem_11rem_1fr_auto]">
        <span>IDX</span>
        <span className="hidden md:block">YEAR</span>
        <span className="hidden md:block">CLASS</span>
        <span>DESIGNATION</span>
        <span className="text-right">LINK</span>
      </div>

      <m.ul variants={revealGroup} initial="hidden" whileInView="show" viewport={inViewOnce}>
        {projects.map((p, i) => (
          <Row
            key={p.slug}
            project={p}
            index={i + 1}
            expanded={expanded === p.slug}
            onToggle={() => setExpanded((v) => (v === p.slug ? null : p.slug))}
            onHover={(on) => setHovered(on ? p.slug : null)}
          />
        ))}
      </m.ul>

      {/* floating liquid preview */}
      {showPreview && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className={cn(
            'pointer-events-none fixed left-0 top-0 z-40 h-[200px] w-[320px] border border-[color:var(--line-strong)] bg-obsidian transition-opacity duration-300',
            hovered && !expanded ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Suspense fallback={null}>
            <LiquidPreview url={hovered ? `/previews/${hovered}.png` : null} visible={!!hovered} />
          </Suspense>
          <span className="readout absolute -bottom-5 left-0 text-[0.55rem] text-cyan">
            ▸ CAPTURE {hovered?.toUpperCase()}
          </span>
        </div>
      )}
    </section>
  );
}

function Row({
  project: p,
  index,
  expanded,
  onToggle,
  onHover,
}: {
  project: Project;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onHover: (on: boolean) => void;
}) {
  const detailRef = useRef<HTMLDivElement>(null);
  const { tick, click } = useSound();

  // GSAP inline expand — height is animated between 0 and the measured
  // content height, then released to auto so the row reflows naturally
  useEffect(() => {
    const el = detailRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.height = expanded ? 'auto' : '0px';
      el.style.opacity = expanded ? '1' : '0';
      return;
    }
    if (expanded) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: el.scrollHeight,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.inOut',
          onComplete: () => {
            el.style.height = 'auto';
          },
        },
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.4, ease: 'power3.inOut' });
    }
  }, [expanded]);

  return (
    <m.li variants={reveal} className="border-b border-[color:var(--line)]">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => {
          click();
          onToggle();
        }}
        onMouseEnter={() => {
          tick();
          onHover(true);
        }}
        onMouseLeave={() => onHover(false)}
        className="group grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-5 text-left transition-[background-color,padding] duration-300 hover:bg-panel hover:pl-3 md:grid-cols-[3.5rem_5rem_11rem_1fr_auto] md:py-6"
      >
        <span className="font-mono text-xs text-cyan/70">[{String(index).padStart(2, '0')}]</span>
        <span className="readout hidden tabular-nums md:block">{p.year}</span>
        <span className="readout hidden md:block">{p.discipline.toUpperCase()}</span>
        <span className="display text-xl text-ice transition-colors group-hover:text-cyan md:text-2xl">
          {p.title.split('—')[0].trim()}
          {p.featured && (
            <span className="ml-3 align-middle font-mono text-[0.6rem] tracking-widest text-amber">
              ◆ FEATURED
            </span>
          )}
          {p.status === 'building' && (
            <span className="ml-3 align-middle font-mono text-[0.6rem] tracking-widest text-cyan">
              [IN PROGRESS]
            </span>
          )}
        </span>
        <span
          className="font-mono text-xs text-dim transition-transform duration-300 group-hover:translate-x-1 group-hover:text-cyan"
          aria-hidden="true"
        >
          {expanded ? '−' : '+'}
        </span>
      </button>

      {/* expanded detail */}
      <div ref={detailRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="grid gap-6 pb-7 pl-[3rem] pr-2 md:grid-cols-[2fr_1fr] md:pl-[3.5rem]">
          <div>
            <p className="max-w-2xl text-sm leading-relaxed text-dim">{p.description}</p>
            {p.credit && (
              <p className="readout mt-4 text-[0.62rem] normal-case">{p.credit}</p>
            )}
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <ul className="flex flex-wrap gap-2 md:justify-end">
              {p.stack.map((s) => (
                <li
                  key={s}
                  className="border border-[color:var(--line)] px-2.5 py-1 font-mono text-[0.62rem] tracking-wider text-dim"
                >
                  {s}
                </li>
              ))}
            </ul>
            <div className="flex gap-5">
              {p.liveUrl && !p.liveUnverified && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    click();
                  }}
                  className="link-sweep inline-flex items-center gap-1.5 pb-0.5 font-mono text-xs tracking-wider text-cyan"
                  aria-label={`${p.title} — live site`}
                >
                  LIVE <ArrowUpRight size={13} />
                </a>
              )}
              {p.repoUrl && (
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    click();
                  }}
                  className="link-sweep inline-flex items-center gap-1.5 pb-0.5 font-mono text-xs tracking-wider text-ice"
                  aria-label={`${p.title} — source on GitHub`}
                >
                  <Github size={13} /> SOURCE
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </m.li>
  );
}
