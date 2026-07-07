import { site } from '@/data/site';
import { SocialIcon } from './icons';
import { cn } from '@/lib/cn';

/** Icon links to GitHub / LinkedIn / X / blog, each with an accessible label. */
export function SocialLinks({ className, iconSize = 18 }: { className?: string; iconSize?: number }) {
  return (
    <ul className={cn('flex items-center gap-1', className)}>
      {site.socials.map((s) => (
        <li key={s.id}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.label}${s.handle ? ` (${s.handle})` : ''}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-mist transition-colors hover:text-signal focus-visible:text-signal"
          >
            <SocialIcon id={s.id} size={iconSize} />
          </a>
        </li>
      ))}
    </ul>
  );
}
