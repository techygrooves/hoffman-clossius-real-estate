/**
 * Recently viewed properties — per device, most recent first.
 *
 * Records the slug and a short label as someone opens a detail page, then
 * renders the previous few. Kept intentionally minimal: no server, no account,
 * no tracking, and it disappears with the browser's site data.
 *
 * The current property is never listed in its own "recently viewed" row.
 */
const KEY = 'hc:recently-viewed';
const LIMIT = 6;

type Entry = { slug: string; label: string; meta: string };

function read(): Entry[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is Entry =>
        typeof e === 'object' && e !== null && typeof (e as Entry).slug === 'string',
    );
  } catch {
    return [];
  }
}

function write(entries: Entry[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries.slice(0, LIMIT)));
  } catch {
    /* Storage unavailable; nothing is recorded, and that is fine. */
  }
}

export function initRecentlyViewed(): void {
  const root = document.querySelector<HTMLElement>('[data-recently-viewed]');
  if (!root) return;

  const current = root.dataset.currentSlug ?? '';
  const label = root.dataset.currentLabel ?? '';
  const meta = root.dataset.currentMeta ?? '';

  const previous = read().filter((entry) => entry.slug !== current);

  if (current && label) {
    write([{ slug: current, label, meta }, ...previous]);
  }

  const list = root.querySelector<HTMLElement>('[data-recently-viewed-list]');
  if (!list || previous.length === 0) return;

  for (const entry of previous.slice(0, 4)) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `/property/${encodeURIComponent(entry.slug)}/`;
    a.className =
      'group flex flex-col gap-1 rounded-xs border border-line px-5 py-4 transition-colors hover:border-evergreen-800 hover:bg-evergreen-50';

    const title = document.createElement('span');
    title.className = 'text-sm text-evergreen-800';
    // textContent throughout: these strings came out of storage.
    title.textContent = entry.label;

    const sub = document.createElement('span');
    sub.className = 'text-xs text-ink-muted';
    sub.textContent = entry.meta;

    a.append(title, sub);
    li.append(a);
    list.append(li);
  }

  root.hidden = false;
}
