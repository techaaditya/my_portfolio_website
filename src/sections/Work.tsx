import { m } from 'motion/react';
import { Star } from 'lucide-react';
import { featuredProject, otherProjects } from '@/data/projects';
import type { Project } from '@/data/projects';
import { SectionHeader } from '@/components/SectionHeader';
import { ProjectLinks } from '@/components/ProjectLinks';
import { Crosshair } from '@/components/Crosshair';
import { Reveal } from '@/components/Reveal';
import { reveal, revealGroup, inViewOnce } from '@/lib/motion';

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <SectionHeader index="01" label="Work" title="Selected work" />

      {featuredProject && <Featured project={featuredProject} />}

      <m.ul
        className="mt-6 border-t border-[color:var(--line)]"
        variants={revealGroup}
        initial="hidden"
        whileInView="show"
        viewport={inViewOnce}
      >
        {otherProjects.map((p) => (
          <Row key={p.slug} project={p} />
        ))}
      </m.ul>
    </section>
  );
}

/** The large, asymmetric featured slot — the one ember star on the chart. */
function Featured({ project }: { project: Project }) {
  return (
    <Reveal
      as="article"
      className="group relative grid gap-6 rounded-xl border border-[color:var(--line)] bg-abyss/40 p-6 md:grid-cols-[1fr_auto] md:p-9"
    >
      <Star
        size={18}
        className="plot-star absolute right-6 top-6 fill-ember md:right-9 md:top-9"
        aria-hidden="true"
      />
      <div className="max-w-2xl">
        <div className="readout flex items-center gap-2.5">
          <span>{project.year}</span>
          <span className="text-signal/60">/</span>
          <span>{project.discipline}</span>
        </div>
        <h3 className="mt-3 font-display text-3xl leading-tight text-foam md:text-4xl">
          {project.title}
        </h3>
        <p className="mt-4 text-mist md:text-lg">{project.description}</p>
        {project.credit && <p className="mt-4 readout text-mist/70">{project.credit}</p>}
        <ProjectLinks project={project} className="mt-6" />
      </div>
    </Reveal>
  );
}

/** Compact index row: year/discipline readout + title, hover crosshair + lift. */
function Row({ project }: { project: Project }) {
  return (
    <m.li variants={reveal} className="border-b border-[color:var(--line)]">
      <div className="group grid gap-3 py-6 transition-colors md:grid-cols-[8rem_1fr_auto] md:items-baseline md:gap-6 md:py-7">
        <div className="readout flex items-center gap-2 text-mist md:flex-col md:items-start md:gap-1">
          <span>{project.year}</span>
          <span className="text-signal/50 md:hidden">/</span>
          <span>{project.discipline}</span>
        </div>

        <h3 className="flex items-center gap-2.5 font-display text-2xl text-foam md:text-3xl">
          <Crosshair
            size={11}
            className="text-signal opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            {project.title}
          </span>
        </h3>

        <ProjectLinks project={project} className="md:justify-end" />
      </div>
    </m.li>
  );
}
