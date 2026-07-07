import { about } from '@/data/about';
import { skillGroups } from '@/data/skills';
import { SectionHeader } from '@/components/SectionHeader';
import { Crosshair } from '@/components/Crosshair';
import { Reveal } from '@/components/Reveal';

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <SectionHeader index="02" label="About" title="A researcher-in-training who ships" />

      <div className="grid gap-12 md:grid-cols-[1.5fr_1fr] md:gap-16">
        <Reveal className="space-y-5 text-lg leading-relaxed text-mist">
          {about.map((para, i) => (
            <p key={i} className={i === 0 ? 'text-foam' : undefined}>
              {para}
            </p>
          ))}
        </Reveal>

        <Reveal>
          <div className="readout mb-6 flex items-center gap-2.5">
            <Crosshair className="text-signal" />
            <span aria-hidden="true">§03</span>
            <span className="text-signal/60" aria-hidden="true">
              ·
            </span>
            <span>Skills</span>
          </div>
          <dl className="space-y-6">
            {skillGroups.map((group) => (
              <div
                key={group.label}
                className="grid grid-cols-[5rem_1fr] gap-4 border-t border-[color:var(--line)] pt-4"
              >
                <dt className="readout pt-0.5 text-signal">{group.label}</dt>
                <dd className="text-foam">{group.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
