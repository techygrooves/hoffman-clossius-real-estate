# Brand assets

## Keyes logo — REQUIRED, NOT YET SUPPLIED

Drop the **official, unmodified** Keyes logo files here:

| File | Used for |
| --- | --- |
| `keyes-logo.svg` | Light backgrounds — header, mobile drawer |
| `keyes-logo-white.svg` | Evergreen/dark backgrounds — footer |

`.png` and `.webp` are accepted as fallbacks if no vector file is available;
`src/components/layout/KeyesLogo.astro` resolves `.svg` → `.png` → `.webp` at
build time and switches from the typographic fallback to the real asset
automatically. No code change is needed.

### What is showing in the meantime

Since 2026-09-27, at the client's instruction, the slots show **"Keyes®" set as
type** in the site's own serif (`KeyesWordmark.astro`) rather than the previous
dashed placeholder box.

It sets the **name**; it does not trace, imitate or approximate the
brush-script mark. A poor reproduction of a trademark is worse than clean type.

Two things worth doing:

1. Supply the real artwork above — it replaces the wordmark everywhere, with no
   code change.
2. Check with Keyes marketing that a typographic treatment is acceptable in the
   interim. Most brokerages require their own supplied artwork, and supplying
   it resolves the question outright.

After adding the files, update `brokerageBrand.width` / `.height` in
`src/config/site.ts` to the asset's true intrinsic dimensions so the rendered
aspect ratio is exact.

### Rules

- Display the asset **unmodified**: no recolouring, redrawing, stretching,
  cropping, rotation, drop shadows or decorative frames. Only the rendered
  height varies; aspect ratio is always preserved.
- Never place explanatory relationship wording next to it
  ("affiliated with", "backed by", "part of", "working under", …).

## Site favicon

`/public/favicon.svg` is the Hoffman & Closius monogram — this is our own
site mark, unrelated to the Keyes asset above.
