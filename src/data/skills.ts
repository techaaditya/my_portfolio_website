/**
 * Honest, grouped skill set. No progress bars, no percentages, no carousels —
 * those imply false precision. Just quiet typographic groups.
 * Confirmed final list (PORTFOLIO_REBUILD_PROMPT.md §6).
 */

export interface SkillGroup {
  readonly label: string;
  readonly items: readonly string[];
}

export const skillGroups: readonly SkillGroup[] = [
  {
    label: 'Core',
    items: ['Python', 'JavaScript / TypeScript', 'SQL'],
  },
  {
    label: 'Data / ML',
    items: ['Pandas', 'NumPy', 'scikit-learn', 'PyTorch', 'Matplotlib / Seaborn'],
  },
  {
    label: 'Web',
    items: ['React', 'Node.js', 'Tailwind'],
  },
  {
    label: 'Tools',
    items: ['Git', 'Docker', 'Linux'],
  },
] as const;
