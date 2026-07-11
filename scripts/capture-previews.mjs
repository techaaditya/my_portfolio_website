/**
 * Generates the Work Matrix hover previews into public/previews/:
 *  - live sites (verified) get a REAL screenshot;
 *  - repo-only projects get a "telemetry card" rendered from their real
 *    metadata (title, year, discipline, stack) — no fabricated product shots.
 *
 * Run: node scripts/capture-previews.mjs   (needs local Chrome; override with CHROME_PATH)
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = resolve('public/previews');
mkdirSync(OUT, { recursive: true });

// kept in sync with src/data/projects.ts (import of TS from .mjs isn't worth
// a build step for a one-shot tool; verify:links guards the URLs anyway)
const projects = [
  { slug: 'kumun', title: 'KUMUN', year: '2025', discipline: 'EVENT PLATFORM', stack: ['HTML', 'CSS', 'JavaScript'], liveUrl: 'https://kumun.ku.edu.np/' },
  { slug: 'knowlify', title: 'KNOWLIFY', year: '2025', discipline: 'AI LEARNING PLATFORM', stack: ['Python', 'FastAPI', 'React', 'TypeScript'] },
  { slug: 'resolveiq', title: 'RESOLVEIQ', year: '2026', discipline: 'AGENTIC AI', stack: ['Python', 'TypeScript', 'Knowledge graph', 'LLM'] },
  { slug: 'intelliflow', title: 'INTELLIFLOW', year: '2026', discipline: 'ML PLATFORM', stack: ['Python', 'Optuna', 'MLflow'] },
  { slug: 'trekverse', title: 'TREKVERSE', year: '2025', discipline: 'DATA SCIENCE', stack: ['Python', 'Jupyter', 'pandas'] },
  { slug: 'ecofarma', title: 'ECOFARMA', year: '2025', discipline: 'DATA SCIENCE', stack: ['Python', 'Jupyter', 'JavaScript'] },
  { slug: 'krishibot', title: 'KRISHIBOT', year: '2025', discipline: 'AI + AGRICULTURE', stack: ['TypeScript', 'Python', 'Next.js', 'FastAPI'] },
  { slug: 'nepali-news-analytics', title: 'NEPALI NEWS ANALYTICS', year: '2025', discipline: 'DATA SCIENCE', stack: ['R', 'Python', 'R Markdown'] },
  { slug: 'global-youth-hackathon-2026', title: 'GYH 2026', year: '2026', discipline: 'EVENT SITE', stack: ['HTML', 'CSS', 'JavaScript'], building: true },
];

const card = (p) => `<!doctype html><html><head><style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 640px; height: 400px; background: #020408; color: #f3f4f6;
    font-family: 'Segoe UI', system-ui, sans-serif; padding: 36px;
    display: flex; flex-direction: column; justify-content: space-between;
    background-image:
      linear-gradient(to right, rgba(255,255,255,.07) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,.07) 1px, transparent 1px);
    background-size: 40px 40px;
    border: 1px solid rgba(255,255,255,.16);
  }
  .mono { font-family: Consolas, monospace; font-size: 12px; letter-spacing: .18em; color: #9aa3af; }
  .cyan { color: #00f0ff; }
  h1 { font-size: 44px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
  .chips { display: flex; gap: 8px; flex-wrap: wrap; }
  .chip { border: 1px solid rgba(255,255,255,.16); padding: 5px 12px; font-family: Consolas, monospace; font-size: 11px; letter-spacing: .1em; color: #9aa3af; }
  .row { display: flex; justify-content: space-between; align-items: center; }
</style></head><body>
  <div class="row mono"><span class="cyan">▸ ${p.discipline}</span><span>${p.year}</span></div>
  <div>
    <h1>${p.title}${p.building ? ' <span class="cyan" style="font-size:18px;vertical-align:middle">[BUILDING]</span>' : ''}</h1>
    <p class="mono" style="margin-top:14px">SOURCE · github.com/TechAaditya</p>
  </div>
  <div class="chips">${p.stack.map((s) => `<span class="chip">${s}</span>`).join('')}</div>
</body></html>`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'],
});
const page = await browser.newPage();
await page.setViewport({ width: 640, height: 400, deviceScaleFactor: 2 });

for (const p of projects) {
  const out = `${OUT}/${p.slug}.png`;
  if (p.liveUrl) {
    try {
      await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
      await page.goto(p.liveUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 1200));
      await page.screenshot({ path: out });
      console.log('live  ', p.slug);
      await page.setViewport({ width: 640, height: 400, deviceScaleFactor: 2 });
      continue;
    } catch (e) {
      console.warn('live capture failed, falling back to card:', p.slug, e.message);
      await page.setViewport({ width: 640, height: 400, deviceScaleFactor: 2 });
    }
  }
  await page.setContent(card(p), { waitUntil: 'load' });
  await page.screenshot({ path: out });
  console.log('card  ', p.slug);
}

await browser.close();
console.log('done →', OUT);
