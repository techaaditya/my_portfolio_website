/** Tiny className joiner — drops falsy values. Keeps us off an extra dep. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
