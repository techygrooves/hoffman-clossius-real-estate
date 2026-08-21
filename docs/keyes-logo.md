# Brand assets

## Keyes logo — REQUIRED, NOT YET SUPPLIED

Drop the **official, unmodified** Keyes logo files here:

| File | Used for |
| --- | --- |
| `keyes-logo.svg` | Light backgrounds — header, mobile drawer |
| `keyes-logo-white.svg` | Evergreen/dark backgrounds — footer |

`.png` and `.webp` are accepted as fallbacks if no vector file is available;
`src/components/layout/KeyesLogo.astro` resolves `.svg` → `.png` → `.webp` at
build time and switches from the visible placeholder to the real asset
automatically. No code change is needed.

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
