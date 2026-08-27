/**
 * Client-side filtering for the community index.
 *
 * Same approach as listings and developments: the page renders every community
 * card once, each carrying the few fields the filter reads, and the browser
 * shows and hides nodes that already exist. No card markup is duplicated in
 * JavaScript, and the no-JavaScript view is a complete list rather than a
 * broken one.
 *
 * The filter is also debounced on typing, because a fifteen-item list does not
 * need to re-run on every keystroke to feel instant.
 */
import { matchesCommunity, parseCommunityQuery, serialiseCommunityQuery } from './filter';
import type { CommunityQuery } from './filter';
import type { Community } from '@data/communities';

type CardData = Pick<Community, 'slug' | 'name' | 'county' | 'kind' | 'parent'> & {
  parentName: string | null;
};

export function initCommunityFilters(): void {
  const grid = document.querySelector<HTMLElement>('[data-community-grid]');
  const form = document.querySelector<HTMLFormElement>('[data-community-filters]');
  if (!grid || !form) return;

  const items = Array.from(grid.querySelectorAll<HTMLElement>('[data-community]'));
  if (items.length === 0) return;

  const cards = items.flatMap((element) => {
    try {
      return [{ element, data: JSON.parse(element.dataset.community ?? '') as CardData }];
    } catch {
      return [];
    }
  });

  const total = document.querySelector<HTMLElement>('[data-community-total]');
  const empty = document.querySelector<HTMLElement>('[data-community-empty]');
  const reset = document.querySelector<HTMLElement>('[data-community-reset]');
  const basePath = new URL(form.action, window.location.origin).pathname;

  function queryFromForm(): CommunityQuery {
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(form!).entries()) {
      if (typeof value === 'string' && value.trim() !== '') params.append(key, value);
    }
    return parseCommunityQuery(params);
  }

  function apply(pushUrl: boolean) {
    const query = queryFromForm();
    let shown = 0;

    for (const card of cards) {
      const match = matchesCommunity(
        card.data as unknown as Community,
        query,
        card.data.parentName,
      );
      card.element.hidden = !match;
      if (match) shown += 1;
    }

    if (total) total.textContent = String(shown);
    if (empty) empty.hidden = shown > 0;
    if (reset) reset.hidden = !(query.search || query.county || query.kind);

    if (pushUrl) {
      const qs = serialiseCommunityQuery(query);
      window.history.replaceState({}, '', qs ? `${basePath}?${qs}` : basePath);
    }
  }

  /* The URL is the source of truth. A static page cannot read it at build
     time, so hydrate the form from it before the first filter runs. */
  const initial = parseCommunityQuery(window.location.search);
  const searchInput = form.querySelector<HTMLInputElement>('[name=q]');
  if (searchInput && initial.search) searchInput.value = initial.search;
  const countySelect = form.querySelector<HTMLSelectElement>('[name=county]');
  if (countySelect && initial.county) countySelect.value = initial.county;
  if (initial.kind) {
    const radio = form.querySelector<HTMLInputElement>(
      `input[name=kind][value="${initial.kind}"]`,
    );
    if (radio) radio.checked = true;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    apply(true);
  });
  form.addEventListener('change', () => apply(true));

  let timer: number | undefined;
  form.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => apply(true), 150);
  });

  reset?.addEventListener('click', (event) => {
    event.preventDefault();
    form.reset();
    apply(true);
  });

  form.dataset.enhanced = 'true';
  apply(false);
}
