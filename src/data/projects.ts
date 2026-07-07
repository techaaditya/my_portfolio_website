/**
 * Real projects only — curated from Aaditya's own GitHub (github.com/TechAaditya)
 * plus verified live work. Descriptions are grounded in each repo's README, not
 * invented. `year` + `discipline` power the nithin-style project labels.
 * Every liveUrl/repoUrl is checked by `npm run verify:links` before shipping.
 *
 * Curation over accumulation: a focused set that foregrounds the data/ML
 * identity, bookended by two real event platforms. Aaditya can add more from
 * his repos later (e.g. EcoFarma, KrishiBot, Nepali-News-Analytics).
 */

export interface Project {
  readonly slug: string;
  readonly title: string;
  /** 2–3 sentence description: what it does + Aaditya's role, grounded in the README. */
  readonly description: string;
  /** Year label shown in the index (nithin "year + discipline" treatment). */
  readonly year: string;
  /** Discipline label, e.g. "Data platform" / "Event site". */
  readonly discipline: string;
  readonly stack: readonly string[];
  readonly liveUrl?: string;
  readonly repoUrl?: string;
  /** Honest collaboration/context credit, e.g. "Built for … hackathon". */
  readonly credit?: string;
  /** Featured = the large asymmetric hero-of-projects slot. */
  readonly featured?: boolean;
  /** Lifecycle: shows a "currently building" state, may lack a live link. */
  readonly status?: 'live' | 'building';
  /** True if the live URL is known-unreachable and must not render as a link yet. */
  readonly liveUnverified?: boolean;
}

export const projects: readonly Project[] = [
  {
    slug: 'kumun',
    title: 'KUMUN — Kathmandu University Model United Nations',
    description:
      "The official website for KU's Model United Nations 2025 — committees, schedule, and delegate information. I built and maintain the site as part of the organizing team, turning a large multi-day event into clear, navigable pages.",
    year: '2025',
    discipline: 'Event platform',
    stack: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://kumun.ku.edu.np/',
    repoUrl: 'https://github.com/TechAaditya/KUMUN2025_Website',
    credit: 'Built with the KUMUN organizing team at Kathmandu University',
    featured: true,
    status: 'live',
  },
  {
    slug: 'knowlify',
    title: 'Knowlify — Adaptive Cognitive Learning System',
    description:
      'An AI-powered adaptive learning platform that turns raw educational documents into interactive knowledge graphs, tracks student mastery in real time with Bayesian Knowledge Tracing, and generates personalised study experiences. Built around five AI engines behind a FastAPI backend and a React frontend.',
    year: '2025',
    discipline: 'AI learning platform',
    stack: ['Python', 'FastAPI', 'React', 'TypeScript'],
    repoUrl: 'https://github.com/TechAaditya/Knowlify',
    status: 'live',
  },
  {
    slug: 'resolveiq',
    title: 'ResolveIQ — Claims Intake & Resolution Agent',
    description:
      'Takes an insurance claim in any messy form — scanned PDF, phone photo, voice memo, plain email — structures it, and makes a deterministic auto-approve / flag / reject decision by cross-checking coding and protocol compliance against an API and an explainable knowledge graph. AI (Qwen) only reads and structures the input; the decision itself is inspectable code, never a model guess.',
    year: '2026',
    discipline: 'Agentic AI',
    stack: ['Python', 'TypeScript', 'Knowledge graph', 'LLM'],
    repoUrl: 'https://github.com/TechAaditya/ResolveIQ',
    credit: 'Built for the Global AI Hackathon Series',
    status: 'live',
  },
  {
    slug: 'intelliflow',
    title: 'IntelliFlow — Unified Intelligent Data Platform',
    description:
      'Consolidates separate data-science workflows into one system: a shared ingestion layer feeding pluggable engines behind a single API gateway and dashboard. The AutoML engine handles preprocessing, hyperparameter optimisation with Optuna, experiment tracking with MLflow, and model deployment; analytics and agent-orchestration engines are in progress.',
    year: '2026',
    discipline: 'ML platform',
    stack: ['Python', 'Optuna', 'MLflow'],
    repoUrl: 'https://github.com/TechAaditya/IntelliFlow',
    status: 'live',
  },
  {
    slug: 'trekverse',
    title: 'TrekVerse — Trek Recommendation & Analytics',
    description:
      'A recommendation and analytics system built on the Nepal Trekking Dataset. It lets beginners and seasoned hikers weigh multiple preferences at once — difficulty, duration, elevation gain, cost, and season — to find treks that fit, instead of relying on informal word-of-mouth suggestions.',
    year: '2025',
    discipline: 'Data science',
    stack: ['Python', 'Jupyter', 'pandas'],
    repoUrl: 'https://github.com/TechAaditya/TrekVerse',
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
    // Server currently unreachable (see docs/DECISIONS.md) — flagged, not linked
    // as live until confirmed. Kept at Aaditya's request ("leave for now").
    liveUnverified: true,
    status: 'live',
  },
  {
    slug: 'global-youth-hackathon-2026',
    title: 'Global Youth Hackathon 2026',
    description:
      'The official event website for the Global Youth Hackathon 2026, organised by the Bagmati UNESCO Club — registration, schedule, and event information. Currently building it with the team ahead of the event.',
    year: '2026',
    discipline: 'Event site',
    stack: ['HTML', 'CSS', 'JavaScript'],
    repoUrl: 'https://github.com/TechAaditya/GlobalYouthHackathon2026',
    credit: 'Building with the Global Youth Hackathon team',
    status: 'building',
  },
] as const;

export const featuredProject = projects.find((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
