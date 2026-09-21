# Architecture

## Rendering model

Every route prerenders to static HTML at build time:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ○ /studio
├ ○ /robots.txt
└ ○ /sitemap.xml

○  (Static)  prerendered as static content
```

There is no server-side request handling anywhere in the project — no route
handlers, no server actions, no middleware, no proxy, no database. The server's
only job is serving files and response headers.

This shapes two things worth keeping in mind:

- **It can be hosted anywhere** that serves static files, though you need a host
  that honours `next.config.ts` headers (see [Deployment](./deployment.md)).
- **Don't casually add anything that forces dynamic rendering.** Reading
  cookies, headers or `searchParams` in a Server Component, or adding
  middleware, silently converts routes to dynamic. That would also break the
  nonce-free CSP — see [Security](./security.md#why-unsafe-inline-is-in-script-src).

## File layout

```
src/app/
  _components/          UI components (private — not routable)
    shared/             Used by more than one page, plus site chrome
    home/               Home-only sections
    about/              /about-only sections
    studio/             /studio-only sections
    contact/            /contact-only sections
  _lib/
    content/            Site copy, one file per page
    site-url.ts         Absolute base URL resolution
  globals.css           Design tokens, keyframes, base styles
  layout.tsx            Root layout: fonts, metadata, header, footer
  page.tsx              Home — composes the five sections
  about/page.tsx        About — story, timeline, team
  studio/page.tsx       Studio — selected work
  error.tsx             Route error boundary (client)
  not-found.tsx         404 page
  robots.ts             Generated robots.txt
  sitemap.ts            Generated sitemap.xml
  favicon.ico           Browser tab icon (file convention)
public/videos/          Hero background video
docs/                   This documentation
audit/                  Dated security audit reports
```

`_components/` and `_lib/` use Next.js
[private folders](https://nextjs.org/docs/app/getting-started/project-structure#private-folders).
The underscore excludes them from routing, which is what lets them live inside
`src/app/` without becoming URLs.

## Layout composition

`layout.tsx` owns the shared chrome. Each page supplies only its own `<main>`:

```
<html>
  <body>
    skip link
    <SiteHeader />      ← fixed, persists across navigation
    {children}          ← the page's own <main>
    <SiteFooter />
  </body>
</html>
```

The header and footer living in the layout is load-bearing: `SiteHeader` holds
the exit-transition state, and because it never unmounts during client-side
navigation, that state survives the route change. See
[Animations](./animations.md#the-exit).

## Component map

### Page sections (home)

| Component       | Section id  | Notes                                                  |
| --------------- | ----------- | ------------------------------------------------------ |
| `Hero`          | `#top`      | Full-viewport, video background, runs the intro         |
| `Stats`         | `#studio`   | Three count-up figures                                  |
| `Services`      | `#services` | 2×2 grid — three services plus a contact card           |
| `Clients`       | `#clients`  | Logo wall                                               |
| `ContactCta`    | `#contact`  | Closing call to action                                  |

### Page sections (about)

| Component          | Section id            | Notes                                       |
| ------------------ | --------------------- | ------------------------------------------- |
| `AboutCover`       | `#cover`              | Same treatment as the home hero              |
| `AboutStory`       | `#how-we-got-here`, `#growth` | Two-column heading ∣ body blocks     |
| `AboutBand`        | —                     | Reusable full-bleed `aspect-8/3` banner      |
| `AboutTimeline`    | `#timeline`           | Milestone list                               |
| `AboutHowWeWork`   | `#how-we-work`        | Pinned, scroll-stepped panel (client)        |
| `AboutTeam`        | `#team`               | Monogram grid                                |
| `AboutClosing`     | `#looking-ahead`      | Closing band with CTA                        |

### Page sections (studio)

| Component     | Section id | Notes                                       |
| ------------- | ---------- | ------------------------------------------- |
| `StudioCover` | `#cover`   | Same treatment as the home hero              |
| `StudioWork`  | `#work`    | Six project cards, tinted gradient backdrops |

`Stats`, `Clients` and `ContactCta` are reused across pages rather than
duplicated.

### Shared chrome

| Component     | Client? | Responsibility                                                     |
| ------------- | ------- | ------------------------------------------------------------------ |
| `SiteHeader`  | yes     | Nav, mobile menu, scroll-aware strip, exit transition, scroll lock  |
| `SiteFooter`  | no      | Navigation, social and legal links                                  |

### Building blocks

| Module              | Client? | Responsibility                                            |
| ------------------- | ------- | --------------------------------------------------------- |
| `use-intro-gate.ts` | yes     | Intro timing, scroll lock, `data-intro` flag              |
| `use-scramble.ts`   | yes     | Hover text scramble animation                             |
| `scramble-action`   | yes     | Polymorphic CTA — link, external link, or button          |
| `hero-background`   | yes     | Video + gradient stack, runs the intro gate               |
| `intro-backdrop`    | yes     | Gradient backdrop for pages without video                 |
| `count-up`          | yes     | Number animation on scroll into view                      |
| `marks.tsx`         | no      | `Glyph`, `Wordmark`, `CornerMark`, `CornerMarks` SVGs     |

All of the above live in `_components/shared/`. A component used by exactly one
page belongs in that page's folder; promote it to `shared/` only once a second
page needs it.

Nine client modules total (including `error.tsx` and `about-how-we-work`).
Everything else is a Server Component.

## Data flow

Content flows one way, from a single module:

```
_lib/content/*
      │
      ├── SiteHeader      navLinks, serviceLinks, contactLink, introRoutes
      ├── SiteFooter      footerNav, footerSocial, footerLegal
      ├── Stats           stats
      ├── Services        services, customWork
      └── Clients         clients
```

No component hardcodes copy. See [Content guide](./content-guide.md).

## Routing and navigation

Internal navigation goes through `next/link`, wrapped by `ScrambleAction` so
every link gets the hover effect and the correct element type:

| `href` pattern        | Renders                                        |
| --------------------- | ---------------------------------------------- |
| `/about`, `/`         | `next/link`                                    |
| `https://…`           | `<a target="_blank" rel="noopener noreferrer">` |
| `mailto:…`            | `<a>`                                          |
| *(omitted)*           | `<button type="button">`                       |

Anchors use the `/#section` form rather than `#section` so they resolve from any
page, not just home.

## Accessibility baseline

Verified during development and worth preserving:

- One `<h1>` per page, no skipped heading levels
- Exactly one `header`, `main`, `footer` and `nav` landmark
- Skip-to-content link as the first focusable element
- Sections labelled via `aria-labelledby`
- Decorative SVG and scrambled glyph text marked `aria-hidden`, with the real
  label in an adjacent `sr-only` span
- Collapsed header strip marked `inert` so hidden links leave the tab order
- `:focus-visible` outline in `--color-primary` at 2px with 3px offset
- All motion collapses under `prefers-reduced-motion`
