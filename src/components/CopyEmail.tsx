import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { site } from '@/data/site';

/** Copy-email-to-clipboard button with a transient "Copied" confirmation. */
export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the mailto link beside it still works.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Email copied to clipboard' : `Copy email address ${site.email}`}
      className="inline-flex items-center gap-2 rounded-md border border-[color:var(--line)] px-3 py-2 text-sm text-mist transition-colors hover:border-signal/50 hover:text-signal"
    >
      {copied ? <Check size={15} className="text-signal" /> : <Copy size={15} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
