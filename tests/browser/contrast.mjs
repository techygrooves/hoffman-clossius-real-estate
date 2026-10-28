/**
 * WCAG 2.2 AA contrast sweep over the built site.
 *
 * ── Why it is in the repository ───────────────────────────────────────────
 * This has now been rebuilt from scratch three times because it only ever
 * lived in a scratch directory that is wiped between sessions. Same lesson as
 * tests/browser/logo.mjs: a check that does not survive is not a check.
 *
 * ── Why it paints to a canvas ─────────────────────────────────────────────
 * Tailwind compiles an opacity modifier such as `text-white/65` to
 * `color-mix(...)`, which `getComputedStyle` reports in `oklab()`. Parsing
 * that as a string reads it as near-black and produces confident nonsense. So
 * every colour is painted to a 1x1 canvas and read back as real pixels.
 *
 * Not part of `npm run build`: it needs Playwright and a browser, which the
 * build deliberately does not depend on. `npm run test:contrast`.
 */
import { createServer } from 'node:http';
import { readFile, stat, readdir } from 'node:fs/promises';
import { join, extname, resolve, relative } from 'node:path';

const DIST = resolve(import.meta.dirname, '../../dist');

async function loadChromium() {
  for (const c of [
    process.env.PLAYWRIGHT_MODULE,
    'playwright',
    'playwright-core',
    '/opt/node22/lib/node_modules/playwright/index.mjs',
  ].filter(Boolean)) {
    try {
      return (await import(c)).chromium;
    } catch {
      /* next */
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
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

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
      res.writeHead(200, {
        'content-type': TYPES[extname(path)] ?? 'application/octet-stream',
      });
      res.end(await readFile(path));
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((ok) =>
    server.listen(0, '127.0.0.1', () => ok({ server, port: server.address().port })),
  );
}

/** Every built route, from the directory tree. */
async function routes(dir = DIST, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await routes(full, acc);
    else if (entry.name === 'index.html') {
      const rel = relative(DIST, dir).replace(/\\/g, '/');
      acc.push(rel ? `/${rel}/` : '/');
    }
  }
  return acc;
}

/**
 * Runs in the page. Walks every text node, resolves its real foreground and
 * background to pixels, and reports anything under the AA threshold.
 */
const MEASURE = () => {
  const ctx = document
    .createElement('canvas')
    .getContext('2d', { willReadFrequently: true });

  /** Paint a CSS colour and read it back, so color-mix/oklab resolve. */
  const toRgb = (css) => {
    if (!css) return null;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = css;
    const resolved = ctx.fillStyle;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = resolved;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  };

  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const luminance = ({ r, g, b }) =>
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

  /** Flatten a translucent foreground over its background. */
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
  });

  /** First non-transparent background walking up the tree. */
  const backdrop = (el) => {
    let node = el;
    let acc = null;
    while (node && node !== document.documentElement.parentNode) {
      const c = toRgb(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0) {
        acc = acc ? over(acc, c) : c;
        if (!acc.a || acc.a >= 1 || c.a >= 1) return { ...acc, a: 1 };
        acc = { ...acc, a: 1 };
        return acc;
      }
      node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  const ratio = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  const failures = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();

  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);

    /*
     * WCAG 1.4.3 exempts text that is part of a logo or brand name. These two
     * attributes mark the site's logotypes and nothing else — that exemption
     * is the only reason anything is skipped here.
     */
    if (el.closest('[data-wordmark], [data-keyes-wordmark]')) continue;

    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none') continue;
    if (el.closest('[hidden], [aria-hidden="true"], .sr-only')) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (Number(style.opacity) === 0) continue;

    const bg = backdrop(el);
    const fgRaw = toRgb(style.color);
    if (!fgRaw) continue;
    const fg = over(fgRaw, bg);

    const size = parseFloat(style.fontSize);
    const weight = Number(style.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const got = ratio(fg, bg);

    if (got < need - 0.005) {
      failures.push({
        text: n.textContent.trim().slice(0, 48),
        tag: el.tagName.toLowerCase(),
        size: Math.round(size * 10) / 10,
        got: Math.round(got * 100) / 100,
        need,
      });
    }
  }
  return failures;
};

const chromium = await loadChromium();
if (!chromium) {
  console.error(
    'Playwright not found. These are browser checks, so they need it:\n' +
      '  npm i -D playwright && npx playwright install chromium',
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
const paths = (await routes()).sort();

let checked = 0;
let failed = 0;

for (const width of [390, 1400]) {
  for (const path of paths) {
    const page = await browser.newPage({
      viewport: { width, height: width === 390 ? 844 : 900 },
      isMobile: width === 390,
      deviceScaleFactor: 1,
    });
    const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
    if (!res || res.status() !== 200) {
      await page.close();
      continue;
    }
    const bad = await page.evaluate(MEASURE);
    checked++;
    if (bad.length > 0) {
      failed++;
      console.log(`\n✗ ${path} @ ${width}px`);
      for (const f of bad.slice(0, 6)) {
        console.log(
          `    ${f.got}:1 (needs ${f.need}) — <${f.tag}> ${f.size}px — "${f.text}"`,
        );
      }
      if (bad.length > 6) console.log(`    …and ${bad.length - 6} more`);
    }
    await page.close();
  }
}

console.log(
  `\n${paths.length} pages × 2 widths swept — ${failed === 0 ? '0 contrast failures' : `${failed} page/width combinations with failures`}`,
);
await browser.close();
server.close();
process.exit(failed === 0 ? 0 : 1);
