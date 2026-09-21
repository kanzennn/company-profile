# Content guide

Nearly all copy lives in `src/app/_lib/content/`, **split one file per page** so
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
specific file (`_lib/content/about`), so the import line itself tells you where
the copy lives.

### Exports by file

| File            | Exports                                                                              |
| --------------- | ------------------------------------------------------------------------------------ |
| `navigation.ts` | `serviceLinks`, `navLinks`, `contactLink`, `introRoutes`, `footerNav`, `footerSocial`, `footerLegal` |
| `home.ts`       | `stats` *(placeholder)*, `services`, `customWork`                                     |
| `about.ts`      | `aboutCover`, `aboutStory`, `aboutBand`, `timeline` *(placeholder)*, `howWeWork`, `team` *(placeholder)*, `aboutClosing` |
| `studio.ts`     | `studioCover`, `projects` *(placeholder)*, `studioNote`                               |
| `shared.ts`     | `clients` *(placeholder)*                                                             |

Copy **not** in these files: section headings and body paragraphs, which sit in
their section components (`hero.tsx`, `stats.tsx`, `services.tsx`,
`shared/clients.tsx`, `shared/contact-cta.tsx`).

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
> to the eight names in `clients` — they are not real clients.

### Services

```ts
{
  name: "Web Development",
  glyph: "web",                    // GlyphId — see shared/marks.tsx
  description: "…",
  href: "#contact",
  action: "Start a Project",
  tint: "#4f7cff",                 // card backdrop hue
}
```

`glyph` must be a key in the `paths` record in `_components/shared/marks.tsx`. To add a
new icon, add a path there and extend the `GlyphId` union in `content/types.ts`.

`tint` is the card's gradient hue. It's a raw hex rather than a token because
it's decorative per-card variation, not a semantic colour role.

## Adding a page

1. **Create the route**, and a folder for its sections under `_components/`.
   `studio/` is the smallest existing page to copy from:

```tsx
// src/app/careers/page.tsx
import type { Metadata } from "next";
import { CareersCover } from "../_components/careers/cover";
import { ContactCta } from "../_components/shared/contact-cta";

export const metadata: Metadata = {
  title: "Careers",                 // becomes "Careers — Kervzent Studio"
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

Sections used by this page only go in `_components/careers/`. Reach into
`_components/shared/` for anything already used elsewhere, and only move a
component there once a second page actually needs it.

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
which is what `home/hero-background.tsx` references.

Keep it **short and small** — see [Deployment](./deployment.md#the-hero-video)
for why the current file is a problem and how to compress it.

## Changing the favicon

Replace `src/app/favicon.ico`. It's a Next.js file convention — detected
automatically, no code reference. Restart the dev server afterwards; favicons
cache aggressively.
