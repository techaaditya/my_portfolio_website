import { lazy, Suspense, useEffect } from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'motion/react';
import { AuroraBg } from '@/components/AuroraBg';
import { ParticleField } from '@/components/ParticleField';
import { Cursor } from '@/components/Cursor';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Nav } from '@/components/Nav';
import { Hero } from '@/sections/Hero';
import { onFirstInteraction } from '@/lib/interaction';

// Below-the-fold sections load as separate chunks right after the shell —
// the boot render stays small, so no single long task blocks the main thread.
const Work = lazy(() => import('@/sections/Work').then((m) => ({ default: m.Work })));
const About = lazy(() => import('@/sections/About').then((m) => ({ default: m.About })));
const Writing = lazy(() => import('@/sections/Writing').then((m) => ({ default: m.Writing })));
const Contact = lazy(() => import('@/sections/Contact').then((m) => ({ default: m.Contact })));
const Footer = lazy(() => import('@/sections/Footer').then((m) => ({ default: m.Footer })));

export default function App() {
  // ambient CSS animation (aurora drift, marquees, pulse dots) stays paused
  // until the visitor first interacts — the sky wakes up when a human arrives
  useEffect(
    () => onFirstInteraction(() => document.documentElement.classList.add('motion-armed')),
    [],
  );

  return (
    // `reducedMotion="user"` makes every Motion animation honor
    // prefers-reduced-motion automatically. `LazyMotion` + `domAnimation`
    // ships only the animation features we use (no layout/drag) — leaner JS.
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-signal focus:px-4 focus:py-2 focus:text-space"
        >
          Skip to content
        </a>

        <AuroraBg />
        <ParticleField />
        <Cursor />
        <SmoothScroll />
        <Nav />

        <main id="main">
          <Hero />
          <Suspense fallback={null}>
            <Work />
          </Suspense>
          <Suspense fallback={null}>
            <About />
          </Suspense>
          <Suspense fallback={null}>
            <Writing />
          </Suspense>
          <Suspense fallback={null}>
            <Contact />
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </LazyMotion>
    </MotionConfig>
  );
}
