# Content guide

Nearly all copy lives in `src/lib/content/`, **split one file per page** so
it's obvious which one to open. Components read from it — none hardcode text.

## Which file to edit

| File             | Covers                                                     |
| ---------------- | ---------------------------------------------------------- |
| `navigation.ts`  | Header nav, top strip, contact link, footer, `introRoutes` |
| `home.ts`        | Stats, the three service cards, the "Something Else" card  |
| `about.ts`       | Everything on `/about`                                      |
| `studio.ts`      | Everything on `/studio`                                     |
| `contact.ts`     | Everything on `/contact`, including the form fields        |
| `shared.ts`      | Content reused on more than one page (the client wall)     |
| `types.ts`       | The `GlyphId` union                                         |

There is deliberately **no barrel `index.ts`** — components import from the
specific file (`@/lib/content/about`), so the import line itself tells you where
the copy lives.

### Exports by file

| File            | Exports                                                                              |
| --------------- | ------------------------------------------------------------------------------------ |
| `navigation.ts` | `serviceLinks`, `navLinks`, `contactLink`, `introRoutes`, `footerNav`, `footerSocial`, `footerLegal` |
| `home.ts`       | `stats` *(placeholder)*, `services`, `customWork`                                     |
| `about.ts`      | `aboutCover`, `aboutStory`, `aboutBand`, `timeline` *(placeholder)*, `howWeWork`, `team` *(placeholder)*, `aboutClosing` |
| `studio.ts`     | `studioCover`, `projects` *(Anima real, five placeholders)*, `studioNote`             |
| `shared.ts`     | `clients` *(Anima real, eight placeholders)*                                          |

Copy **not** in these files: section headings and body paragraphs, which sit in
their section components (`Hero.tsx`, `Services.tsx`, `Stats.tsx`,
`Clients.tsx`, `ContactCta.tsx`).

## Common edits

### Navigation

```ts
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Studio", href: "/studio" },
];
```

`footerNav` spreads `navLinks` and appends `contactLink`, so the footer stays in
sync automatically — edit `navLinks` only.

Use `/#section` rather than `#section` for anchors, so they resolve from any
page rather than only from home.

### Social links

```ts
export const footerSocial = [
  { label: "LinkedIn", href: "#" },      // placeholder
  { label: "X", href: "#" },             // placeholder
  { label: "GitHub", href: "https://github.com/Kervzent-Studio" },
];
```

Any `href` starting with `http` automatically renders as
`<a target="_blank" rel="noopener noreferrer">`. Replace the `#` placeholders
with real URLs and they pick that up with no code change.

### Stats

```ts
export const stats = [
  { to: 120, decimals: 0, suffix: "+", label: "Projects Delivered" },
];
```

> **These are placeholder figures.** They were invented to fill the layout.
> Replace them with real numbers before the site goes public. The same applies
> to the placeholder names in `clients` — only Anima is a real client.

### Services

```ts
{
  name: "Web Development",
  glyph: "web",                    // GlyphId — see components/ui/Marks.tsx
  description: "…",
  href: "#contact",
  action: "Start a Project",
  tint: "#4f7cff",                 // card backdrop hue
}
```

`glyph` must be a key in the `paths` record in `components/ui/Marks.tsx`. To add a
new icon, add a path there and extend the `GlyphId` union in `content/types.ts`.

`tint` is the card's gradient hue. It's a raw hex rather than a token because
it's decorative per-card variation, not a semantic colour role.

## Adding a project to Selected Work

A project in `studio.ts` needs only the first five fields. The last three turn
the card from a tinted placeholder into real work:

```ts
{
  name: "Anima",
  practice: "Web Development",     // Web Development | Mobile Apps | AI Development
  glyph: "web",                    // used only when there is no `logo`
  description: "A marketing landing page for a motion design tool, …",
  tint: "#4f7cff",                 // used only when there is no `image`
  image: "/images/work/anima/screenshot.webp",
  logo: "/images/work/anima/logo.svg",
  logoIncludesName: true,
}
```

One folder per project keeps the pair together: `public/images/work/<project>/`.

**`image` — the screenshot.** WebP, and wide enough for a full-width card on a
tablet: the cards go to a single column below `lg`, so a card can be ~970 CSS px
and wants roughly 1900px of source to stay sharp on a retina screen. It sits
behind a 6px blur and a dark scrim, so fine detail is lost anyway — legibility
of the card's own text matters more than legibility of the screenshot.

