# Photographs

Drop files in with **exactly these names** and they appear on the next build.
Nothing else needs changing — the paths are already wired up, and every slot
shows the neutral placeholder until the file is actually there.

`.jpg`, `.jpeg`, `.png`, `.webp` and `.avif` are all accepted, so the
extension below is a suggestion rather than a requirement. **The stem — the
part before the dot — must match.**

## team/

| File | What it is | Shape | Minimum | Preferred |
| --- | --- | --- | --- | --- |
| `martin-hoffman.jpg` | Martin's headshot | portrait **4:5** | 720 × 900 | 1440 × 1800 |
| `maryellen-closius.jpg` | MaryEllen's headshot | portrait **4:5** | 720 × 900 | 1440 × 1800 |
| `hoffman-closius-together.jpg` | The two of them together | landscape **4:3** | 1200 × 900 | 2400 × 1800 |

The two headshots fill **every** portrait slot on the site at once: the
homepage, the `/about/` previews, both profile page heroes, `/relocation/`,
and the article author card. The joint photograph fills the `/about/` hero.

Shoot or crop to the stated ratio. Slots are `object-fit: cover`, so a photo
at another shape is centre-cropped to fit and edges may be lost — a headshot
framed tight to the top of the head will lose it.

Alt text is generated from `src/config/site.ts`, so it always matches the
person's confirmed name and title. Nothing to write here.

## home/

| File | What it is | Shape | Minimum | Preferred |
| --- | --- | --- | --- | --- |
| `hero.jpg` | Homepage hero background | wide, **21:9-ish** | 2400 × 1400 | 3200 × 1800 |

This one sits behind white text with a dark overlay. A busy or bright image
fights the headline — an unhurried South Florida exterior with space in the
upper left works best, because that is where the heading sits.

## Before uploading

- **Licensed or client-owned only.** Never a stock photograph of people who
  are not Martin and MaryEllen. See `PROJECT_CONTEXT.md` §4.
- Compress before committing. A 6 MB headshot is a 6 MB download for every
  visitor on a phone; 200–400 KB is plenty at these sizes.
- Strip location EXIF from anything shot on a phone.
