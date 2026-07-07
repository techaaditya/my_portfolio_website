/**
 * Verifies every external URL in the data files actually resolves.
 * Run with `npm run verify:links`. Exits non-zero if any link is dead,
 * so it can gate a build. Never ship a dead link (§3, §6).
 */
import { site } from '../src/data/site.ts';
import { projects } from '../src/data/projects.ts';
import { posts, allPostsUrl } from '../src/data/writing.ts';

interface Target {
  readonly label: string;
  readonly url: string;
}

const targets: Target[] = [
  ...site.socials.map((s) => ({ label: `social:${s.id}`, url: s.url })),
  ...projects.flatMap((p) => {
    const t: Target[] = [];
    if (p.liveUrl) t.push({ label: `project:${p.slug}:live`, url: p.liveUrl });
    if (p.repoUrl) t.push({ label: `project:${p.slug}:repo`, url: p.repoUrl });
    return t;
  }),
  ...posts.map((p) => ({ label: `post:${p.title}`, url: p.url })),
  { label: 'writing:all', url: allPostsUrl },
];

type Verdict = 'ok' | 'warn' | 'dead';

/** Hosts that reliably return bot-block statuses to automated requests but
 * are fine in a real browser. A block is a soft warning, not a dead link. */
const BOT_BLOCK_STATUSES = new Set([403, 429, 999]);

async function check(t: Target): Promise<{ t: Target; verdict: Verdict; status: number | string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    // Try HEAD first; some hosts reject it, so fall back to GET.
    let res = await fetch(t.url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    });
    if (res.status === 405 || res.status >= 500) {
      res = await fetch(t.url, { method: 'GET', redirect: 'follow', signal: controller.signal });
    }
    if (res.ok) return { t, verdict: 'ok', status: res.status };
    if (BOT_BLOCK_STATUSES.has(res.status)) return { t, verdict: 'warn', status: res.status };
    return { t, verdict: 'dead', status: res.status };
  } catch (err) {
    // Connection refused / timeout / DNS failure => genuinely unreachable.
    return { t, verdict: 'dead', status: err instanceof Error ? err.name : 'error' };
  } finally {
    clearTimeout(timeout);
  }
}

const results = await Promise.all(targets.map(check));
let dead = 0;
let warn = 0;
for (const r of results) {
  const mark = r.verdict === 'ok' ? 'OK  ' : r.verdict === 'warn' ? 'WARN' : 'DEAD';
  if (r.verdict === 'dead') dead++;
  if (r.verdict === 'warn') warn++;
  console.log(`${mark} [${String(r.status).padEnd(9)}] ${r.t.label} -> ${r.t.url}`);
}

console.log(
  `\n${results.length - dead - warn}/${results.length} OK, ${warn} bot-blocked (verify manually in a browser), ${dead} dead.`,
);
if (dead > 0) {
  console.error(`\n${dead} dead link(s). Fix or flag before shipping.`);
  process.exit(1);
}
