import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { useSound } from '@/audio/SoundProvider';
import { isLowPower } from '@/hooks/useLowPowerTier';

/**
 * Boot HUD: a circular calibration dial whose percentage tracks *real*
 * readiness — self-hosted fonts (document.fonts.ready) and the lazy WebGL
 * chunk compiling its first context — smoothed over a 1.6 s minimum
 * choreography. Directory lines are the site's actual modules. On complete,
 * the interface peels upward into the viewport (sub-bass sweep if sound is
 * enabled — it defaults off). Skipped entirely for reduced-motion and repeat
 * visits in the same session (App decides; this component just renders).
 */

const DIRECTORIES = [
  '/sys/fonts/geist-sans.woff2',
  '/sys/fonts/geist-mono.woff2',
  '/gl/pointcloud.vert',
  '/gl/pointcloud.frag',
  '/gl/fluid.frag',
  '/data/projects.ts',
  '/data/skills.ts',
  '/data/timeline.ts',
  '/audio/engine.ts',
  '/sys/hud.calibrate',
] as const;

const R = 56;
const CIRC = 2 * Math.PI * R;

export function Preloader({ glReady, onDone }: { glReady: boolean; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [line, setLine] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const { sweep } = useSound();
  const startRef = useRef(performance.now());
  // phones don't wait for the GL chunk, so a long dial is pure delay there —
  // keep the full 1.6 s choreography for the desktop boot only
  const minMs = useRef(isLowPower() ? 800 : 1600);
  const fontsReady = useRef(false);
  const doneRef = useRef(false);

  useEffect(() => {
    document.fonts.ready.then(() => (fontsReady.current = true));
  }, []);

  // progress climbs toward the milestone-derived target; completes only when
  // everything real is ready AND the minimum choreography time has elapsed
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const elapsed = performance.now() - startRef.current;
      const target = 12 + (fontsReady.current ? 30 : 0) + (glReady ? 46 : 0) + Math.min(12, elapsed / 140);
      setProgress((p) => {
        const next = p + (Math.min(target, 100) - p) * 0.06;
        if (next > 99.2 && fontsReady.current && glReady && elapsed > minMs.current && !doneRef.current) {
          doneRef.current = true;
          sweep();
          setLeaving(true);
          window.setTimeout(onDone, 750);
          return 100;
        }
        return next;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [glReady, onDone, sweep]);

  // directory ticker
  useEffect(() => {
    const id = window.setInterval(() => setLine((v) => (v + 1) % DIRECTORIES.length), 210);
    return () => window.clearInterval(id);
  }, []);

  const pct = Math.floor(progress);

  return (
    <AnimatePresence>
      {!leaving ? (
        <m.div
          key="boot"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-obsidian"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
          aria-label="Loading"
          role="status"
        >
          {/* calibration dial */}
          <div className="relative h-40 w-40">
            <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
              <circle cx="70" cy="70" r={R} fill="none" stroke="var(--line)" strokeWidth="1" />
              {/* tick ring */}
              {Array.from({ length: 36 }, (_, i) => {
                const a = (i / 36) * Math.PI * 2;
                const on = i / 36 <= progress / 100;
                return (
                  <line
                    key={i}
                    x1={70 + Math.cos(a) * 64}
                    y1={70 + Math.sin(a) * 64}
                    x2={70 + Math.cos(a) * 68}
                    y2={70 + Math.sin(a) * 68}
                    stroke={on ? 'var(--color-cyan)' : 'var(--line-strong)'}
                    strokeWidth="1"
                  />
                );
              })}
              <circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke="var(--color-cyan)"
                strokeWidth="1.5"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - progress / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl tabular-nums text-ice">{pct}</span>
              <span className="readout text-[0.55rem]">PCT</span>
            </div>
          </div>

          <p className="readout mt-8 text-cyan">SYSTEM CALIBRATION</p>
          <p className="mt-3 h-4 font-mono text-[0.62rem] tracking-wider text-dim" aria-hidden="true">
            LOADING {DIRECTORIES[line]}
          </p>
          <p className="readout mt-6 text-[0.55rem] opacity-60" aria-hidden="true">
            AADITYA SAPKOTA · PORTFOLIO OS · KTM 27.6194°N
          </p>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
