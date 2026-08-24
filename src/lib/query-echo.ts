/**
 * Reads this page's query string and renders the values a form sent here.
 * Small, dependency-free, and inert when there is nothing to show.
 */
type EchoField = {
  param: string;
  label: string;
  suffix?: string;
  format?: 'currency' | 'capitalize';
};

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function present(value: string, field: EchoField): string {
  if (field.format === 'currency') {
    const n = Number(value);
    if (Number.isFinite(n)) return usd.format(n);
  }
  if (field.format === 'capitalize') {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
}

export function initQueryEcho(): void {
  const root = document.querySelector<HTMLElement>('[data-query-echo]');
  const list = root?.querySelector<HTMLElement>('[data-query-echo-list]');
  if (!root || !list) return;

  let fields: EchoField[] = [];
  try {
    fields = JSON.parse(root.dataset.fields ?? '[]') as EchoField[];
  } catch {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const shown = fields.filter((field) => (params.get(field.param) ?? '').trim() !== '');
  if (shown.length === 0) return;

  for (const field of shown) {
    const value = (params.get(field.param) ?? '').trim();

    const wrapper = document.createElement('div');

    const dt = document.createElement('dt');
    dt.className = 'text-xs uppercase tracking-wide-sm text-ink-subtle';
    dt.textContent = field.label;

    const dd = document.createElement('dd');
    dd.className = 'mt-1 font-serif text-xl text-evergreen-800';
    // textContent throughout — values come from the URL and are never markup.
    dd.textContent = `${present(value, field)}${field.suffix ?? ''}`;

    wrapper.append(dt, dd);
    list.append(wrapper);
  }

  root.hidden = false;
}
