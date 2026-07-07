import { useEffect, useState } from 'react';
import { site } from '@/data/site';

/** Live Kathmandu clock — the site's "observatory" is a real place. */
function KathmanduTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());

  const [now, setNow] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setNow(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {now} NPT
    </span>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const watermark = Array.from({ length: 4 }, () => site.name);

  return (
    <footer className="border-t border-[color:var(--line)]">
      {/* drifting outline-type watermark */}
      <div className="marquee py-8" aria-hidden="true">
        <div className="marquee-track">
          {[...watermark, ...watermark].map((name, i) => (
            <span
              key={i}
              className="text-outline whitespace-nowrap px-10 font-display text-[clamp(3.5rem,9vw,7rem)] leading-none tracking-tight"
            >
              {name} <span className="text-aurora not-italic">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pb-10 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="readout flex flex-wrap items-center gap-2.5 text-mist">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan" />
          <span>{site.location}</span>
          <span className="text-signal/50" aria-hidden="true">
            ·
          </span>
          <span>27.6194°N 85.5388°E</span>
          <span className="text-signal/50" aria-hidden="true">
            ·
          </span>
          <KathmanduTime />
        </p>
        <p className="readout">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
