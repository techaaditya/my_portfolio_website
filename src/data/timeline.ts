/**
 * The Journey timeline — verifiable milestones only, each grounded in a real
 * repo, site, or event Aaditya was part of. Edit this file to add more
 * (enrollment, awards, launches); the Journey section renders whatever is
 * here in order.
 */

export interface Milestone {
  readonly year: string;
  readonly title: string;
  readonly detail: string;
  readonly tag: string;
  readonly status?: 'building';
}

export const timeline: readonly Milestone[] = [
  {
    year: '2022',
    title: 'First words published',
    detail:
      'Started writing publicly — the first essay on aadityasapkota.blogspot.com. The habit of shipping thoughts predates the habit of shipping code.',
    tag: 'WRITING',
  },
  {
    year: '2025',
    title: 'KUMUN 2025 — official platform',
    detail:
      'Built and maintained the official website for Kathmandu University Model United Nations with the organizing team — committees, schedule, and delegate information for a multi-day event.',
    tag: 'EVENT PLATFORM',
  },
  {
    year: '2025',
    title: 'KU Hackfest 2025 — KrishiBot',
    detail:
      'Team-built a farmer-centric platform: crop risk analysis, deep-learning disease detection, soil prediction, and a voice AI assistant on NARC soil + Open-Meteo weather data.',
    tag: 'HACKATHON',
  },
  {
    year: '2026',
    title: 'Global AI Hackathon — ResolveIQ',
    detail:
      'Claims intake agent: structures messy documents with an LLM, then makes deterministic, explainable approve/flag/reject decisions — the model reads, inspectable code decides.',
    tag: 'HACKATHON',
  },
  {
    year: '2026',
    title: 'Global Youth Hackathon 2026',
    detail:
      'Building the official event website with the Bagmati UNESCO Club team — registration, schedule, and event information, ahead of the event.',
    tag: 'EVENT SITE',
    status: 'building',
  },
] as const;
