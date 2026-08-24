/**
 * ---------------------------------------------------------------------------
 * BUILD FLAGS
 * ---------------------------------------------------------------------------
 * `demoContent` is the single switch that turns placeholder/demo content on.
 *
 *   dev server            ON   — so the design can be reviewed
 *   production build      OFF  — nothing fabricated ever ships
 *   explicit override     PUBLIC_DEMO_CONTENT=true|false
 *
 * To preview the populated design in a built site:
 *     PUBLIC_DEMO_CONTENT=true npm run build:fast
 *
 * Wherever demo content is displayed the UI says so, plainly and visibly.
 * Testimonials are deliberately excluded from this mechanism — no fabricated
 * review is acceptable in any mode. See PROJECT_CONTEXT.md §9.
 * ---------------------------------------------------------------------------
 */

const override = import.meta.env.PUBLIC_DEMO_CONTENT;

export const flags = {
  demoContent:
    override === 'true'
      ? true
      : override === 'false'
        ? false
        : import.meta.env.DEV === true,
} as const;
