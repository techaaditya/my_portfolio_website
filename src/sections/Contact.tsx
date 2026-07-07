import { site } from '@/data/site';
import { SocialLinks } from '@/components/SocialLinks';
import { CopyEmail } from '@/components/CopyEmail';
import { Magnetic } from '@/components/Magnetic';
import { Reveal } from '@/components/Reveal';

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-28 md:px-8 md:py-44">
      <Reveal>
        <p className="readout flex items-center gap-2.5">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan" />
          <span aria-hidden="true">§04</span>
          <span className="text-signal/60" aria-hidden="true">
            ·
          </span>
          <span>Contact</span>
        </p>

        <h2
          className="mt-6 max-w-4xl font-display tracking-tight text-foam"
          style={{ fontSize: 'var(--text-display)', lineHeight: 1.02 }}
        >
          Working on something in data, research, or the web? <em className="text-aurora">Let's talk.</em>
        </h2>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-5">
          <Magnetic strength={0.2}>
            <a
              href={`mailto:${site.email}`}
              className="link-sweep pb-2 font-display text-[clamp(1.4rem,4.5vw,3rem)] tracking-tight text-foam"
            >
              {site.email}
            </a>
          </Magnetic>
          <CopyEmail />
        </div>

        <div className="mt-10">
          <SocialLinks iconSize={20} />
        </div>
      </Reveal>
    </section>
  );
}
