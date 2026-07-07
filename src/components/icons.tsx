import { Github, Linkedin, PenLine } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { SocialLink } from '@/data/site';

/** X (Twitter) has no lucide brand glyph — inline the current mark. */
function XMark(props: LucideProps) {
  const { size = 24, className, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.968 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

const map: Record<SocialLink['id'], (p: LucideProps) => React.ReactNode> = {
  github: (p) => <Github {...p} />,
  linkedin: (p) => <Linkedin {...p} />,
  x: (p) => <XMark {...p} />,
  blog: (p) => <PenLine {...p} />,
};

export function SocialIcon({ id, ...props }: { id: SocialLink['id'] } & LucideProps) {
  return map[id](props);
}
