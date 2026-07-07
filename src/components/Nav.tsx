import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { site } from '@/data/site';
import { useScrolled } from '@/hooks/useScrolled';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/cn';
import { ease } from '@/lib/motion';

const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
] as const;

const SECTION_IDS = ['home', ...NAV.map((n) => n.id)];

export function Nav() {
  const scrolled = useScrolled();
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'border-b border-[color:var(--line)] bg-space/80 backdrop-blur-md'
          : 'border-b border-transparent',
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8"
      >
        <a
          href="#home"
          className="font-display text-xl tracking-tight text-foam transition-colors hover:text-signal"
        >
          {site.name}
        </a>

        {/* desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                className={cn(
                  'readout transition-colors hover:text-foam',
                  active === item.id ? 'text-signal' : 'text-mist',
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foam md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="border-t border-[color:var(--line)] bg-space/95 backdrop-blur-md md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-5 py-2">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'block py-3 text-lg transition-colors',
                      active === item.id ? 'text-signal' : 'text-foam',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
