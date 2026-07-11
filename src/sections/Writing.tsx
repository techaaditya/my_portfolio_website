import { useState } from 'react';
import { m } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { posts, allPostsUrl } from '@/data/writing';
import { SectionMark } from './Telemetry';
import { Scramble } from '@/components/Scramble';
import { useSound } from '@/audio/SoundProvider';
import { reveal, revealGroup, inViewOnce } from '@/lib/motion';

/**
 * Section 7 — notes & essays: stark type-heavy entries; hovering a title
 * mechanically scrambles its abstract (tick sound when enabled).
 */
export function Writing() {
  const { tick, click } = useSound();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="writing" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24 md:px-10 md:py-32">
      <SectionMark index="05" label="WRITING" title="FIELD NOTES" />

      <m.ul
        className="border-t border-[color:var(--line-strong)]"
        variants={revealGroup}
        initial="hidden"
        whileInView="show"
        viewport={inViewOnce}
      >
        {posts.map((post, i) => (
          <m.li key={post.url} variants={reveal} className="border-b border-[color:var(--line)]">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => click()}
              onMouseEnter={() => {
                tick();
                setHovered(post.url);
              }}
              onMouseLeave={() => setHovered(null)}
              className="group grid gap-2 py-7 transition-[padding,background-color] duration-300 hover:bg-panel hover:pl-3 md:grid-cols-[6rem_1fr_auto] md:items-baseline md:gap-8 md:py-9"
            >
              <span className="font-mono text-xs text-cyan/70" aria-hidden="true">
                ENTRY {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="display flex items-center gap-3 text-2xl text-ice transition-colors group-hover:text-cyan md:text-4xl">
                  {post.title}
                  <ArrowUpRight
                    size={20}
                    className="shrink-0 text-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-2 block max-w-xl font-mono text-xs leading-relaxed tracking-wide text-dim">
                  <Scramble text={post.blurb} active={hovered === post.url} />
                </span>
              </span>
              <span className="readout md:justify-self-end">{post.year}</span>
            </a>
          </m.li>
        ))}
      </m.ul>

      <a
        href={allPostsUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => click()}
        className="link-sweep mt-10 inline-flex items-center gap-2 pb-1 font-mono text-xs tracking-widest text-dim uppercase transition-colors hover:text-ice"
      >
        Access full archive
        <ArrowUpRight size={14} className="text-cyan" />
      </a>
    </section>
  );
}
