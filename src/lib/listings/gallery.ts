/**
 * Gallery lightbox behaviour.
 *
 * Deliberately small. The native <dialog> supplies the modal focus trap, the
 * backdrop and Escape-to-close, so this file only has to move between images,
 * put focus back where it came from, and read touch swipes.
 */
export function initGallery(): void {
  const root = document.querySelector<HTMLElement>('[data-gallery]');
  const dialog = root?.querySelector<HTMLDialogElement>('[data-gallery-dialog]');
  if (!root || !dialog || typeof dialog.showModal !== 'function') return;

  const slides = Array.from(
    dialog.querySelectorAll<HTMLImageElement>('[data-gallery-slide]'),
  );
  if (slides.length === 0) return;

  const position = dialog.querySelector<HTMLElement>('[data-gallery-position]');
  const caption = dialog.querySelector<HTMLElement>('[data-gallery-caption]');
  const captions = slides.map((s) => s.dataset.caption ?? '');

  let index = 0;
  let opener: HTMLElement | null = null;

  const show = (next: number) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== index;
      // The visible slide is worth fetching immediately; the rest can wait.
      if (i === index) slide.loading = 'eager';
    });
    if (position) position.textContent = String(index + 1);
    if (caption) caption.textContent = captions[index] ?? '';
  };

  const open = (start: number, from: HTMLElement) => {
    opener = from;
    show(start);
    dialog.showModal();
  };

  root.querySelectorAll<HTMLElement>('[data-gallery-open]').forEach((trigger) => {
    trigger.addEventListener('click', () =>
      open(Number(trigger.dataset.index ?? '0'), trigger),
    );
  });

  dialog
    .querySelector('[data-gallery-close]')
    ?.addEventListener('click', () => dialog.close());
  dialog
    .querySelector('[data-gallery-prev]')
    ?.addEventListener('click', () => show(index - 1));
  dialog
    .querySelector('[data-gallery-next]')
    ?.addEventListener('click', () => show(index + 1));

  // Arrow keys, alongside the Escape the dialog already handles itself.
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + 1);
    }
  });

  // Clicking the backdrop — outside the content — closes.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Focus must land back on the thumbnail that opened the lightbox.
  dialog.addEventListener('close', () => {
    opener?.focus();
    opener = null;
  });

  /* Swipe. Horizontal intent only, so a vertical scroll is never hijacked. */
  let startX = 0;
  let startY = 0;
  let tracking = false;

  dialog.addEventListener(
    'touchstart',
    (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
      tracking = true;
    },
    { passive: true },
  );

  dialog.addEventListener(
    'touchend',
    (event) => {
      if (!tracking) return;
      tracking = false;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
      show(dx < 0 ? index + 1 : index - 1);
    },
    { passive: true },
  );
}
