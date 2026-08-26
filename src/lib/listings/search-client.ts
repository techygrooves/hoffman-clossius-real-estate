/**
 * Client-side filtering for the listing index pages.
 *
 * ── How it works ──────────────────────────────────────────────────────────
 * The page server-renders every listing card once. Each <li> carries a compact
 * JSON payload of just the filterable fields, so the browser can run the SAME
 * `matchesQuery` and `sortListings` used at build time — no second
 * implementation of the filter rules to drift out of step.
 *
 * Filtering then means showing, hiding and reordering nodes that already
 * exist. No card markup is duplicated in JavaScript, so the Astro component
 * stays the single source of truth for how a card looks.
 *
 * ── When the feed gets large ──────────────────────────────────────────────
 * This approach is right for a set the page can reasonably render in full —
 * dozens, or a few hundred. A live MLS feed of thousands should filter at the
 * provider instead: the page would request a page of results and this module
 * would be replaced by one that fetches. Nothing else changes, because the URL
 * contract and the components are the same either way. See IDX_INTEGRATION.md.
 *
 * Without JavaScript the form simply submits and the server-rendered results
 * are already filtered, so the page works either way.
 */
import { matchesQuery, sortListings } from './filter';
import { parseListingQuery, serialiseListingQuery, PARAM } from './query';
import { DEFAULT_PAGE_SIZE, type Listing, type ListingQuery } from './types';

/** The subset of a Listing needed to decide whether it matches a query. */
type CardData = Pick<
  Listing,
  | 'id'
  | 'status'
  | 'price'
  | 'beds'
  | 'baths'
  | 'halfBaths'
  | 'sqft'
  | 'propertyType'
  | 'pool'
  | 'waterfront'
  | 'updatedAt'
> & {
  address: Listing['address'];
  listingAgent: { isOurAgent: boolean } | null;
};

type Card = { element: HTMLElement; data: Listing };

