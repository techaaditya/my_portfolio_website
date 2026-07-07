import { m } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { posts, allPostsUrl } from '@/data/writing';
import { SectionHeader } from '@/components/SectionHeader';
import { reveal, revealGroup, inViewOnce } from '@/lib/motion';

export function Writing() {
  return (
    <section id="writing" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:px-8 md:py-36">
      <SectionHeader index="03" label="Writing" title="Notes &" accent="essays" />

      <m.ul
        className="border-t border-[color:var(--line)]"
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
              className="group grid gap-2 py-7 transition-[padding] duration-300 hover:pl-3 md:grid-cols-[6rem_1fr_auto] md:items-baseline md:gap-8 md:py-9"
            >
              <span
                className="font-display text-3xl text-signal/35 transition-colors duration-300 group-hover:text-signal md:text-4xl"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="flex items-center gap-3 font-display text-2xl tracking-tight text-foam md:text-4xl">
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    {post.title}
                  </span>
                  <ArrowUpRight
                    size={22}
                    className="shrink-0 text-cyan opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-2 block max-w-xl text-mist">{post.blurb}</span>
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
        className="link-sweep group mt-10 inline-flex items-center gap-2 pb-1 text-mist transition-colors hover:text-foam"
      >
        All posts
        <ArrowUpRight
          size={16}
          className="text-cyan transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </section>
  );
}
