/**
 * Site-wide identity, contact, and social links.
 * Single source of truth — no identity/contact content is hardcoded in JSX.
 * Every URL here is checked by `npm run verify:links`.
 */

export interface SocialLink {
  /** Machine key, also used to pick the lucide icon. */
  readonly id: 'github' | 'linkedin' | 'x' | 'blog';
  /** Human label for aria-label / visible text. */
  readonly label: string;
  readonly url: string;
  /** Handle shown in UI where useful (e.g. @aadityabro1). */
  readonly handle?: string;
}

export interface SiteConfig {
  readonly name: string;
  readonly roleLine: string;
  readonly location: string;
  readonly locationDetail: string;
  readonly email: string;
  readonly url: string;
  readonly resumePath: string;
  readonly socials: readonly SocialLink[];
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly ogImage: string;
  };
}

export const site: SiteConfig = {
  name: 'Aaditya Sapkota',
  // Confirmed role line — honest, non-inflated. Never "Research Scientist".
  roleLine: 'Data science & ML — building toward research',
  location: 'Kathmandu, Nepal',
  locationDetail: 'Kathmandu University',
  email: 'sayhi.aaditya@gmail.com',
  url: 'https://www.aadityasapkota.com.np/',
  // Graceful fallback: UI hides/disables the resume button if this 404s.
  resumePath: '/resume.pdf',
  socials: [
    {
      id: 'github',
      label: 'GitHub',
      url: 'https://github.com/TechAaditya',
      handle: 'TechAaditya',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/aadityasapkota/',
      handle: 'aadityasapkota',
    },
    {
      id: 'x',
      label: 'X',
      url: 'https://x.com/aadityabro1',
      handle: '@aadityabro1',
    },
    {
      id: 'blog',
      label: 'Blog',
      url: 'https://aadityasapkota.blogspot.com/',
    },
  ],
  seo: {
    title: 'Aaditya Sapkota — Data science & ML',
    description:
      'Aaditya Sapkota — Kathmandu University student in data science & machine learning, building toward research and shipping real web products with a team.',
    ogImage: '/og-image.png',
  },
} as const;
