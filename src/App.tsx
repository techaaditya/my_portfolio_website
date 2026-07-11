import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'motion/react';
import { SoundProvider } from '@/audio/SoundProvider';
import { GridLines } from '@/components/GridLines';
import { HUD } from '@/components/HUD';
import { Preloader } from '@/sections/Preloader';
import { Hero } from '@/sections/Hero';
import { Telemetry } from '@/sections/Telemetry';
import { WorkMatrix } from '@/sections/WorkMatrix';
import { SkillsSandbox } from '@/sections/SkillsSandbox';
import { Journey } from '@/sections/Journey';
import { Writing } from '@/sections/Writing';
import { ContactTerminal } from '@/sections/ContactTerminal';
import { onFirstInteraction } from '@/lib/interaction';
import { isLowPower, prefersReducedMotion } from '@/hooks/useLowPowerTier';

// The WebGL layer (three + R3F) is the heavy chunk — it loads during the
// boot sequence, and its readiness *is* part of the preloader's progress.
const GLRoot = lazy(() => import('@/gl/GLRoot'));

export default function App() {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const lowPower = useMemo(() => isLowPower(), []);
  const [booted, setBooted] = useState(
    () => reduced || sessionStorage.getItem('as-booted') === '1',
  );
  const [glReady, setGlReady] = useState(false);

  // ambient CSS loops (blink, sweep) hold until a human interacts
  useEffect(
    () => onFirstInteraction(() => document.documentElement.classList.add('motion-armed')),
    [],
  );

  // no scrolling behind the boot screen
  useEffect(() => {
    document.body.style.overflow = booted ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [booted]);

  return (
    <SoundProvider>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation} strict>
          <a
            href="#home"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-cyan focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-obsidian"
          >
            Skip to content
          </a>

          <GridLines />

          {/* reduced-motion visitors get the static instrument — no GL at all.
              Low-power devices boot on fonts alone and pull the heavy three.js
              chunk only after first paint, keeping it off the critical path. */}
          {!reduced && (!lowPower || booted) && (
            <Suspense fallback={null}>
              <GLRoot revealed={booted} onReady={() => setGlReady(true)} />
            </Suspense>
          )}

          {!booted && (
            <Preloader
              glReady={lowPower || glReady}
              onDone={() => {
                sessionStorage.setItem('as-booted', '1');
                setBooted(true);
              }}
            />
          )}

          <HUD />

          <main id="main">
            <Hero revealed={booted} />
            <Telemetry />
            <WorkMatrix />
            <SkillsSandbox />
            <Journey />
            <Writing />
            <ContactTerminal />
          </main>
        </LazyMotion>
      </MotionConfig>
    </SoundProvider>
  );
}
