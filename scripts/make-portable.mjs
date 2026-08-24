/**
 * make-portable.mjs — post-build pass over dist/.
 *
 * Astro emits root-absolute URLs (/_astro/..., /about/). Those are correct for
 * a web server but break when dist/index.html is opened straight off the
 * filesystem. This rewrites them to document-relative paths so the built site
 * also runs by double-clicking dist/index.html.
 *
 * Run with: npm run build:portable
 * The plain `npm run build` output is left untouched for normal hosting.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'dist',
);

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
 * Turns an absolute site path into a relative one.
 * Directory routes gain an explicit index.html so file:// resolves them.
 */
function toRelative(target, prefix) {
  const [pathname, suffix = ''] = target.split(/(?=[?#])/);
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
    (_m, attr, quote, rest) => `${attr}=${quote}${toRelative(`/${rest}`, prefix)}${quote}`,
  );

  html = html.replace(SRCSET, (match, quote, value) => {
    if (!value.includes('/')) return match;
    const rewritten = value
      .split(',')
      .map((candidate) => {
        const trimmed = candidate.trim();
        if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return trimmed;
        const [url, ...descriptor] = trimmed.split(/\s+/);
        return [toRelative(url, prefix), ...descriptor].join(' ');
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
    (_m, quote, rest) => `url(${quote}${toRelative(`/${rest}`, prefix)}${quote})`,
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
    `make-portable: rewrote ${html.length} HTML and ${css.length} CSS files — dist/index.html now opens directly from disk.`,
  );
}

await main();
