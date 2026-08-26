/**
 * Client-side filtering for the development index pages.
 *
 * Mirrors the listing search: the page renders every development once, each
 * carrying a compact JSON payload of its filterable fields, and the browser
 * runs the SAME `matchesDevelopment` and `sortDevelopments` used at build
 * time. Filtering means showing, hiding and reordering nodes that already
 * exist, so no card markup is duplicated in JavaScript.
 *
 * There is no pagination here: a development index is a short list by nature,
 * and a page of six projects does not need paging.
 *
 * Without JavaScript the form submits and the page still lists everything.
 */
import { matchesDevelopment, sortDevelopments } from './filter';
import { DEV_PARAM, parseDevelopmentQuery, serialiseDevelopmentQuery } from './query';
import type { Development, DevelopmentCategory, DevelopmentQuery } from './types';

export function initDevelopmentFilters(): void {
  const grid = document.querySelector<HTMLElement>('[data-development-grid]');
  const form = document.querySelector<HTMLFormElement>('[data-development-filters]');
  if (!grid || !form) return;

  // The route fixes the category; the form carries it so the script does not
  // need it passed in.
  const category = (form.dataset.category ?? 'new') as DevelopmentCategory;

  const items = Array.from(grid.querySelectorAll<HTMLElement>('[data-development]'));
  if (items.length === 0) return;

  const cards = items.flatMap((element) => {
    try {
      return [{ element, data: JSON.parse(element.dataset.development ?? '') as Development }];
    } catch {
      return [];
    }
  });

  const countTotal = document.querySelector<HTMLElement>('[data-development-total]');
  const countNoun = countTotal?.nextElementSibling as HTMLElement | null;
  const emptyState = document.querySelector<HTMLElement>('[data-development-empty]');
  const basePath = new URL(form.action, window.location.origin).pathname;

  function queryFromForm(): DevelopmentQuery {
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(form!).entries()) {
      if (typeof value === 'string' && value.trim() !== '') params.append(key, value);
    }
    return { ...parseDevelopmentQuery(params), category };
  }

  function apply(pushUrl: boolean) {
    const query = queryFromForm();

    const matched = cards.filter((card) => matchesDevelopment(card.data, query));
    const ordered = sortDevelopments(matched.map((c) => c.data), query.sort);
    const order = new Map(ordered.map((d, i) => [d.id, i]));

    for (const card of cards) {
      const show = order.has(card.data.id);
      card.element.hidden = !show;
      if (show) card.element.style.order = String(order.get(card.data.id) ?? 0);
    }
    grid!.style.display = matched.length > 0 ? '' : 'none';

    if (countTotal) countTotal.textContent = String(matched.length);
    if (countNoun) {
      countNoun.textContent =
        matched.length === 1 ? ' development' : ' developments';
    }
    if (emptyState) emptyState.hidden = matched.length > 0;

    if (pushUrl) {
      // `category` is implied by the route, so it never belongs in the URL.
      const { category: _omit, ...shareable } = query;
      const qs = serialiseDevelopmentQuery(shareable);
      window.history.replaceState({}, '', qs ? `${basePath}?${qs}` : basePath);
    }
  }

  let debounce = 0;
  form.addEventListener('input', (event) => {
    const isText =
      event.target instanceof HTMLInputElement && event.target.type === 'search';
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => apply(true), isText ? 250 : 0);
  });

  form.addEventListener('change', () => apply(true));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    apply(true);
  });

  form
    .querySelector('[data-clear-development-filters]')
    ?.addEventListener('click', (event) => {
      event.preventDefault();
      form.reset();
      form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((box) => {
        box.checked = false;
      });
      form.querySelectorAll<HTMLInputElement>('input[type="search"]').forEach((input) => {
        input.value = '';
      });
      form.querySelectorAll<HTMLSelectElement>('select').forEach((select) => {
        if (select.name !== DEV_PARAM.sort) select.selectedIndex = 0;
      });
      apply(true);
    });

  window.addEventListener('popstate', () => {
    syncFormTo(parseDevelopmentQuery(window.location.search));
    apply(false);
  });

  function syncFormTo(query: DevelopmentQuery) {
    const set = (name: string, value: string) => {
      const el = form!.elements.namedItem(name);
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        el.value = value;
      }
    };
    set(DEV_PARAM.search, query.search ?? '');
    set(DEV_PARAM.city, query.city ?? '');
    set(DEV_PARAM.minPrice, query.minPrice ? String(query.minPrice) : '');
    set(DEV_PARAM.maxPrice, query.maxPrice ? String(query.maxPrice) : '');
    set(DEV_PARAM.beds, query.beds ? String(query.beds) : '');
    if (query.sort) set(DEV_PARAM.sort, query.sort);
    form!.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((box) => {
      if (box.name === DEV_PARAM.developmentType) {
        box.checked = query.developmentType?.includes(box.value as never) ?? false;
      } else if (box.name === DEV_PARAM.status) {
        box.checked = query.status?.includes(box.value as never) ?? false;
      }
    });
  }

  /*
   * A static page cannot read the query string at build time, so the rendered
   * form is empty. Hydrating it from the URL first is what makes a shared
   * filtered view actually apply its filters.
   */
  syncFormTo(parseDevelopmentQuery(window.location.search));
  apply(false);
}
