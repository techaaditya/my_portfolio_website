import { Reveal } from './Reveal';

/**
 * Section eyebrow: pulsing aurora dot + mono index/label readout, then the
 * display title — with an optional final phrase set in italic aurora
 * gradient, the recurring type treatment that ties the site together.
 */
export function SectionHeader({
  index,
  label,
  title,
  accent,
  id,
}: {
  index: string;
  label: string;
  title: string;
  /** Optional phrase appended in italic aurora gradient. */
  accent?: string;
  id?: string;
}) {
  return (
    <Reveal as="div" className="mb-12 md:mb-16">
      <header>
        <div className="readout flex items-center gap-2.5">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan" />
          <span aria-hidden="true">§{index}</span>
          <span className="text-signal/60" aria-hidden="true">
            ·
          </span>
          <span>{label}</span>
        </div>
        <h2
          id={id}
          className="mt-4 font-display tracking-tight text-foam"
          style={{ fontSize: 'var(--text-display)', lineHeight: 1.02 }}
        >
          {title}
          {accent && (
            <>
              {' '}
              <em className="text-aurora">{accent}</em>
            </>
          )}
        </h2>
      </header>
    </Reveal>
  );
}
