import { site } from '@/data/site';
import { Crosshair } from '@/components/Crosshair';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--line)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="readout flex items-center gap-2.5 text-mist">
          <Crosshair className="text-signal" />
          <span>{site.location}</span>
          <span className="text-signal/50" aria-hidden="true">
            ·
          </span>
          <span>27.6194°N 85.5388°E</span>
        </p>
        <p className="readout text-mist/70">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
