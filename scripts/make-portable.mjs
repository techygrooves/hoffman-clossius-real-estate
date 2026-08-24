/**
 * make-portable.mjs — post-build pass over dist/.
 *
 * Astro emits root-absolute URLs (/_astro/..., /about/), which are correct
 * only when the site sits at a domain root. Two other situations need
 * rewriting, and this script covers both:
 *
 *   node scripts/make-portable.mjs
 *       → document-relative URLs (./_astro/…, ../about/index.html).
 *         Works from any folder AND straight off the filesystem, so
 *         dist/index.html opens by double-clicking.
 *
 *   node scripts/make-portable.mjs --base=/my-repo
 *       → absolute URLs under a prefix (/my-repo/_astro/…, /my-repo/about/).
 *         For a site hosted at a known subpath, such as GitHub Pages project
 *         pages. Preferred there over relative URLs because 404.html is served
 *         for arbitrary depths, and relative asset paths would break under it.
 *
 * The plain `npm run build` output is left untouched for hosting at a root.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'dist',
);

/** `--base=/prefix` switches from relative rewriting to prefixed-absolute. */
const baseArg = process.argv.find((a) => a.startsWith('--base='));
const BASE = baseArg
  ? `/${baseArg.slice('--base='.length).replace(/^\/+|\/+$/g, '')}`.replace(/^\/$/, '')
  : null;

/** Recursively collect files with one of the given extensions. */
async function collect(dir, extensions, found = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collect(full, extensions, found);
    } else if (extensions.includes(path.extname(entry.name))) {
      found.push(full);
    }
  }
  return found;
}

/** "../../" for a file three levels deep, "" at the root. */
function prefixFor(file) {
  const depth = path.relative(DIST, path.dirname(file)).split(path.sep)
    .filter(Boolean).length;
  return depth === 0 ? './' : '../'.repeat(depth);
}

/**
 * Rewrites one absolute site path.
 *
 * In base mode it simply gains the prefix and keeps directory URLs intact —
 * a real web server resolves /about/ to /about/index.html on its own.
 * In relative mode directory routes gain an explicit index.html, because
 * file:// has no server to do that for it.
 */
function rewriteUrl(target, prefix) {
  const [pathname, suffix = ''] = target.split(/(?=[?#])/);

  if (BASE !== null) {
    return `${BASE}${pathname}${suffix}`;
  }

  let out = pathname.replace(/^\//, '');
  const isFile = path.extname(out) !== '';
  if (!isFile) {
    out = out === '' ? 'index.html' : `${out.replace(/\/$/, '')}/index.html`;
  }

  return `${prefix}${out}${suffix}`;
}

/** Matches href/src/action="/..." but never protocol-relative "//host". */
const HTML_ATTR = /\b(href|src|action|poster)=("|')\/(?!\/)([^"']*)\2/g;
const SRCSET = /\bsrcset=("|')([^"']*)\1/g;
const CSS_URL = /url\((["']?)\/(?!\/)([^"')]*)\1\)/g;

async function rewriteHtml(file) {
  const prefix = prefixFor(file);
  let html = await fs.readFile(file, 'utf8');

  html = html.replace(
    HTML_ATTR,
    (_m, attr, quote, rest) => `${attr}=${quote}${rewriteUrl(`/${rest}`, prefix)}${quote}`,
  );

  html = html.replace(SRCSET, (match, quote, value) => {
    if (!value.includes('/')) return match;
    const rewritten = value
      .split(',')
      .map((candidate) => {
        const trimmed = candidate.trim();
        if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return trimmed;
        const [url, ...descriptor] = trimmed.split(/\s+/);
        return [rewriteUrl(url, prefix), ...descriptor].join(' ');
      })
      .join(', ');
    return `srcset=${quote}${rewritten}${quote}`;
  });

  await fs.writeFile(file, html);
}

async function rewriteCss(file) {
  const prefix = prefixFor(file);
  const css = await fs.readFile(file, 'utf8');
  const next = css.replace(
    CSS_URL,
    (_m, quote, rest) => `url(${quote}${rewriteUrl(`/${rest}`, prefix)}${quote})`,
  );
  if (next !== css) await fs.writeFile(file, next);
}

async function main() {
  try {
    await fs.access(DIST);
  } catch {
    console.error('dist/ not found — run `astro build` first.');
    process.exitCode = 1;
    return;
  }

  const html = await collect(DIST, ['.html']);
  const css = await collect(DIST, ['.css']);

  await Promise.all(html.map(rewriteHtml));
  await Promise.all(css.map(rewriteCss));

  console.log(
    BASE !== null
      ? `make-portable: rewrote ${html.length} HTML and ${css.length} CSS files under the base path "${BASE}".`
      : `make-portable: rewrote ${html.length} HTML and ${css.length} CSS files — dist/index.html now opens directly from disk.`,
  );
}

await main();
