import { useState } from 'react';
import { AnimatePresence, m, useScroll } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { site } from '@/data/site';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useScrolled } from '@/hooks/useScrolled';
import { useKtmClock } from '@/hooks/useKtmClock';
import { SoundToggle } from '@/audio/SoundToggle';
import { useSound } from '@/audio/SoundProvider';
import { cn } from '@/lib/cn';
import { ease } from '@/lib/motion';

const NAV = [
  { id: 'telemetry', label: 'TELEMETRY', index: '01' },
  { id: 'work', label: 'WORK', index: '02' },
  { id: 'skills', label: 'SKILLS', index: '03' },
  { id: 'journey', label: 'JOURNEY', index: '04' },
  { id: 'writing', label: 'WRITING', index: '05' },
  { id: 'contact', label: 'CONTACT', index: '06' },
] as const;

const SECTION_IDS = ['home', ...NAV.map((n) => n.id)];

/**
 * The persistent instrument HUD: corner brackets, indexed nav, sound toggle,
 * live clock, cyan scroll-progress hairline, and the active-section readout.
 */
export function HUD() {
  const scrolled = useScrolled();
  const active = useActiveSection(SECTION_IDS);
  const clock = useKtmClock();
  const { click, tick } = useSound();
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const activeNav = NAV.find((n) => n.id === active);

  return (
    <>
      {/* scroll progress hairline */}
      <m.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-cyan"
        style={{ scaleX: scrollYProgress }}
      />

      {/* corner brackets */}
      <div className="pointer-events-none fixed inset-3 z-[55] hidden md:block" aria-hidden="true">
        {(
          [
            ['left-0 top-0', 'border-l border-t'],
            ['right-0 top-0', 'border-r border-t'],
            ['left-0 bottom-0', 'border-l border-b'],
            ['right-0 bottom-0', 'border-r border-b'],
          ] as const
        ).map(([pos, borders]) => (
          <span
            key={pos}
            className={cn('absolute h-4 w-4 border-[color:var(--line-strong)]', pos, borders)}
          />
        ))}
      </div>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
          scrolled ? 'border-b border-[color:var(--line)] bg-obsidian/80 backdrop-blur-sm' : '',
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:px-10"
        >
          <a
            href="#home"
            onClick={() => click()}
            className="display text-sm tracking-normal text-ice transition-colors hover:text-cyan"
          >
            AADITYA<span className="text-cyan">.</span>SAPKOTA
          </a>

          {/* desktop nav */}
          <ul className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                  onClick={() => click()}
                  onMouseEnter={() => tick()}
                  className={cn(
                    'readout transition-colors hover:text-ice',
                    active === item.id && 'text-cyan',
                  )}
                >
                  <span aria-hidden="true">[{item.index}]</span> {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-4 lg:flex">
            <span className="readout tabular-nums" suppressHydrationWarning>
              KTM {clock}
            </span>
            <SoundToggle />
          </div>

          {/* mobile toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <SoundToggle />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center text-ice"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => {
                click();
                setOpen((v) => !v);
              }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* mobile drawer */}
        <AnimatePresence>
          {open && (
            <m.div
              className="border-t border-[color:var(--line)] bg-obsidian/95 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease }}
            >
              <ul className="mx-auto flex max-w-7xl flex-col px-5 py-3">
                {NAV.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => {
                        click();
                        setOpen(false);
                      }}
                      className={cn(
                        'readout block py-3 text-sm',
                        active === item.id ? 'text-cyan' : 'text-ice',
                      )}
                    >
                      [{item.index}] {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </m.div>
          )}
        </AnimatePresence>
      </header>

      {/* bottom-left active-section readout */}
      <div
        className="readout pointer-events-none fixed bottom-4 left-5 z-[55] hidden text-[0.6rem] md:block"
        aria-hidden="true"
      >
        {activeNav ? `SEC ${activeNav.index} · ${activeNav.label}` : 'SEC 00 · INDEX'}
      </div>
      <p
        className="readout pointer-events-none fixed bottom-4 right-5 z-[55] hidden text-[0.6rem] md:block"
        aria-hidden="true"
      >
        {site.location.toUpperCase()} · 27.6194°N 85.5388°E
      </p>
    </>
  );
}
