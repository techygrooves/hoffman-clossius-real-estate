/**
 * Header behaviour — the only interactive script in the global chrome.
 *
 * Everything here is an enhancement: without it the desktop menus still open
 * on hover/focus via CSS and the drawer link list is unreachable only because
 * the drawer is a genuine overlay, so the same links are duplicated in the
 * footer. Keep this file small.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

export function initHeader(): void {
  initScrolledState();
  initDesktopMenus();
  initDrawer();
}

/* ------------------------------------------------------ sticky bar shadow */

function initScrolledState(): void {
  const bar = document.querySelector<HTMLElement>('[data-header-bar]');
  if (!bar) return;

  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:100%';
  bar.parentElement?.insertBefore(sentinel, bar);

  if (!('IntersectionObserver' in window)) return;

  new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      bar.toggleAttribute('data-scrolled', !entry.isIntersecting);
    },
    { threshold: 0 },
  ).observe(sentinel);
}

/* ---------------------------------------------------------- desktop menus */

function initDesktopMenus(): void {
  const groups = Array.from(
    document.querySelectorAll<HTMLElement>('[data-nav-group]'),
  );
  if (groups.length === 0) return;

  const closeAll = (except?: HTMLElement) => {
    for (const group of groups) {
      if (group === except) continue;
      group.querySelector('[data-nav-panel]')?.removeAttribute('data-open');
      group
        .querySelector('[data-nav-trigger]')
        ?.setAttribute('aria-expanded', 'false');
    }
  };

  for (const group of groups) {
    const trigger = group.querySelector<HTMLButtonElement>('[data-nav-trigger]');
    const panel = group.querySelector<HTMLElement>('[data-nav-panel]');
    if (!trigger || !panel) continue;

    trigger.addEventListener('click', () => {
      const open = panel.hasAttribute('data-open');
      closeAll(group);
      panel.toggleAttribute('data-open', !open);
      trigger.setAttribute('aria-expanded', String(!open));
    });

    // Keep aria-expanded honest when the menu opens via hover or focus.
    group.addEventListener('pointerenter', () =>
      trigger.setAttribute('aria-expanded', 'true'),
    );
    group.addEventListener('pointerleave', () => {
      if (!panel.hasAttribute('data-open')) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
    group.addEventListener('focusout', (event) => {
      const next = event.relatedTarget;
      if (next instanceof Node && group.contains(next)) return;
      panel.removeAttribute('data-open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const active = document.activeElement;
    const group = active instanceof Element ? active.closest('[data-nav-group]') : null;
    closeAll();
    if (group instanceof HTMLElement) {
      group.querySelector<HTMLButtonElement>('[data-nav-trigger]')?.focus();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Node && target instanceof Element && target.closest('[data-nav-group]')) {
      return;
    }
    closeAll();
  });
}

/* ---------------------------------------------------------- mobile drawer */

function initDrawer(): void {
  const drawer = document.querySelector<HTMLElement>('[data-drawer]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-drawer-toggle]');
  const panel = drawer?.querySelector<HTMLElement>('[data-drawer-panel]');
  const scrim = drawer?.querySelector<HTMLElement>('[data-drawer-scrim]');
  const closeButton = drawer?.querySelector<HTMLButtonElement>('[data-drawer-close]');
  if (!drawer || !toggle || !panel || !scrim) return;

  let isOpen = false;

  const open = () => {
    if (isOpen) return;
    isOpen = true;
    drawer.hidden = false;
    // Next frame so the transition has a start state to animate from.
    requestAnimationFrame(() => {
      panel.setAttribute('data-open', '');
      scrim.setAttribute('data-open', '');
    });
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    panel.removeAttribute('data-open');
    scrim.removeAttribute('data-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();

    const finish = () => {
      if (!isOpen) drawer.hidden = true;
    };
    panel.addEventListener('transitionend', finish, { once: true });
    // Fallback for reduced-motion, where transitionend may never fire.
    window.setTimeout(finish, 450);
  };

  toggle.addEventListener('click', open);
  closeButton?.addEventListener('click', close);
  scrim.addEventListener('click', close);

  drawer.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((el) => el.offsetParent !== null);
    if (focusable.length === 0) return;

    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // A resize past the desktop breakpoint should not leave the body locked.
  window.matchMedia('(min-width: 1280px)').addEventListener('change', (event) => {
    if (event.matches) close();
  });
}
