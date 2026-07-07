import { LazyMotion, domAnimation, MotionConfig } from 'motion/react';
import { StarChart } from '@/components/StarChart';
import { Nav } from '@/components/Nav';
import { Hero } from '@/sections/Hero';
import { Work } from '@/sections/Work';
import { About } from '@/sections/About';
import { Writing } from '@/sections/Writing';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';

export default function App() {
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

        <StarChart />
        <Nav />

        <main id="main">
          <Hero />
          <Work />
          <About />
          <Writing />
          <Contact />
        </main>

        <Footer />
      </LazyMotion>
    </MotionConfig>
  );
}
