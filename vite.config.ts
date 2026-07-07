import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

/**
 * Preload the fonts used above the fold (the LCP serif name + body/mono) so
 * they're fetched in parallel with the CSS instead of discovered after it —
 * removes the font-swap flash and steadies LCP.
 */
function preloadCriticalFonts(): Plugin {
  // Only the faces that paint the hero (LCP paragraph = sans, name = serif
  // both styles). Mono is small readout labels — it can swap in late rather
  // than compete with the LCP font for bandwidth.
  const critical = [
    /instrument-serif-latin-400-normal.*\.woff2$/,
    /instrument-serif-latin-400-italic.*\.woff2$/, // hero "Sapkota" is italic
    /geist-sans-latin-400-normal.*\.woff2$/,
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadCriticalFonts()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
