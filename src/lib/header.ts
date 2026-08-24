/**
 * Header behaviour — the only interactive script in the global chrome.
 *
 * Everything here is an enhancement. Without it: the desktop dropdowns still
 * open on hover and on keyboard focus via CSS, the drawer's nested categories
 * are native <details>, and the mobile Call disclosure is a native <details>
 * too. The script adds aria-expanded bookkeeping, Escape-to-close, outside
 * clicks and the drawer's focus trap. Keep this file small.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

const DESKTOP_QUERY = '(min-width: 1280px)';

export function initHeader(): void {
  initScrolledState();
  initDesktopMenus();
  initDrawer();
  initCallDisclosure();
}

/* ------------------------------------------------- sticky header, pinned state */

/**
 * Two jobs:
 *
 *  1. Set --header-sticky-offset to the height of the rows sitting above the
 *     row that should pin, so the header slides up by exactly that much and
 *     leaves the last row against the top of the viewport. The rows differ by
 *     breakpoint (nav row on desktop, compact bar on mobile), so the offset is
 *     measured from whichever bar is actually visible.
 *
 *  2. Flag the bars once pinned, which drives their shadow and reveals the
 *     condensed brand + call to action inside the desktop nav row.
 */
function initScrolledState(): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;

  const bars = Array.from(
    header.querySelectorAll<HTMLElement>('[data-header-bar]'),
  );
  if (bars.length === 0) return;

  const visibleBar = () => bars.find((bar) => bar.offsetParent !== null);

  const setOffset = () => {
    const bar = visibleBar();
    if (!bar) return;
    // offsetTop is measured against the header, which is a positioned element.
    const offset = Math.max(0, Math.round(bar.offsetTop));
    header.style.setProperty('--header-sticky-offset', `-${offset}px`);
  };

  setOffset();
  // Web fonts land after first paint and change the brand row's height.
  document.fonts?.ready.then(setOffset).catch(() => {});

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(setOffset, 150);
  });

  if (!('IntersectionObserver' in window)) return;

  // The sentinel must sit OUTSIDE the header, or it would stick along with it.
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:100%';
  header.parentElement?.insertBefore(sentinel, header);

  new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      const pinned = !entry.isIntersecting;
      for (const bar of bars) {
        bar.toggleAttribute('data-scrolled', pinned);
        bar
          .querySelector('[data-header-condensed]')
          ?.toggleAttribute('data-scrolled', pinned);
      }
    },
    { threshold: 0 },
  ).observe(sentinel);
}

/* ---------------------------------------------------------- desktop menus */

/**
 * Dropdown open state.
 *
 * The panel is visible when its group is hovered (pure CSS) or carries
 * [data-open] (managed here). Marking the nav as enhanced disables the
 * CSS-only :focus-visible rule in global.css, so this script becomes the sole
 * owner of the keyboard state — which is what lets Escape actually close a
 * menu, given that closing returns focus to the trigger that opened it.
 */
function initDesktopMenus(): void {
  const nav = document.querySelector<HTMLElement>('[data-primary-nav]');
  const groups = Array.from(
    document.querySelectorAll<HTMLElement>('[data-nav-group]'),
  );
  if (!nav || groups.length === 0) return;

  nav.setAttribute('data-nav-enhanced', '');

  const setOpen = (group: HTMLElement, open: boolean) => {
    group.toggleAttribute('data-open', open);
    group
      .querySelector('[data-nav-trigger]')
      ?.setAttribute('aria-expanded', String(open));
  };

  const closeAll = (except?: HTMLElement) => {
    for (const group of groups) {
      if (group !== except) setOpen(group, false);
    }
  };

  for (const group of groups) {
    const trigger = group.querySelector<HTMLButtonElement>('[data-nav-trigger]');
    if (!trigger) continue;

    trigger.addEventListener('click', () => {
      const open = group.hasAttribute('data-open');
      closeAll(group);
      setOpen(group, !open);
    });

    /* Keyboard focus opens the menu; a mouse click does not (the click
       handler above owns that), which keeps the two from fighting. */
    trigger.addEventListener('focus', () => {
      if (!trigger.matches(':focus-visible')) return;
      closeAll(group);
      setOpen(group, true);
    });

    /* Hovering a different group dismisses whatever was open, including a
       menu pinned by click or keyboard. Hover itself needs no state. */
    group.addEventListener('pointerenter', () => {
      closeAll(group);
      trigger.setAttribute('aria-expanded', 'true');
    });
    group.addEventListener('pointerleave', () => {
      if (!group.hasAttribute('data-open')) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    group.addEventListener('focusout', (event) => {
      const next = event.relatedTarget;
      if (next instanceof Node && group.contains(next)) return;
      setOpen(group, false);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const active = document.activeElement;
    const group =
      active instanceof Element ? active.closest('[data-nav-group]') : null;
    closeAll();
    if (group instanceof HTMLElement) {
      group.querySelector<HTMLButtonElement>('[data-nav-trigger]')?.focus();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest('[data-nav-group]')) return;
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
    // Next frame, so the transition has a start state to animate from.
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
    // Fallback for reduced motion, where transitionend may never fire.
    window.setTimeout(finish, 400);
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

  // Resizing past the desktop breakpoint must not leave the body scroll-locked.
  window.matchMedia(DESKTOP_QUERY).addEventListener('change', (event) => {
    if (event.matches) close();
  });
}

/* --------------------------------------- mobile action bar: Call disclosure */

/**
 * The Call disclosure is a native <details>, so it already opens, closes and
 * takes keyboard focus on its own. This adds the two behaviours <details>
 * lacks: Escape closes it, and so does a click anywhere outside.
 */
function initCallDisclosure(): void {
  const disclosure =
    document.querySelector<HTMLDetailsElement>('[data-call-disclosure]');
  if (!disclosure) return;

  const summary = disclosure.querySelector('summary');

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !disclosure.open) return;
    disclosure.open = false;
    if (summary instanceof HTMLElement) summary.focus();
  });

  document.addEventListener('click', (event) => {
    if (!disclosure.open) return;
    const target = event.target;
    if (target instanceof Node && disclosure.contains(target)) return;
    disclosure.open = false;
  });
}
