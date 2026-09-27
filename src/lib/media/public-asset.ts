/**
 * Build-time resolution of images that live in /public.
 *
 * ── Why this exists ───────────────────────────────────────────────────────
 * The client's photography arrives by being dropped into a folder. Without
 * this, wiring a path before the file exists renders a broken <img> on every
 * page that uses it — worse than the neutral placeholder, and invisible until
 * somebody loads the page. With it, a path can be wired in advance: the slot
 * shows the placeholder until the file appears, then shows the photograph on
 * the next build, with no code change.
 *
 * ── Extensions ────────────────────────────────────────────────────────────
 * The wired path names a `.jpg`, but a client sending a headshot may well
 * send `.jpeg`, `.png` or `.webp`. Rather than make that a support question,
 * a sibling with the same stem and any reasonable image extension is
 * accepted. Whatever is actually on disk is what gets referenced.
 *
 * ── It runs in Node only ──────────────────────────────────────────────────
 * Astro component frontmatter executes at build time, so `node:fs` is fine
 * here. Nothing in this module may ever be imported from a client `<script>`.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** `astro build` and `astro dev` both run from the project root. */
const PUBLIC_DIR = join(process.cwd(), 'public');

/** Tried in order when the wired extension is not the one on disk. */
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];

/** Resolved paths, so a slot used on 45 pages is checked once. */
const cache = new Map<string, string | null>();

/** Paths already warned about, so the build log gets one line each. */
const warned = new Set<string>();

/** Anything not served from /public is passed straight through. */
function isLocalPublicPath(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//');
}

/**
 * Returns the path to use, or `null` when nothing matching is on disk.
 *
 * `null` is the signal to fall back to the placeholder, which is why this
 * returns a path rather than a boolean.
 */
export function resolvePublicImage(src: string | null | undefined): string | null {
  if (!src) return null;
  if (!isLocalPublicPath(src)) return src;

  const hit = cache.get(src);
  if (hit !== undefined) return hit;

  let resolved: string | null = null;

  /*
   * A build running somewhere without the public directory — a consumer of
   * the components in isolation, say — should not have every image silently
   * vanish. Trust the path instead.
   */
  if (!existsSync(PUBLIC_DIR)) {
    resolved = src;
  } else if (existsSync(join(PUBLIC_DIR, src))) {
    resolved = src;
  } else {
    const dot = src.lastIndexOf('.');
    const stem = dot > src.lastIndexOf('/') ? src.slice(0, dot) : src;
    for (const ext of EXTENSIONS) {
      if (existsSync(join(PUBLIC_DIR, stem + ext))) {
        resolved = stem + ext;
        break;
      }
    }
  }

  cache.set(src, resolved);

  if (resolved === null && !warned.has(src)) {
    warned.add(src);
    console.warn(
      `[media] ${src} is wired up but no file is there yet — showing the placeholder. ` +
        `Drop the image into public${src.slice(0, src.lastIndexOf('/'))}/ and rebuild.`,
    );
  }

  return resolved;
}
