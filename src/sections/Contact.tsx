import { site } from '@/data/site';
import { SectionHeader } from '@/components/SectionHeader';
import { SocialLinks } from '@/components/SocialLinks';
import { CopyEmail } from '@/components/CopyEmail';
import { Reveal } from '@/components/Reveal';

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <SectionHeader index="05" label="Contact" title="Get in touch" />

      <Reveal className="max-w-2xl">
        <p className="text-lg text-mist">
          Working on something in data, research, or the web — or just want to say hello? The fastest
          way to reach me is email.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${site.email}`}
            className="font-display text-2xl text-foam transition-colors hover:text-signal md:text-3xl"
          >
            {site.email}
          </a>
          <CopyEmail />
        </div>

        <div className="mt-8">
          <SocialLinks iconSize={20} />
        </div>
      </Reveal>
    </section>
  );
}
