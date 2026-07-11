import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { execSync } from 'node:child_process';

/**
 * Preload the fonts used above the fold (the LCP serif name + body/mono) so
 * they're fetched in parallel with the CSS instead of discovered after it —
 * removes the font-swap flash and steadies LCP.
 */
function preloadCriticalFonts(): Plugin {
  // The faces that paint above the fold: the 600-weight grotesque renders
  // the giant hero name (its late swap was the page's only layout shift),
  // 400 renders body copy, and mono renders every HUD readout.
  const critical = [
    /geist-sans-latin-600-normal.*\.woff2$/,
    /geist-sans-latin-400-normal.*\.woff2$/,
    /geist-mono-latin-400-normal.*\.woff2$/,
  ];
  return {
    name: 'preload-critical-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const files = Object.keys(ctx.bundle ?? {});
        const hrefs = files.filter((f) => critical.some((re) => re.test(f)));
        return {
          html,
          tags: hrefs.map((href) => ({
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              href: `/${href}`,
              crossorigin: '',
            },
            injectTo: 'head-prepend' as const,
          })),
        };
      },
    },
  };
}

// Real build telemetry for the dashboard — git hash + date, injected at
// build time. Falls back gracefully outside a git checkout (e.g. CI cache).
function buildInfo(): { hash: string; date: string } {
  let hash = 'dev';
  try {
    hash = execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    /* not a git checkout */
  }
  return { hash, date: new Date().toISOString().slice(0, 10) };
}

// https://vite.dev/config/
export default defineConfig(() => {
  const info = buildInfo();
  return {
    plugins: [react(), tailwindcss(), preloadCriticalFonts()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __BUILD_HASH__: JSON.stringify(info.hash),
      __BUILD_DATE__: JSON.stringify(info.date),
    },
    build: {
      // ship source maps: only fetched by devtools, and the three.js chunk is
      // large enough that Lighthouse requires one for best-practices
      sourcemap: true,
    },
  };
});
