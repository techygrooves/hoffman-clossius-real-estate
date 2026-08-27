/**
 * Client-side filtering for the journal index.
 *
 * Same approach as listings, developments and communities: every card is
 * rendered once, server-side, and the browser shows and hides nodes that
 * already exist. No card markup is duplicated in JavaScript, and without it
 * the index is a complete list rather than a broken one.
 */
type CardData = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  /** The human label, so searching "Relocation" finds a `relocation` post. */
  categoryLabel: string;
  tags: string[];
};

const PARAM = { search: 'q', category: 'category' } as const;

export function initPostFilters(): void {
  const grid = document.querySelector<HTMLElement>('[data-post-grid]');
  const form = document.querySelector<HTMLFormElement>('[data-post-filters]');
  if (!grid || !form) return;

  const items = Array.from(grid.querySelectorAll<HTMLElement>('[data-post]'));
  if (items.length === 0) return;

  const cards = items.flatMap((element) => {
    try {
      return [{ element, data: JSON.parse(element.dataset.post ?? '') as CardData }];
    } catch {
      return [];
    }
  });

  const total = document.querySelector<HTMLElement>('[data-post-total]');
  const empty = document.querySelector<HTMLElement>('[data-post-empty]');
  const reset = document.querySelector<HTMLElement>('[data-post-reset]');
  const basePath = new URL(form.action, window.location.origin).pathname;

  const search = form.querySelector<HTMLInputElement>(`[name=${PARAM.search}]`);
  const categoryInputs = Array.from(
    form.querySelectorAll<HTMLInputElement>(`input[name=${PARAM.category}]`),
  );

  const currentCategory = () =>
    categoryInputs.find((input) => input.checked)?.value ?? '';

  function apply(pushUrl: boolean) {
    const needle = (search?.value ?? '').trim().toLowerCase();
    const category = currentCategory();
    let shown = 0;

    for (const card of cards) {
      const matchesCategory = !category || card.data.category === category;
      const haystack = [
        card.data.title,
        card.data.excerpt,
        card.data.category,
        card.data.categoryLabel,
        ...(card.data.tags ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesSearch = !needle || haystack.includes(needle);

      const show = matchesCategory && matchesSearch;
      card.element.hidden = !show;
      if (show) shown += 1;
    }

    if (total) total.textContent = String(shown);
    if (empty) empty.hidden = shown > 0;
    if (reset) reset.hidden = !(needle || category);

    if (pushUrl) {
      const params = new URLSearchParams();
      if (needle) params.set(PARAM.search, needle);
      if (category) params.set(PARAM.category, category);
      const qs = params.toString();
      window.history.replaceState({}, '', qs ? `${basePath}?${qs}` : basePath);
    }
  }

  /* The URL is the source of truth. A static page cannot read it at build
     time, so hydrate the form from it before the first filter runs. */
  const initial = new URLSearchParams(window.location.search);
  const initialSearch = initial.get(PARAM.search);
  if (search && initialSearch) search.value = initialSearch;
  const initialCategory = initial.get(PARAM.category);
  if (initialCategory) {
    const match = categoryInputs.find((input) => input.value === initialCategory);
    if (match) match.checked = true;
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
