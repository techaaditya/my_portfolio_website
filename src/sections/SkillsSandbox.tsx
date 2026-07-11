import { useEffect, useRef, useState } from 'react';
import { skillNodes } from '@/data/skillGraph';
import { SectionMark } from './Telemetry';
import { useSound } from '@/audio/SoundProvider';
import { isLowPower, prefersReducedMotion } from '@/hooks/useLowPowerTier';
import { Reveal } from '@/components/Reveal';
import { cn } from '@/lib/cn';

/**
 * Section 5 — the skills sandbox. Every skill is a draggable node under
 * hand-rolled verlet physics (mutual repulsion, gentle centering, wall
 * bounce) — throw them around. Nodes are real <button>s (keyboard/screen-
 * reader accessible); selecting one lights the side panel with the actual
 * projects that used that tool, derived from the shipped project stacks.
 * Reduced-motion gets the same nodes as a static, tidy grid.
 */

interface Body {
  x: number;
  y: number;
  px: number;
  py: number;
  r: number;
  held: boolean;
}

export function SkillsSandbox() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const [selected, setSelected] = useState(0);
  const { tick, click } = useSound();
  // touch devices get the tidy static grid: drag physics is a fine-pointer
  // interaction, and small arenas can't hold 14 non-overlapping tap targets
  const staticMode = prefersReducedMotion() || isLowPower();

  useEffect(() => {
    if (staticMode) return;
    const arena = arenaRef.current;
    if (!arena) return;

    let W = arena.clientWidth;
    let H = arena.clientHeight;

    // measure real node sizes, then scatter
    bodies.current = skillNodes.map((_, i) => {
      const el = nodeRefs.current[i];
      const r = el ? Math.max(el.offsetWidth, el.offsetHeight) / 2 + 6 : 40;
      const x = 60 + Math.random() * (W - 120);
      const y = 50 + Math.random() * (H - 100);
      return { x, y, px: x - (Math.random() - 0.5) * 4, py: y - (Math.random() - 0.5) * 4, r, held: false };
    });

    // settle the random scatter into non-overlapping spots before first paint —
    // the physics loop only runs once the arena scrolls into view, so without
    // this the buttons could sit overlapped (failing tap-target rules) offscreen
    for (let iter = 0; iter < 80; iter++) {
      const bs = bodies.current;
      for (let i = 0; i < bs.length; i++) {
        for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i];
          const b = bs[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const min = (a.r + b.r) * 1.04;
          if (dist < min) {
            const push = ((min - dist) / dist) * 0.5;
            a.x -= dx * push;
            a.y -= dy * push;
            b.x += dx * push;
            b.y += dy * push;
          }
        }
      }
      for (const b of bs) {
        b.x = Math.min(Math.max(b.x, b.r), W - b.r);
        b.y = Math.min(Math.max(b.y, b.r), H - b.r);
      }
    }
    // zero out any velocity the relaxation introduced
    bodies.current.forEach((b) => {
      b.px = b.x;
      b.py = b.y;
    });

    bodies.current.forEach((b, i) => {
      const el = nodeRefs.current[i];
      if (el) el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) translate(-50%, -50%)`;
    });

    const onResize = () => {
      W = arena.clientWidth;
      H = arena.clientHeight;
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    const step = () => {
      const bs = bodies.current;
      for (let i = 0; i < bs.length; i++) {
        const b = bs[i];
        if (!b.held) {
          // verlet integrate with damping + faint centering drift
          const vx = (b.x - b.px) * 0.985;
          const vy = (b.y - b.py) * 0.985;
          b.px = b.x;
          b.py = b.y;
          b.x += vx + (W / 2 - b.x) * 0.0004;
          b.y += vy + (H / 2 - b.y) * 0.0004;
        }
        // walls
        if (b.x < b.r) { b.x = b.r; b.px = b.x + (b.x - b.px) * 0.6; }
        if (b.x > W - b.r) { b.x = W - b.r; b.px = b.x + (b.x - b.px) * 0.6; }
        if (b.y < b.r) { b.y = b.r; b.py = b.y + (b.y - b.py) * 0.6; }
        if (b.y > H - b.r) { b.y = H - b.r; b.py = b.y + (b.y - b.py) * 0.6; }
      }
      // pairwise separation (n is small — 14 nodes)
      for (let i = 0; i < bs.length; i++) {
        for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i];
          const b = bs[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          // full radii so node buttons never overlap — overlapping targets
          // fail the WCAG target-size audit and are genuinely hard to grab
          const min = (a.r + b.r) * 1.04;
          if (dist < min) {
            const push = ((min - dist) / dist) * 0.5;
            if (!a.held) { a.x -= dx * push; a.y -= dy * push; }
            if (!b.held) { b.x += dx * push; b.y += dy * push; }
          }
        }
      }
      for (let i = 0; i < bs.length; i++) {
        const el = nodeRefs.current[i];
        const b = bs[i];
        if (el) el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(step);
    };

    // pause when offscreen
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting && !document.hidden) raf = requestAnimationFrame(step);
    });
    io.observe(arena);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [staticMode]);

  const drag = (i: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (staticMode) return;
    const arena = arenaRef.current;
    const b = bodies.current[i];
    if (!arena || !b) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    b.held = true;
    const rect = arena.getBoundingClientRect();
    const move = (ev: PointerEvent) => {
      const nx = ev.clientX - rect.left;
      const ny = ev.clientY - rect.top;
      b.px = b.x;
      b.py = b.y;
      b.x = nx;
      b.y = ny;
    };
    const up = () => {
      b.held = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
  };

  const active = skillNodes[selected];

  return (
    <section id="skills" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24 md:px-10 md:py-32">
      <SectionMark index="03" label="SKILLS" title="NODE PLAYGROUND" />

      <div className="grid gap-px border border-[color:var(--line-strong)] bg-[color:var(--line)] lg:grid-cols-[2fr_1fr]">
        {/* arena */}
        <div
          ref={arenaRef}
          className={cn(
            'relative min-h-[420px] overflow-hidden bg-obsidian',
            staticMode && 'flex flex-wrap content-center items-center justify-center gap-3 p-8',
          )}
        >
          {!staticMode && (
            <p className="readout pointer-events-none absolute left-4 top-4 text-[0.55rem]" aria-hidden="true">
              DRAG NODES · REAL PHYSICS
            </p>
          )}
          {skillNodes.map((node, i) => (
            <button
              key={node.name}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              type="button"
              onPointerDown={drag(i)}
              onFocus={() => setSelected(i)}
              onMouseEnter={() => {
                tick();
                setSelected(i);
              }}
              onClick={() => {
                click();
                setSelected(i);
              }}
              aria-pressed={selected === i}
              className={cn(
                'touch-none select-none border px-4 py-2 font-mono text-xs tracking-wider whitespace-nowrap transition-colors',
                !staticMode && 'absolute left-0 top-0 cursor-grab active:cursor-grabbing',
                selected === i
                  ? 'border-cyan bg-cyan/10 text-cyan'
                  : 'border-[color:var(--line-strong)] bg-obsidian text-dim hover:border-cyan/50 hover:text-ice',
              )}
            >
              {node.name}
            </button>
          ))}
        </div>

        {/* side panel: which real projects used the selected tool */}
        <aside className="bg-obsidian p-6 md:p-7" aria-live="polite">
          <p className="readout mb-1 text-[0.6rem]">SELECTED NODE</p>
          <h3 className="display text-2xl text-cyan">{active.name}</h3>
          <p className="readout mt-1 text-[0.6rem]">CLASS · {active.group.toUpperCase()}</p>

          <p className="readout mt-6 mb-3 text-[0.6rem]">DEPLOYED IN</p>
          {active.projects.length > 0 ? (
            <ul className="space-y-2">
              {active.projects.map((p) => (
                <li key={p.slug} className="flex items-baseline gap-2 text-sm text-ice">
                  <span className="text-cyan" aria-hidden="true">
                    ▸
                  </span>
                  {p.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-dim">
              Coursework & fundamentals — not yet in a shipped repo. Honest data only.
            </p>
          )}
        </aside>
      </div>

      <Reveal className="mt-6">
        <p className="readout text-[0.6rem]">
          MAPPING DERIVED LIVE FROM PROJECT STACKS · NO PERCENTAGES, NO INVENTED PROFICIENCY BARS
        </p>
      </Reveal>
    </section>
  );
}
