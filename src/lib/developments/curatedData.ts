/**
 * ---------------------------------------------------------------------------
 * CURATED DEVELOPMENTS — client-supplied, and INTENTIONALLY EMPTY today
 * ---------------------------------------------------------------------------
 * This is where real developments go. Unlike listings there is no MLS feed for
 * new construction: development material comes from the client, who gets it
 * from the developer.
 *
 * Adding an entry here is the whole integration. No page or component changes.
 *
 * ── Rules for every entry ─────────────────────────────────────────────────
 *
 *  - `verified: true` only when the CLIENT has confirmed every detail is
 *    accurate and that we are permitted to publish it. Unverified entries
 *    never render. Do not set it to get something on screen.
 *  - `demo: false` always.
 *  - Use `null` for anything not confirmed. Never estimate a delivery date,
 *    a starting price or a residence count — those are claims about someone
 *    else's project, and getting one wrong is a real problem, not a typo.
 *  - Renderings, photographs, site plans and floor plans are **copyrighted
 *    developer material**. Only use assets the client has written permission
 *    to publish, placed under /public/images/developments/. Never download
 *    them from a developer's website, and never redraw or approximate a floor
 *    plan.
 *  - Mark renderings with `isRendering: true` so the UI can say so. A buyer
 *    must never be shown an artist's impression as though it were built.
 *
 * See DEVELOPMENTS_DATA.md for the full guide and a worked template.
 * ---------------------------------------------------------------------------
 */
import type { Development } from './types';

export const curatedDevelopments: readonly Development[] = [];
