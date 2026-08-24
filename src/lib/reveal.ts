/**
 * Progressive scroll reveal — the site's only always-on client script.
 *
 * ~1KB, no dependencies, no layout thrash. Elements marked [data-reveal] are
 * revealed once as they enter the viewport. If IntersectionObserver is missing
 * or the user prefers reduced motion, everything is shown immediately.
 */
export function initReveal(): void {
  const root = document.documentElement;
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (targets.length === 0) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.setAttribute('data-revealed', ''));
    return;
  }

  // Only now do we opt into the hidden start state, so a failed script can
  // never leave content invisible.
  root.setAttribute('data-reveal-enabled', '');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-revealed', '');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  );

  targets.forEach((el) => observer.observe(el));
}