> **The scrim strength is a live trade-off.** It currently sits at 50%, which
> keeps the screenshot clearly visible but leaves the practice label and the
> description at 2.43:1 and 2.75:1 against the brightest parts of a light
> screenshot — under the 4.5:1 WCAG AA floor. 75% is the lowest value that
> clears it for both. Raising the text opacity does not help: even pure white
> only reaches 3.86:1 at a 50% scrim, because the scrim is what binds. Prefer a
> darker screenshot if you want the image to stay prominent.

**`logo` — the client's mark.** SVG, and **white on transparent**. The card is
near-black; a logo in brand colours is usually dark and simply disappears. SVG
also beats a raster here on both counts that matter — the Anima lockup is 2.7 KB
gzipped against 18 KB for a WebP of the same mark, and stays sharp at any size.
Convert any wordmark to outlines: an SVG loaded through `<img>` cannot fetch a
web font, so `<text>` renders in whatever the visitor happens to have installed.

**`logoIncludesName`** — set it when the logo is a lockup that already spells the
name out. The card then stops printing the name below it. The heading is hidden
rather than removed, so screen readers still announce it.

Leave `image` or `logo` out and the card falls back to the gradient or the
practice glyph, which is what lets real work and placeholders share one grid.

## Adding a page

1. **Create the route**, with its own `_components/` folder beside `page.tsx`.
   `studio/` is the smallest existing page to copy from:

```tsx
// src/app/careers/page.tsx
import type { Metadata } from "next";
import { CareersCover } from "./_components/CareersCover";
import { ContactCta } from "@/components/sections/ContactCta";

export const metadata: Metadata = {
  title: "Careers",                 // becomes "Careers | Kervzent Studio"
  description: "…",
};

export default function CareersPage() {
  return (
    <main id="main" className="flex flex-1 flex-col gap-40 max-lg:gap-20">
      <CareersCover />
      <ContactCta />
    </main>
  );
}
```

Sections used by this page only go in `careers/_components/`, named after the
component they export. Reach into `@/components/` for anything already used
elsewhere, and only move a component there once a second page actually needs
it.

2. **Register it in `introRoutes`** — this is the easy step to miss:

```ts
export const introRoutes = ["/", "/about", "/studio", "/careers"];
```

Forgetting it doesn't break the page. It just won't run the intro, and the
header will show its nav immediately instead of revealing it. That's the
deliberate fallback for `error` and `not-found`, which stay off the list on
purpose — the nav is hidden until `data-intro="ready"`, so a route with no intro
gate would otherwise never show navigation at all.

3. **Add it to `navLinks`** if it belongs in the header.

4. **Add it to `sitemap.ts`**:

```ts
{ url: `${siteUrl}/careers`, lastModified, changeFrequency: "monthly", priority: 0.8 }
```

### Checklist

- [ ] `page.tsx` with `metadata` (title only — the template appends the suffix)
- [ ] Route added to `introRoutes`
- [ ] Added to `navLinks` if it should appear in navigation
- [ ] Added to `sitemap.ts`
- [ ] `npm run build` passes and the route shows as `○ (Static)`

## Metadata

`layout.tsx` sets a title template, so pages supply only their own title:

```ts
title: { default: title, template: `%s — ${siteName}` }
```

Open Graph and Twitter card tags are set once in the root layout and inherited.
Absolute URLs resolve through `metadataBase` — see [Deployment](./deployment.md).

## Replacing the hero video

Drop the file at `public/videos/hero-background.mp4`. Anything in `public/` is
served from the site root, so that path becomes `/videos/hero-background.mp4`,
which is what `app/(home)/_components/HeroBackground.tsx` references.

Keep it **short and small** — see [Deployment](./deployment.md#the-hero-video)
for why the current file is a problem and how to compress it.

## Replacing the logo

The header and footer wordmark is `public/images/logo.webp`, rendered by
`Wordmark` in `components/ui/Marks.tsx`. Three things to get right:

**Crop it to the artwork.** Export padding becomes dead space the CSS cannot
see: the rendered height is stated directly, so any transparent margin pushes
the logo off the header's content edge and below its optical centre. The
current file is trimmed to exactly its ink.

**Ship it white on transparent.** The site has one surface — `#000000`, no light
mode — so a single white lockup covers every placement. There is no dark
variant to keep in sync.

**Size it by what renders, not by the file.** `width`/`height` on the `<Image>`
are the intrinsic ratio Next.js uses to reserve space *and* to pick the srcset
widths, so they carry the rendered size (125×32), not the source's. Set them to
the source's dimensions and the optimiser ships a full-width image for a 125px
logo.

Then adjust the rendered height in `Wordmark` — `h-[26px]` on mobile,
`lg:h-8` from the `lg` breakpoint up.

## Changing the favicon

Replace `src/app/favicon.ico`. It's a Next.js file convention — detected
automatically, no code reference. Restart the dev server afterwards; favicons
cache aggressively.
