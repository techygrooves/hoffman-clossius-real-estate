/**
 * verify-links.mjs — fails the build if any internal link is dead.
 *
 * Walks every built HTML file in dist/, collects every root-relative href,
 * and checks that a matching file exists. Also cross-checks the navigation
 * config, so a menu entry pointing at a route that was never created is
 * caught even if no page happens to render it.
 *
 * Run with: npm run verify:links   (after a build)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

async function collectHtml(dir, found = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await collectHtml(full, found);
    else if (entry.name.endsWith('.html')) found.push(full);
  }
  return found;
}

/** Maps a site path to the file that should serve it. */
function targetsFor(href) {
  const clean = href.split(/[?#]/)[0] ?? '/';
  const trimmed = clean.replace(/^\/+/, '');
  if (trimmed === '') return [path.join(DIST, 'index.html')];
  if (path.extname(trimmed)) return [path.join(DIST, trimmed)];
  return [
    path.join(DIST, trimmed.replace(/\/$/, ''), 'index.html'),
    path.join(DIST, `${trimmed.replace(/\/$/, '')}.html`),
  ];
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function resolves(href) {
  for (const target of targetsFor(href)) {
    if (await exists(target)) return true;
  }
  return false;
}

async function main() {
  if (!(await exists(DIST))) {
    console.error('dist/ not found — run `astro build` first.');
    process.exit(1);
  }

  const files = await collectHtml(DIST);
  /** @type {Map<string, Set<string>>} href -> pages that reference it */
  const refs = new Map();

  for (const file of files) {
    const html = await fs.readFile(file, 'utf8');
    const page = `/${path.relative(DIST, file)}`;
    for (const match of html.matchAll(/\bhref="(\/[^"]*)"/g)) {
      const href = match[1];
      if (href.startsWith('//')) continue;
      if (!refs.has(href)) refs.set(href, new Set());
      refs.get(href).add(page);
    }
  }

  // Every href declared in the navigation config, even if nothing renders it.
  //
  // This import must not be allowed to fail quietly. It did once: a path alias
  // added to navigation.ts made it unresolvable under plain Node, the catch
  // swallowed it, and the check reported "0 from the nav config" while still
  // exiting zero. A safety net that fails open is worse than no safety net.
  let allNavHrefs;
  try {
    ({ allNavHrefs } = await import(
      path.join(ROOT, 'src', 'config', 'navigation.ts')
    ));
  } catch (error) {
    console.error(
      'verify-links: could not import src/config/navigation.ts — the nav ' +
        'cross-check did not run.\n' +
        '  Usually a path alias (@data, @lib, …) in that file or something it ' +
        'imports at runtime.\n' +
        '  Use a relative import with an explicit .ts extension instead.\n',
      error,
    );
    process.exit(1);
  }

  if (typeof allNavHrefs !== 'function') {
    console.error('verify-links: navigation.ts no longer exports allNavHrefs().');
    process.exit(1);
  }

  const navHrefs = allNavHrefs();
  if (navHrefs.length === 0) {
    console.error('verify-links: allNavHrefs() returned nothing. That is never right.');
    process.exit(1);
  }
  for (const href of navHrefs) {
    if (!refs.has(href)) refs.set(href, new Set(['(navigation config)']));
  }

  const broken = [];
  for (const [href, pages] of [...refs].sort()) {
    if (!(await resolves(href))) broken.push({ href, pages: [...pages] });
  }

  console.log(
    `verify-links: ${files.length} pages, ${refs.size} distinct internal links, ${navHrefs.length} from the nav config.`,
  );

  if (broken.length > 0) {
    console.error(`\n✗ ${broken.length} dead link(s):\n`);
    for (const { href, pages } of broken) {
      console.error(`  ${href}`);
      console.error(`      referenced by: ${pages.slice(0, 4).join(', ')}${pages.length > 4 ? ` (+${pages.length - 4} more)` : ''}`);
    }
    process.exit(1);
  }

  /*
   * Orphans: a built page that nothing links to.
   *
   * A dead link is loud — someone clicks it. An orphan is silent: the page
   * builds, renders correctly and is in the sitemap, and no visitor ever
   * arrives because no page points at it. That is a link-graph defect the
   * existing check could not see, since it only walked links outward.
   *
   * Reported, not fatal. A page can be legitimately unlinked — the account
   * routes are deliberately kept out of the menus — so this is a prompt to
   * look, not a build failure.
   */
  const linked = new Set(
    [...refs.keys()].map((href) => {
      const clean = (href.split(/[?#]/)[0] ?? '/').replace(/\/+$/, '');
      return clean === '' ? '/' : `${clean}/`;
    }),
  );

  const orphans = [];
  for (const file of files) {
    const rel = path.relative(DIST, file);
    if (rel === '404.html') continue;
    const route = `/${rel.replace(/index\.html$/, '')}`;
    const normalised = route === '/' ? '/' : route;
    if (!linked.has(normalised)) orphans.push(normalised);
  }

  if (orphans.length > 0) {
    console.log(`\nℹ ${orphans.length} page(s) linked from nowhere:`);
    for (const route of orphans.sort()) console.log(`    ${route}`);
    console.log(
      '    Deliberate for the account routes; anything else wants a link from a real page.',
    );
  } else {
    console.log('✓ every built page is linked from somewhere.');
  }

  console.log('✓ every internal link resolves.');
}

await main();
