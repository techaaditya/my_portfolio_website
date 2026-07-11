import type { ReactNode } from 'react';
import { site } from '@/data/site';
import { about } from '@/data/about';
import { useKtmClock } from '@/hooks/useKtmClock';
import { useGithubPulse } from '@/hooks/useGithubPulse';
import { useSound } from '@/audio/SoundProvider';
import { Reveal } from '@/components/Reveal';
import { SocialIcon } from '@/components/icons';

/**
 * Section 3 — the telemetry dashboard. Every value on this panel is real:
 * live NPT clock (with milliseconds), true coordinates, the build's actual
 * git hash + date (injected by Vite), and live GitHub push activity. When
 * the GitHub link is down we say LINK DOWN — no invented meters.
 */
export function Telemetry() {
  const clockMs = useKtmClock(true);
  const pulse = useGithubPulse('TechAaditya');

  return (
    <section id="telemetry" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24 md:px-10 md:py-32">
      <SectionMark index="01" label="TELEMETRY" title="SYSTEM READOUT" />

      <div className="grid gap-px border border-[color:var(--line-strong)] bg-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-3">
        <Panel label="LOCAL TIME · NPT (UTC+5:45)">
          <span className="font-mono text-2xl tabular-nums text-cyan glow md:text-3xl" suppressHydrationWarning>
            {clockMs}
          </span>
        </Panel>

        <Panel label="POSITION · KATHMANDU, NEPAL">
          <span className="font-mono text-lg tabular-nums text-ice md:text-xl">
            27.6194°N · 85.5388°E
          </span>
          <span className="readout mt-2 block text-[0.6rem]">ELEV ≈ 1,400 M · DHULIKHEL CAMPUS</span>
        </Panel>

        <Panel label="AFFILIATION">
          <span className="text-lg text-ice md:text-xl">Kathmandu University</span>
          <span className="readout mt-2 block text-[0.6rem]">DATA SCIENCE & MACHINE LEARNING</span>
        </Panel>

        <Panel label={`GITHUB PUSH ACTIVITY · 14D · ${pulse.status.toUpperCase()}`}>
          {pulse.status === 'down' ? (
            <span className="font-mono text-sm text-amber">▲ LINK DOWN — API UNREACHABLE</span>
          ) : (
            <>
              <Sparkline days={pulse.days} />
              <span className="readout mt-2 block text-[0.6rem]">
                {pulse.total} COMMITS PUSHED · @{'TechAaditya'}
              </span>
            </>
          )}
        </Panel>

        <Panel label="BUILD">
          <span className="font-mono text-lg text-ice">
            #{__BUILD_HASH__} <span className="text-dim">·</span> {__BUILD_DATE__}
          </span>
          <span className="readout mt-2 block text-[0.6rem]">VITE · REACT 19 · DEPLOY: GH ACTIONS</span>
        </Panel>

        <Panel label="CHANNELS">
          <ul className="space-y-1.5">
            {site.socials.map((s) => (
              <ChannelRow key={s.id} id={s.id} label={s.label} url={s.url} handle={s.handle} />
            ))}
          </ul>
        </Panel>

        {/* operator profile — the essential "about" lives on the instrument */}
        <div className="relative bg-obsidian p-6 sm:col-span-2 lg:col-span-3 md:p-8">
          <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-cyan/40" aria-hidden="true" />
          <p className="readout mb-5 text-[0.6rem]">OPERATOR PROFILE</p>
          <div className="grid gap-6 md:grid-cols-3">
            {about.map((para, i) => (
              <p key={i} className={`text-sm leading-relaxed ${i === 0 ? 'text-ice' : 'text-dim'}`}>
                <span className="font-mono text-[0.6rem] text-cyan" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')} ·{' '}
                </span>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Shared section heading used across all v5 sections. */
export function SectionMark({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <header>
        <p className="readout flex items-center gap-2.5 text-cyan">
          <span aria-hidden="true">[{index}]</span> {label}
        </p>
        <h2 className="display mt-3 text-ice" style={{ fontSize: 'var(--text-display)' }}>
          {title}
        </h2>
      </header>
    </Reveal>
  );
}

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative bg-obsidian p-6 md:p-7">
      <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-cyan/40" aria-hidden="true" />
      <p className="readout mb-4 text-[0.6rem]">{label}</p>
      {children}
    </div>
  );
}

function Sparkline({ days }: { days: number[] }) {
  const max = Math.max(1, ...days);
  return (
    <div className="flex h-10 items-end gap-1" aria-label={`Commit activity: ${days.join(', ')}`}>
      {days.map((v, i) => (
        <span
          key={i}
          className={v > 0 ? 'bg-cyan' : 'bg-[color:var(--line-strong)]'}
          style={{ width: 6, height: `${Math.max(8, (v / max) * 100)}%`, transition: 'height .4s' }}
        />
      ))}
    </div>
  );
}

function ChannelRow({ id, label, url, handle }: { id: 'github' | 'linkedin' | 'x' | 'blog'; label: string; url: string; handle?: string }) {
  const { tick, click } = useSound();
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => click()}
        onMouseEnter={() => tick()}
        className="group flex min-h-7 items-center gap-2.5 py-1 font-mono text-xs tracking-wider text-dim transition-colors hover:text-cyan"
      >
        <SocialIcon id={id} size={13} />
        {label.toUpperCase()}
        {handle && <span className="text-[0.62rem]">{handle}</span>}
        <span className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
          ▸
        </span>
      </a>
    </li>
  );
}
