/**
 * Browser checks for the Keyes logo slots.
 *
 * ── Why this is in the repository ─────────────────────────────────────────
 * The ® on the wordmark has now been corrected twice by the client, both
 * times because they looked at the live site. The suite that should have
 * caught it existed only in a scratch directory and was wiped between
 * sessions, so it caught neither. A check that does not survive is not a
 * check.
 *
 * ── Why it is NOT part of `npm run build` ─────────────────────────────────
 * It needs Playwright and a real browser, which the build deliberately does
 * not depend on. `tests/*.test.mjs` (the mortgage maths) runs in the build
 * because it is pure Node; this lives one directory down so that glob does
 * not pick it up. Run it with `npm run test:browser` after a build.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';

const DIST = resolve(import.meta.dirname, '../../dist');

/* Playwright is not a project dependency — find it wherever it is installed. */
async function loadChromium() {
  const candidates = [
    process.env.PLAYWRIGHT_MODULE,
    'playwright',
    'playwright-core',
    '/opt/node22/lib/node_modules/playwright/index.mjs',
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      return (await import(c)).chromium;
    } catch {
      /* try the next one */
    }
  }
  return null;
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.json': 'application/json',
};

/** Serves `dist/` on an ephemeral port, so the suite is one command. */
function serve() {
  const server = createServer(async (req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let path = join(DIST, url);
    try {
      if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    } catch {
      res.writeHead(404).end('not found');
      return;
    }
    try {
      const body = await readFile(path);
      res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((ok) => {
    server.listen(0, '127.0.0.1', () => ok({ server, port: server.address().port }));
  });
}

let pass = 0;
let fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

const chromium = await loadChromium();
if (!chromium) {
  console.error(
    'Playwright not found. These are browser checks, so they need it:\n' +
      '  npm i -D playwright && npx playwright install chromium\n' +
      'Or point PLAYWRIGHT_MODULE at an existing install.',
  );
  process.exit(1);
}

try {
  await stat(join(DIST, 'index.html'));
} catch {
  console.error('No dist/index.html — run `npm run build` first.');
  process.exit(1);
}

const { server, port } = await serve();
const BASE = `http://127.0.0.1:${port}`;
const browser = await chromium.launch();

/**
 * Reads the two halves of every wordmark instance.
 *
 * The structure is deliberate and the selectors depend on it: the outer
 * `[data-keyes-wordmark]` holds one baseline-aligned row, and that row holds
 * the name and then the ®.
 */
const READ_MARKS = () => {
  const rows = [];
  for (const el of document.querySelectorAll('[data-keyes-wordmark]')) {
    const row = el.firstElementChild;
    const word = row && row.firstElementChild;
    const mark = row && row.lastElementChild;
    if (!word || !mark || word === mark) {
      rows.push({ broken: true });
      continue;
    }
    const w = word.getBoundingClientRect();
    const m = mark.getBoundingClientRect();
    if (w.height === 0) continue;
    rows.push({
      word: word.textContent.trim(),
      mark: mark.textContent.trim(),
      /* Vertical centre of the ® within the name's box. 0 = top, 1 = bottom. */
      centreFrac: ((m.top + m.bottom) / 2 - w.top) / w.height,
      sizeRatio: m.height / w.height,
      color: getComputedStyle(word).color,
      inFooter: !!el.closest('footer'),
    });
  }
  return rows;
};

console.log('\n── Keyes wordmark ──');
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  ok('no page errors', errors.length === 0, errors.join(' | '));

  const slots = await page.locator('[data-keyes-wordmark]').count();
  ok('wordmark fills every logo slot', slots >= 4, `${slots} found`);
  ok(
    'the old dashed placeholder is gone',
    (await page.locator('[data-pending-asset="keyes-logo"]').count()) === 0,
  );

  const named = await page.locator('[data-keyes-wordmark][role=img]').count();
  const hidden = await page.locator('[data-keyes-wordmark][aria-hidden=true]').count();
  ok('named instances expose "Keyes" to assistive tech', named >= 3, `${named}`);
  ok('decorative instances are hidden from it', hidden >= 1, `${hidden}`);
  ok(
    'accessible name is exactly "Keyes"',
    (await page.getAttribute('[data-keyes-wordmark][role=img]', 'aria-label')) === 'Keyes',
  );

  /* The standing brand rule: the logo is shown, never explained. */
  const body = await page.evaluate(() => document.body.innerText);
  ok(
    'no Keyes relationship wording',
    !/affiliated with Keyes|backed by Keyes|working under Keyes|part of Keyes|proudly affiliated|in partnership with Keyes/i.test(
      body,
    ),
  );
  ok('wordmark does not leak into page prose', !/\bKeyes\s*®\s*[a-z]/.test(body));

  const marks = await page.evaluate(READ_MARKS);
  ok('every instance has both the name and the ®', marks.length > 0 && !marks.some((m) => m.broken));
  ok(
    'the name reads "Keyes"',
    marks.every((m) => m.word === 'Keyes'),
  );

  /*
   * THE REGRESSION THIS FILE EXISTS FOR.
   *
   * On the real mark the ® is a small circled R sitting by the foot of the
   * "s". Raised as a superscript it reads as a footnote, which is what the
   * client corrected on 2026-09-27. Baseline-aligned it measures ~0.66-0.75
   * down the name's box; superscripted it measured ~0.1.
   */
  const raised = marks.filter((m) => m.centreFrac <= 0.55);
  ok(
    '® sits by the foot of the "s", not raised above the cap line',
    raised.length === 0,
    raised.map((m) => m.centreFrac.toFixed(2)).join(', '),
  );

  /* And it stays a mark rather than growing into a character. */
  const oversized = marks.filter((m) => m.sizeRatio > 0.5);
  ok(
    '® stays small relative to the name',
    oversized.length === 0,
    oversized.map((m) => m.sizeRatio.toFixed(2)).join(', '),
  );

  const footer = marks.filter((m) => m.inFooter);
  const header = marks.filter((m) => !m.inFooter);
  ok(
    'footer instance renders reversed (white)',
    footer.length > 0 && footer.every((m) => /255,\s*255,\s*255/.test(m.color)),
    JSON.stringify(footer.map((m) => m.color)),
  );
  ok(
    'header instances render in evergreen',
    header.length > 0 && header.every((m) => !/255,\s*255,\s*255/.test(m.color)),
    JSON.stringify(header.map((m) => m.color)),
  );
  await page.close();
}

console.log('\n── The real asset still wins ──');
{
  const page = await browser.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const assets = await page.locator('img[src^="/brand/"]').count();
  const fallbacks = await page.locator('[data-keyes-wordmark]').count();
  /*
   * Exactly one of the two is showing. Today that is the fallback; once
   * `public/brand/keyes-logo.svg` exists this flips with no code change, and
   * this check keeps passing rather than needing to be edited.
   */
  ok(
    'a Keyes mark is present, from either the asset or the fallback',
    assets > 0 || fallbacks > 0,
  );
  ok(
    'the two do not render at the same time',
    assets === 0 || fallbacks === 0,
    `${assets} asset, ${fallbacks} fallback`,
  );
  await page.close();
}

console.log('\n── Every page carries it ──');
{
  const page = await browser.newPage();
  const paths = ['/', '/about/', '/contact/', '/faq/', '/mortgage-calculator/', '/properties/search/'];
  for (const path of paths) {
    const res = await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    const found =
      (await page.locator('[data-keyes-wordmark]').count()) +
      (await page.locator('img[src^="/brand/"]').count());
    ok(`${path} carries the Keyes mark`, res?.status() === 200 && found > 0, `${found}`);
  }
  await page.close();
}

console.log('\n── Mobile ──');
for (const path of ['/', '/about/', '/contact/']) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
  if (!res || res.status() !== 200) {
    await page.close();
    continue;
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  ok(`${path} no horizontal overflow at 390px`, overflow <= 0, `${overflow}px`);
  const clipped = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('[data-keyes-wordmark]')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > document.documentElement.clientWidth + 1 || r.left < -1) {
        bad.push(`${Math.round(r.left)}..${Math.round(r.right)}`);
      }
    }
    return bad;
  });
  ok(`${path} wordmark sits inside the viewport`, clipped.length === 0, clipped.join(', '));
  await page.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
await browser.close();
server.close();
process.exit(fail === 0 ? 0 : 1);
