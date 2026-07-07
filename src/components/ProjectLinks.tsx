import { ArrowUpRight, Github } from 'lucide-react';
import type { Project } from '@/data/projects';
import { cn } from '@/lib/cn';

/** Renders the appropriate links/tags for a project's lifecycle + link health. */
export function ProjectLinks({ project, className }: { project: Project; className?: string }) {
  const showLive = project.liveUrl && !project.liveUnverified;

  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-2', className)}>
      {project.status === 'building' && (
        <span className="readout inline-flex items-center gap-1.5 text-ember">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />
          Building
        </span>
      )}

      {project.liveUrl && project.liveUnverified && (
        <span className="readout text-mist/70" title="Live site is currently unreachable">
          Site offline
        </span>
      )}

      {showLive && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} — live site`}
          className="group inline-flex items-center gap-1 text-sm text-foam transition-colors hover:text-signal"
        >
          Live
          <ArrowUpRight
            size={15}
            className="text-signal transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      )}

      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} — source on GitHub`}
          className="inline-flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-signal"
        >
          <Github size={15} />
          Code
        </a>
      )}
    </div>
  );
}
