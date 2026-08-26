/**
 * Saved properties — a per-device convenience, and nothing more.
 *
 * State lives in this browser's localStorage. It is not an account, it does
 * not sync, and nothing leaves the device. Saved searches and favourites
 * properly belong to the IDX platform's account system
 * (CONTENT_PENDING.md 5.6); this is replaced when that is connected.
 *
 * Every storage access is guarded: private windows, cleared site data and
 * browsers configured to block storage all throw, and none of that should
 * break a page.
 */
const KEY = 'hc:saved-properties';

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function write(ids: string[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids.slice(0, 200)));
  } catch {
    /* Storage unavailable — the button still toggles for this page view. */
  }
}

export function initFavorites(): void {
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-favorite]'),
  );
  if (buttons.length === 0) return;

  let saved = new Set(read());

  const paint = (button: HTMLButtonElement) => {
    const id = button.dataset.listingId ?? '';
    const on = saved.has(id);
    button.setAttribute('aria-pressed', String(on));

    const icon = button.querySelector<SVGPathElement>('[data-favorite-icon]');
    if (icon) icon.setAttribute('fill', on ? 'currentColor' : 'none');

    const text = button.querySelector<HTMLElement>('[data-favorite-text]');
    if (text) text.textContent = on ? 'Saved' : 'Save';

    const sr = button.querySelector<HTMLElement>('[data-favorite-sr]');
    if (sr) {
      const label = sr.dataset.label ?? sr.textContent ?? '';
      sr.dataset.label = label;
      sr.textContent = on ? `Remove from saved` : label;
    }
  };

  for (const button of buttons) {
    paint(button);
    button.addEventListener('click', (event) => {
      // Cards wrap a stretched link; saving must not navigate.
      event.preventDefault();
      event.stopPropagation();

      const id = button.dataset.listingId ?? '';
      if (!id) return;
      if (saved.has(id)) saved.delete(id);
      else saved.add(id);
      write([...saved]);
      paint(button);
    });
  }

  // Another tab may have changed the list.
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY) return;
    saved = new Set(read());
    buttons.forEach(paint);
  });
}