export function initListingSearch(): void {
  const grid = document.querySelector<HTMLElement>('[data-listing-grid]');
  const form = document.querySelector<HTMLFormElement>('[data-listing-filters]');
  if (!grid || !form) return;

  const items = Array.from(grid.querySelectorAll<HTMLElement>('[data-listing]'));
  if (items.length === 0) return;

  const cards: Card[] = items.flatMap((element) => {
    try {
      const data = JSON.parse(element.dataset.listing ?? '') as CardData;
      // Only the filterable fields are carried; the rest is never read.
      return [{ element, data: data as unknown as Listing }];
    } catch {
      return [];
    }
  });

  const results = document.querySelector<HTMLElement>('[data-results-region]');
  const countTotal = document.querySelector<HTMLElement>('[data-result-total]');
  const countNoun = countTotal?.nextElementSibling as HTMLElement | null;
  const emptyState = document.querySelector<HTMLElement>('[data-listing-empty]');
  const paginationHost = document.querySelector<HTMLElement>('[data-pagination]');

  const basePath = new URL(form.action, window.location.origin).pathname;

  /** Reads the form into a query, so the URL and the controls never disagree. */
  function queryFromForm(page: number): ListingQuery {
    const data = new FormData(form!);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      if (typeof value === 'string' && value.trim() !== '') params.append(key, value);
    }
    if (page > 1) params.set(PARAM.page, String(page));
    return parseListingQuery(params);
  }

  function renderPagination(page: number, totalPages: number, query: ListingQuery) {
    if (!paginationHost) return;

    if (totalPages <= 1) {
      paginationHost.hidden = true;
      paginationHost.innerHTML = '';
      return;
    }
    paginationHost.hidden = false;

    const numbers: (number | '…')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) numbers.push(i);
    } else {
      numbers.push(1);
      const from = Math.max(2, page - 1);
      const to = Math.min(totalPages - 1, page + 1);
      if (from > 2) numbers.push('…');
      for (let i = from; i <= to; i++) numbers.push(i);
      if (to < totalPages - 1) numbers.push('…');
      numbers.push(totalPages);
    }

    const linkBase =
      'inline-flex h-11 min-w-11 items-center justify-center rounded-xs px-3 text-sm transition-colors';
    const href = (target: number) => {
      const qs = serialiseListingQuery({ ...query, page: target });
      return qs ? `${basePath}?${qs}` : basePath;
    };

    const list = document.createElement('ul');
    list.className = 'flex flex-wrap items-center gap-1';

    const arrow = (target: number, enabled: boolean, glyph: string, label: string) => {
      const li = document.createElement('li');
      const node = document.createElement(enabled ? 'a' : 'span');
      node.className = `${linkBase} ${enabled ? 'border border-line-control text-evergreen-800 hover:bg-evergreen-50' : 'border border-line text-ink-subtle'}`;
      if (enabled && node instanceof HTMLAnchorElement) {
        node.href = href(target);
        node.dataset.page = String(target);
      } else {
        node.setAttribute('aria-disabled', 'true');
      }
      node.innerHTML = `<span aria-hidden="true">${glyph}</span><span class="sr-only">${label}</span>`;
      li.append(node);
      return li;
    };

    list.append(arrow(page - 1, page > 1, '&larr;', 'Previous page'));

    for (const item of numbers) {
      const li = document.createElement('li');
      if (item === '…') {
        li.className = 'px-2 text-ink-subtle';
        li.setAttribute('aria-hidden', 'true');
        li.textContent = '…';
      } else {
        const a = document.createElement('a');
        a.href = href(item);
        a.dataset.page = String(item);
        a.className = `${linkBase} ${item === page ? 'bg-evergreen-800 text-white' : 'border border-line text-ink-muted hover:border-evergreen-800 hover:text-evergreen-800'}`;
        if (item === page) a.setAttribute('aria-current', 'page');
        a.innerHTML = `<span class="sr-only">Page </span>${item}`;
        li.append(a);
      }
      list.append(li);
    }

    list.append(arrow(page + 1, page < totalPages, '&rarr;', 'Next page'));

    paginationHost.innerHTML = '';
    paginationHost.append(list);
  }

  function apply(page: number, pushUrl: boolean) {
    const query = queryFromForm(page);

    const matched = cards.filter((card) => matchesQuery(card.data, query));
    const ordered = sortListings(
      matched.map((c) => c.data),
      query.sort,
    );
    const orderIndex = new Map(ordered.map((listing, i) => [listing.id, i]));

    const pageSize = DEFAULT_PAGE_SIZE;
    const totalPages = Math.max(1, Math.ceil(matched.length / pageSize));
    const current = Math.min(Math.max(1, page), totalPages);
    const start = (current - 1) * pageSize;
    const visibleIds = new Set(
      ordered.slice(start, start + pageSize).map((l) => l.id),
    );

    for (const card of cards) {
      const parent = card.element;
      const show = visibleIds.has(card.data.id);
      parent.hidden = !show;
      if (show) parent.style.order = String(orderIndex.get(card.data.id) ?? 0);
    }
    // Flex ordering on a grid container: `order` works, and the grid keeps
    // its own column rules.
    grid!.style.display = matched.length > 0 ? '' : 'none';

    if (countTotal) countTotal.textContent = String(matched.length);
    if (countNoun) {
      countNoun.textContent = matched.length === 1 ? ' property' : ' properties';
    }
    if (emptyState) emptyState.hidden = matched.length > 0;

    renderPagination(current, totalPages, query);

    const qs = serialiseListingQuery({ ...query, page: current });
    const url = qs ? `${basePath}?${qs}` : basePath;
    if (pushUrl) {
      window.history.replaceState({}, '', url);
    }
  }

  /* ---------------------------------------------------------------- events */

  let debounce = 0;
  form.addEventListener('input', (event) => {
    const target = event.target as HTMLElement;
    const isText = target instanceof HTMLInputElement && target.type === 'search';
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => apply(1, true), isText ? 250 : 0);
  });

  form.addEventListener('change', () => apply(1, true));

  /*
   * The sort select is associated with the form by its `form` attribute but
   * lives outside the form's subtree, so its change event never bubbles to the
   * form element. FormData still picks the value up — only the event needs
   * its own listener.
   */
  document
    .querySelector<HTMLSelectElement>('[data-listing-sort]')
    ?.addEventListener('change', () => apply(1, true));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    apply(1, true);
    results?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  form.querySelector('[data-clear-filters]')?.addEventListener('click', (event) => {
    event.preventDefault();
    form.reset();
    form.querySelectorAll('input[type="checkbox"]').forEach((box) => {
      (box as HTMLInputElement).checked = false;
    });
    form.querySelectorAll<HTMLInputElement>('input[type="search"]').forEach((input) => {
      input.value = '';
    });
    form.querySelectorAll<HTMLSelectElement>('select').forEach((select) => {
      if (select.name !== 'sort') select.selectedIndex = 0;
    });
    apply(1, true);
  });

  // Pagination is delegated, because the markup is rebuilt on every filter.
  paginationHost?.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-page]');
    if (!link) return;
    event.preventDefault();
    apply(Number(link.dataset.page), true);
    results?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  // Back/forward should restore the search that URL describes.
  window.addEventListener('popstate', () => {
    const query = parseListingQuery(window.location.search);
    syncFormTo(query);
    apply(query.page ?? 1, false);
  });

  function syncFormTo(query: ListingQuery) {
    const set = (name: string, value: string) => {
      const el = form!.elements.namedItem(name);
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        el.value = value;
      }
    };
    set(PARAM.location, query.location ?? '');
    set(PARAM.minPrice, query.minPrice ? String(query.minPrice) : '');
    set(PARAM.maxPrice, query.maxPrice ? String(query.maxPrice) : '');
    set(PARAM.beds, query.beds ? String(query.beds) : '');
    set(PARAM.baths, query.baths ? String(query.baths) : '');
    form!.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((box) => {
      if (box.name === PARAM.propertyType) {
        box.checked = query.propertyType?.includes(box.value as never) ?? false;
      } else if (box.name === PARAM.waterfront) {
        box.checked = query.waterfront === true;
      } else if (box.name === PARAM.pool) {
        box.checked = query.pool === true;
      }
    });
  }

  /*
   * On load, take the filters from the URL and put them into the form, then
   * apply them. This is what makes a shared search URL work: the page is
   * statically generated, so the server could not read the query string and
   * rendered an empty form over the full result set.
   */
  const initial = parseListingQuery(window.location.search);
  syncFormTo(initial);
  const sortSelect = document.querySelector<HTMLSelectElement>('[data-listing-sort]');
  if (sortSelect && initial.sort) sortSelect.value = initial.sort;
  apply(initial.page ?? 1, false);
}
