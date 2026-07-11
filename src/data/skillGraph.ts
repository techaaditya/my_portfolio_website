import { projects } from './projects';
import { skillGroups } from './skills';

/**
 * Skill → projects mapping, derived from the real project stacks — the
 * sandbox side panel shows which shipped work actually used each tool.
 * Matching is name-based with a small alias table (e.g. the skills list says
 * "JavaScript / TypeScript" while stacks say "TypeScript").
 */

const ALIASES: Record<string, string[]> = {
  Python: ['python'],
  'JavaScript / TypeScript': ['javascript', 'typescript', 'js', 'ts'],
  SQL: ['sql'],
  Pandas: ['pandas'],
  NumPy: ['numpy'],
  'scikit-learn': ['scikit-learn', 'sklearn'],
  PyTorch: ['pytorch'],
  'Matplotlib / Seaborn': ['matplotlib', 'seaborn'],
  React: ['react', 'next.js'],
  'Node.js': ['node.js', 'node'],
  Tailwind: ['tailwind'],
  Git: ['git'],
  Docker: ['docker'],
  Linux: ['linux'],
};

export interface SkillNode {
  readonly name: string;
  readonly group: string;
  readonly projects: readonly { title: string; slug: string }[];
}

export const skillNodes: readonly SkillNode[] = skillGroups.flatMap((group) =>
  group.items.map((name) => {
    const aliases = ALIASES[name] ?? [name.toLowerCase()];
    const used = projects
      .filter((p) =>
        p.stack.some((s) => aliases.some((a) => s.toLowerCase().includes(a))),
      )
      .map((p) => ({ title: p.title.split('—')[0].trim(), slug: p.slug }));
    return { name, group: group.label, projects: used };
  }),
);
