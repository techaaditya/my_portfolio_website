import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { posts, allPostsUrl } from '@/data/writing';
import { SectionHeader } from '@/components/SectionHeader';
import { reveal, revealGroup, inViewOnce } from '@/lib/motion';

export function Writing() {
  return (
    <section id="writing" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <SectionHeader index="04" label="Writing" title="Notes & essays" />

      <motion.ul
        className="border-t border-[color:var(--line)]"
        variants={revealGroup}
        initial="hidden"
        whileInView="show"
        viewport={inViewOnce}
      >
        {posts.map((post) => (
          <motion.li key={post.url} variants={reveal} className="border-b border-[color:var(--line)]">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-2 py-6 md:grid-cols-[5rem_1fr_auto] md:items-baseline md:gap-6"
            >
              <span className="readout text-mist">{post.year}</span>
              <span>
                <span className="font-display text-2xl text-foam transition-colors group-hover:text-signal md:text-3xl">
                  {post.title}
                </span>
                <span className="mt-1 block max-w-xl text-mist">{post.blurb}</span>
              </span>
              <ArrowUpRight
                size={20}
                className="hidden text-mist transition-all group-hover:text-signal md:block md:justify-self-end"
              />
            </a>
          </motion.li>
        ))}
      </motion.ul>

      <a
        href={allPostsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 inline-flex items-center gap-2 text-mist transition-colors hover:text-signal"
      >
        All posts
        <ArrowUpRight
          size={16}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </section>
  );
}
