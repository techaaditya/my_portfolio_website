import { Crosshair } from './Crosshair';

/**
 * Section eyebrow rendered as an instrument readout: an index + coordinate
 * label in mono, a crosshair mark, and the display title. The recurring
 * "readout" frame that ties every section to the star-chart identity.
 */
export function SectionHeader({
  index,
  label,
  title,
  id,
}: {
  index: string;
  label: string;
  title: string;
  id?: string;
}) {
  return (
    <header className="mb-10 md:mb-14">
      <div className="readout flex items-center gap-2.5">
        <Crosshair className="text-signal" />
        <span aria-hidden="true">§{index}</span>
        <span className="text-signal/60" aria-hidden="true">
          ·
        </span>
        <span>{label}</span>
      </div>
      <h2
        id={id}
        className="mt-3 font-display text-[color:var(--color-foam)]"
        style={{ fontSize: 'var(--text-display)', lineHeight: 1.05 }}
      >
        {title}
      </h2>
    </header>
  );
}
