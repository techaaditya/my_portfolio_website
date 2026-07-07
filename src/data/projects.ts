/**
 * Real projects only — replaces every fabricated card on the old site.
 * Team efforts are credited honestly. `year` + `discipline` power the
 * nithin-style project labels. Every `liveUrl`/`repoUrl` is checked by
 * `npm run verify:links` before shipping.
 */

export interface Project {
  readonly slug: string;
  readonly title: string;
  /** 2–3 sentence description: what it does + Aaditya's role. */
  readonly description: string;
  /** Year label shown in the index (nithin "year + discipline" treatment). */
  readonly year: string;
  /** Discipline label, e.g. "Web platform" / "Event site". */
  readonly discipline: string;
  readonly stack: readonly string[];
  readonly liveUrl?: string;
  readonly repoUrl?: string;
  /** Honest collaboration credit, e.g. "Built with the team at …". */
  readonly credit?: string;
  /** Featured = the large asymmetric hero-of-projects slot. */
  readonly featured?: boolean;
  /** For in-progress work: shows a "currently building" state, may lack a link. */
  readonly status?: 'live' | 'building';
}

export const projects: readonly Project[] = [
  {
    slug: 'kumun',
    title: 'KUMUN — Kathmandu University Model United Nations',
    description:
      "Official event website for KU's Model UN — schedules, committee pages, and delegate registration. I built and maintain the site as part of the organizing team, translating a large multi-day event into clear, navigable pages.",
    year: '2025',
    discipline: 'Event platform',
    stack: ['React', 'TypeScript', 'Tailwind'],
    liveUrl: 'https://kumun.ku.edu.np/',
    credit: 'Built with the KUMUN organizing team at Kathmandu University',
    featured: true,
    status: 'live',
  },
  {
    slug: 'damek-studios',
    title: 'Damek Studios',
    description:
      'Marketing and studio site for a Nepal-based game development studio, presenting their team, projects, and contact. I worked on the front-end build and layout.',
    year: '2025',
    discipline: 'Studio site',
    stack: ['React', 'Tailwind'],
    liveUrl: 'https://damekstudios.com/',
    credit: 'Built with the team at Damek Studios',
    status: 'live',
  },
  {
    slug: 'dodolr',
    title: 'Dodolr',
    description:
      'A task, notes, and follow-up tracker for individuals and small teams — capture work, keep track of what needs a follow-up, and stay on top of loose ends. I contributed to the product web build.',
    year: '2025',
    discipline: 'Productivity web app',
    stack: ['React', 'TypeScript', 'Node.js'],
    liveUrl: 'https://www.dodolr.com/',
    credit: 'Built with a small product team',
    status: 'live',
  },
  {
    slug: 'tinkune',
    title: 'Tinkune',
    description:
      'A platform connecting Nepalese businesses worldwide, including job listings. I worked on the web front-end, building out the listings and directory experience.',
    year: '2025',
    discipline: 'Web platform',
    stack: ['React', 'Node.js', 'Tailwind'],
    liveUrl: 'https://www.tinkune.com/',
    credit: 'Built with a product team',
    status: 'live',
  },
  {
    slug: 'jyotirvidhya',
    title: 'Jyotirvidhya',
    description:
      'A Vedic astrology consultation platform with service listings and appointment booking. I contributed to the front-end build and the booking flow.',
    year: '2024',
    discipline: 'Booking platform',
    stack: ['React', 'Tailwind'],
    liveUrl: 'https://jyotirvidhya.com/',
    credit: 'Built with a product team',
    status: 'live',
  },
  {
    slug: 'global-youth-hackathon-2026',
    title: 'Global Youth Hackathon 2026',
    description:
      'The official event website for the Global Youth Hackathon 2026 — registration, schedule, and event information. Currently building it with the team ahead of the event.',
    year: '2026',
    discipline: 'Event site',
    stack: ['React', 'TypeScript', 'Tailwind'],
    credit: 'Building with the Global Youth Hackathon team',
    status: 'building',
  },
] as const;

export const featuredProject = projects.find((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
