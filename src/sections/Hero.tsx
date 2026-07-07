import { motion } from 'motion/react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { site } from '@/data/site';
import { SocialLinks } from '@/components/SocialLinks';
import { Crosshair } from '@/components/Crosshair';
import { ease } from '@/lib/motion';

const KATHMANDU = '27.6194°N · 85.5388°E';

export function Hero() {
  return (
    <section
      id="home"
      className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 pt-24 pb-16 md:px-8"
    >
      {/* orchestrated load sequence: readout → name → role → actions */}
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
        <motion.p
          className="readout flex items-center gap-2.5"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5, ease } } }}
        >
          <Crosshair className="text-signal" />
          <span aria-hidden="true">§00</span>
          <span className="text-signal/60" aria-hidden="true">
            ·
          </span>
          <span>{KATHMANDU}</span>
        </motion.p>

        <motion.h1
          className="mt-5 font-display leading-[0.95] text-foam"
          style={{ fontSize: 'var(--text-hero)' }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
          }}
        >
          Aaditya
          <br />
          Sapkota
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xl text-lg text-mist md:text-xl"
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
          }}
        >
          {site.roleLine}. Based in {site.location} — {site.locationDetail}.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3"
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
          }}
        >
          <a
            href={site.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-5 py-2.5 text-sm font-medium text-foam transition-colors hover:border-signal hover:bg-signal/20"
          >
            <FileText size={16} className="text-signal" />
            Résumé
            <ArrowUpRight
              size={15}
              className="text-signal transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <SocialLinks />
        </motion.div>
      </motion.div>
    </section>
  );
}
