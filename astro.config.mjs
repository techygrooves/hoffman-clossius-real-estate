// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { site } from './src/config/site.ts';

/**
 * Hoffman & Closius — Astro configuration.
 *
 * Static-first: every route is pre-rendered to HTML at build time so `dist/`
 * can be dropped on any static host. `npm run build:portable` additionally
 * rewrites absolute asset/page URLs to relative ones so `dist/index.html`
 * opens directly from the filesystem.
 *
 * NOTE: `site.url` is an UNCONFIRMED placeholder domain. See CONTENT_PENDING.md.
 * Canonical + og:url tags are suppressed until `site.urlConfirmed` is true.
 */
export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  image: {
    // Keeps the build dependency-light; swap in sharp when real photography lands.
    responsiveStyles: true,
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !['/login/', '/register/'].some((p) => new URL(page).pathname === p),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
