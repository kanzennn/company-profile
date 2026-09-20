# Content guide

Nearly all copy lives in `src/app/_lib/content.ts`. Components read from it —
none hardcode text. Edit the data and every consumer updates.

## What lives where

| Export           | Feeds                                          |
| ---------------- | ---------------------------------------------- |
| `serviceLinks`   | Header top strip (Web / Mobile / AI)           |
| `navLinks`       | Header nav and mobile menu                     |
| `contactLink`    | Header and mobile-menu CTA                     |
| `introRoutes`    | Which routes run the intro animation           |
| `stats`          | Count-up figures in the studio section         |
| `services`       | The three service cards                        |
| `customWork`     | The fourth "Something Else" card               |
| `clients`        | Client logo wall                               |
| `footerNav`      | Footer navigation column                       |
| `footerSocial`   | Footer social column                           |
| `footerLegal`    | Footer bottom bar                              |

Copy **not** in this file: section headings and body paragraphs, which sit in
their section components (`hero.tsx`, `stats.tsx`, `services.tsx`,
`clients.tsx`, `contact-cta.tsx`), and the placeholder page titles, which are
props in `about/page.tsx` and `product/page.tsx`.

## Common edits

### Navigation

```ts
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Product", href: "/product" },
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
  glyph: "web",                    // GlyphId — see marks.tsx
  description: "…",
  href: "#contact",
  action: "Start a Project",
  tint: "#4f7cff",                 // card backdrop hue
}
```

`glyph` must be a key in the `paths` record in `_components/marks.tsx`. To add a
new icon, add a path there and extend the `GlyphId` union in `content.ts`.

`tint` is the card's gradient hue. It's a raw hex rather than a token because
it's decorative per-card variation, not a semantic colour role.

## Adding a page

1. **Create the route.** The fastest start is copying an existing placeholder:

```tsx
// src/app/careers/page.tsx
import type { Metadata } from "next";
import { UnderDevelopment } from "../_components/under-development";

export const metadata: Metadata = {
  title: "Careers",                 // becomes "Careers — Kervzent Studio"
  description: "…",
};

export default function CareersPage() {
  return <UnderDevelopment title="Join Kervzent" description="…" />;
}
```

2. **Register it in `introRoutes`** — this is the easy step to miss:

```ts
export const introRoutes = ["/", "/about", "/product", "/careers"];
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
which is what `hero-background.tsx` references.

Keep it **short and small** — see [Deployment](./deployment.md#the-hero-video)
for why the current file is a problem and how to compress it.

## Changing the favicon

Replace `src/app/favicon.ico`. It's a Next.js file convention — detected
automatically, no code reference. Restart the dev server afterwards; favicons
cache aggressively.
