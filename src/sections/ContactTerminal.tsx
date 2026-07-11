import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '@/data/site';
import { SectionMark } from './Telemetry';
import { useSound } from '@/audio/SoundProvider';
import { useKtmClock } from '@/hooks/useKtmClock';
import { prefersReducedMotion } from '@/hooks/useLowPowerTier';

/**
 * Section 8 — the contact terminal. A real, typeable command line: clicking
 * the idle terminal auto-types `sayhi`; every keypress clicks (when sound is
 * on). `send <msg>` composes a real mailto: and hands off to the visitor's
 * mail client — the output says exactly that, because there is no backend
 * and this site doesn't fake features. Footer telemetry lives below.
 */

interface Line {
  kind: 'in' | 'out' | 'accent';
  text: string;
}

const BANNER: Line[] = [
  { kind: 'accent', text: 'AADITYA.SAPKOTA — CONTACT TERMINAL v5' },
  { kind: 'out', text: `Type 'help' for available commands. Click anywhere to begin.` },
];

export function ContactTerminal() {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { click, confirm, tick } = useSound();
  const autoTyping = useRef(false);

  const push = useCallback((...newLines: Line[]) => {
    setLines((prev) => [...prev.slice(-40), ...newLines]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const open = useCallback((url: string, label: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    return `OPENING ${label} ▸`;
  }, []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;
      push({ kind: 'in', text: `> ${cmd}` });
      confirm();

      const [head, ...rest] = cmd.toLowerCase().split(/\s+/);
      const arg = cmd.slice(head.length).trim();

      switch (head) {
        case 'help':
          push(
            { kind: 'out', text: 'AVAILABLE COMMANDS' },
            { kind: 'out', text: '  sayhi           open a hello email' },
            { kind: 'out', text: '  send <message>  compose an email with your message' },
            { kind: 'out', text: '  email           show the address' },
            { kind: 'out', text: '  github / linkedin / x / blog / resume' },
            { kind: 'out', text: '  clear           wipe the terminal' },
          );
          break;
        case 'sayhi': {
          window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Hi Aaditya')}`;
          push(
            { kind: 'accent', text: 'TRANSMISSION HANDED TO YOUR MAIL CLIENT ▸' },
            { kind: 'out', text: `If nothing opened: ${site.email}` },
          );
          break;
        }
        case 'send': {
          if (!arg) {
            push({ kind: 'out', text: 'USAGE: send <your message>' });
            break;
          }
          window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Hello from your portfolio')}&body=${encodeURIComponent(arg)}`;
          push(
            { kind: 'accent', text: 'TRANSMISSION HANDED TO YOUR MAIL CLIENT ▸' },
            { kind: 'out', text: 'No backend here — your own mail app sends it. Honest engineering.' },
          );
          break;
        }
        case 'email':
          push({ kind: 'accent', text: site.email });
          break;
        case 'github':
          push({ kind: 'accent', text: open(site.socials[0].url, 'GITHUB') });
          break;
        case 'linkedin':
          push({ kind: 'accent', text: open(site.socials[1].url, 'LINKEDIN') });
          break;
        case 'x':
          push({ kind: 'accent', text: open(site.socials[2].url, 'X') });
          break;
        case 'blog':
          push({ kind: 'accent', text: open(site.socials[3].url, 'BLOG') });
          break;
        case 'resume':
        case 'résumé':
          push({ kind: 'accent', text: open(site.resumePath, 'RESUME.PDF') });
          break;
        case 'clear':
          setLines([]);
          break;
        default:
          push({ kind: 'out', text: `UNKNOWN COMMAND '${head}' — try 'help'` });
          void rest;
      }
    },
    [push, confirm, open],
  );

  /** First click on an untouched terminal auto-types `sayhi`. */
  const focusTerminal = useCallback(() => {
    inputRef.current?.focus();
    if (touched || autoTyping.current) return;
    autoTyping.current = true;
    setTouched(true);
    if (prefersReducedMotion()) {
      setValue('sayhi');
      autoTyping.current = false;
      return;
    }
    const word = 'sayhi';
    let i = 0;
    const step = () => {
      i++;
      tick();
      setValue(word.slice(0, i));
      if (i < word.length) {
        window.setTimeout(step, 110);
      } else {
        autoTyping.current = false;
      }
    };
    window.setTimeout(step, 200);
  }, [touched, tick]);

  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-16 px-5 pt-24 pb-10 md:px-10 md:pt-32">
      <SectionMark index="06" label="CONTACT" title="OPEN CHANNEL" />

      <div
        className="cursor-text border border-[color:var(--line-strong)] bg-panel/60"
        onClick={focusTerminal}
      >
        {/* title bar */}
        <div className="flex items-center justify-between border-b border-[color:var(--line)] px-4 py-2.5">
          <span className="readout text-[0.6rem]">TTY · sayhi@aadityasapkota.com.np</span>
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-rust/80" />
            <span className="h-2 w-2 rounded-full bg-amber/80" />
            <span className="h-2 w-2 rounded-full bg-cyan/80" />
          </span>
        </div>

        {/* scrollback */}
        <div ref={scrollRef} className="h-64 overflow-y-auto p-4 font-mono text-xs leading-relaxed md:text-sm" aria-live="polite">
          {lines.map((l, i) => (
            <p
              key={i}
              className={
                l.kind === 'accent' ? 'text-cyan' : l.kind === 'in' ? 'text-ice' : 'text-dim'
              }
            >
              {l.text}
            </p>
          ))}
        </div>

        {/* prompt */}
        <form
          className="flex items-center gap-2 border-t border-[color:var(--line)] px-4 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
            setValue('');
          }}
        >
          <span className="font-mono text-sm text-cyan" aria-hidden="true">
            ▸
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setTouched(true);
              setValue(e.target.value);
            }}
            onKeyDown={() => click()}
            className="w-full bg-transparent font-mono text-sm text-ice caret-cyan outline-none placeholder:text-dim/50"
            placeholder="type a command — try 'sayhi'"
            aria-label="Terminal command input"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="h-4 w-2 animate-caret bg-cyan" aria-hidden="true" />
        </form>
      </div>

      {/* direct fallback for non-terminal people */}
      <p className="mt-6 font-mono text-xs tracking-wider text-dim">
        PREFER PLAIN EMAIL?{' '}
        <a href={`mailto:${site.email}`} className="link-sweep pb-0.5 text-cyan" onClick={() => click()}>
          {site.email}
        </a>
      </p>

      <Footer />
    </section>
  );
}

function Footer() {
  const clock = useKtmClock();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-[color:var(--line-strong)] pt-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="readout flex flex-wrap items-center gap-2.5 text-[0.6rem]">
          <span className="inline-block h-1.5 w-1.5 animate-blink rounded-full bg-cyan" aria-hidden="true" />
          KATHMANDU · 27.6194°N 85.5388°E
          <span className="text-cyan/50" aria-hidden="true">·</span>
          <span className="tabular-nums" suppressHydrationWarning>
            {clock} NPT
          </span>
          <span className="text-cyan/50" aria-hidden="true">·</span>
          BUILD #{__BUILD_HASH__}
        </p>
        <p className="readout text-[0.6rem]">
          © {year} {site.name.toUpperCase()} · ALL SYSTEMS NOMINAL
        </p>
      </div>
    </footer>
  );
}
