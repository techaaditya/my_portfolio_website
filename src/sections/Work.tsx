import { m } from 'motion/react';
import { Sparkle } from 'lucide-react';
import { featuredProject, otherProjects } from '@/data/projects';
import type { Project } from '@/data/projects';
import { SectionHeader } from '@/components/SectionHeader';
import { ProjectLinks } from '@/components/ProjectLinks';
import { TiltCard } from '@/components/TiltCard';
import { Reveal } from '@/components/Reveal';
import { reveal, revealGroup, inViewOnce } from '@/lib/motion';

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:px-8 md:py-36">
      <SectionHeader index="01" label="Work" title="Things I've" accent="actually shipped" />

      {featuredProject && <Featured project={featuredProject} />}

      <m.ul
        className="mt-6 grid gap-6 md:grid-cols-2"
        variants={revealGroup}
        initial="hidden"
        whileInView="show"
        viewport={inViewOnce}
      >
        {otherProjects.map((p, i) => (
          <Card key={p.slug} project={p} index={i + 2} />
        ))}
      </m.ul>
    </section>
  );
}

function StackChips({ stack }: { stack: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {stack.map((s) => (
        <li
          key={s}
          className="rounded-full border border-[color:var(--line)] px-3 py-1 font-mono text-[0.68rem] tracking-wide text-mist"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

/** The one large card — the brightest star in the field. */
function Featured({ project }: { project: Project }) {
  return (
    <Reveal>
      <TiltCard maxTilt={4} className="aurora-border overflow-hidden rounded-3xl">
        <div className="relative p-8 md:p-12">
          {/* oversized index watermark */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-10 font-display text-[10rem] leading-none text-signal/10 select-none md:text-[16rem]"
          >
            01
          </span>

          <div className="readout flex items-center gap-2.5">
            <Sparkle size={13} className="text-ember" aria-hidden="true" />
            <span>Featured</span>
            <span className="text-signal/60" aria-hidden="true">
              ·
            </span>
            <span>
              {project.year} — {project.discipline}
            </span>
          </div>

          <h3
            className="relative mt-5 max-w-3xl font-display tracking-tight text-foam"
            style={{ fontSize: 'var(--text-title)', lineHeight: 1.08 }}
          >
            {project.title}
          </h3>

          <p className="relative mt-5 max-w-2xl leading-relaxed text-mist">{project.description}</p>

          {project.credit && <p className="readout relative mt-5 normal-case">{project.credit}</p>}

          <div className="relative mt-7 flex flex-wrap items-center justify-between gap-5">
            <StackChips stack={project.stack} />
            <ProjectLinks project={project} />
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

/** Grid card: tilt + cursor spotlight, index readout, hover-slide title. */
function Card({ project, index }: { project: Project; index: number }) {
  return (
    <m.li variants={reveal} className="h-full">
      <TiltCard className="group h-full rounded-2xl border border-[color:var(--line)] bg-abyss/60 transition-colors duration-300 hover:border-signal/45">
        <div className="flex h-full flex-col p-7 md:p-8">
          <div className="readout flex items-center justify-between">
            <span>
              {String(index).padStart(2, '0')} · {project.year}
            </span>
            <span>{project.discipline}</span>
          </div>

          <h3 className="mt-4 font-display text-2xl tracking-tight text-foam transition-transform duration-300 group-hover:translate-x-1 md:text-[1.7rem]">
            {project.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-mist">{project.description}</p>

          {project.credit && (
            <p className="readout mt-4 normal-case text-mist/80">{project.credit}</p>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
            <StackChips stack={project.stack} />
            <ProjectLinks project={project} />
          </div>
        </div>
      </TiltCard>
    </m.li>
  );
}
