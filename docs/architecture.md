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
src/
  components/           Shared across routes — PascalCase, one component per file
    ui/                 Primitives: Marks, ScrambleAction, CountUp, IntroBackdrop
    layout/             Site chrome: SiteHeader, SiteFooter
    sections/           Whole sections reused by more than one page
  lib/                  Non-component code — kebab-case
    content/            Site copy, one file per page
    site-url.ts         Absolute base URL resolution
  app/
    (home)/             Route group — the parentheses keep it out of the URL
      _components/      Home-only sections
      page.tsx          Home — composes the five sections
    about/
      _components/      /about-only sections
      page.tsx          About — story, timeline, team
    studio/
      _components/      /studio-only sections
      page.tsx          Studio — selected work
    contact/
      _components/      /contact-only sections
      page.tsx          Contact — the form
    globals.css         Design tokens, keyframes, base styles
    layout.tsx          Root layout: fonts, metadata, header, footer
    error.tsx           Route error boundary (client)
    not-found.tsx       404 page — also catches every unmatched URL
    robots.ts           Generated robots.txt
    sitemap.ts          Generated sitemap.xml
    favicon.ico         Browser tab icon (file convention)
public/
  images/logo.webp      Header and footer wordmark
  videos/               Hero background video
docs/                   This documentation
audit/                  Dated security audit reports
```

**A component lives next to the route that owns it until a second route needs
it.** At that point it moves under `src/components/`, into `ui/` if it is a
primitive, `layout/` if it is site chrome, `sections/` if it is a whole band of
a page. Nothing under `src/components/` may import from `src/app/`.

Home sits in the `(home)` [route group](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
so its sections get a folder of their own instead of sharing `app/_components`
with the app root. Parenthesised folders are dropped from the URL, so the route
is still `/` — `/home` is a 404.

Only `page.tsx` and its `_components/` moved into the group. `layout.tsx`,
`error.tsx`, `not-found.tsx`, `robots.ts` and `sitemap.ts` stay at the `app/`
root, because each of them is scoped to the segment it sits in: the root
`not-found.tsx` is what Next.js serves for **any** unmatched URL, and inside a
group it would only cover that group.

The `_components/` folders use Next.js
[private folders](https://nextjs.org/docs/app/getting-started/project-structure#private-folders).
The underscore excludes them from routing, which is what lets them sit beside
`page.tsx` without becoming URLs.

Imports cross folders through the `@/*` alias (`@/components/ui/Marks`,
`@/lib/content/about`) and stay relative within a route's own folder
(`./_components/AboutCover`), so an import line says at a glance whether it
reaches outside the route.

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
| `StudioWork`  | `#work`    | Six project cards — a screenshot behind a scrim where the project has one, a tinted gradient otherwise |

### Page sections (contact)

| Component     | Notes                                                        |
| ------------- | ------------------------------------------------------------ |
| `ContactForm` | Posts to the configured endpoint, falls back to `mailto` (client) |

`Stats`, `Clients` and `ContactCta` are reused across pages rather than
duplicated.

### Shared chrome

| Component     | Client? | Responsibility                                                     |
| ------------- | ------- | ------------------------------------------------------------------ |
| `SiteHeader`  | yes     | Nav, mobile menu, scroll-aware strip, exit transition, scroll lock  |
| `SiteFooter`  | no      | Navigation, social and legal links                                  |

### Building blocks

| Module              | Lives in              | Client? | Responsibility                                       |
| ------------------- | --------------------- | ------- | ---------------------------------------------------- |
| `use-intro-gate.ts` | `components/ui`       | yes     | Intro timing, scroll lock, `data-intro` flag         |
| `use-scramble.ts`   | `components/ui`       | yes     | Hover text scramble animation                        |
| `ScrambleAction`    | `components/ui`       | yes     | Polymorphic CTA — link, external link, or button     |
| `IntroBackdrop`     | `components/ui`       | yes     | Gradient backdrop for pages without video            |
| `CountUp`           | `components/ui`       | yes     | Number animation on scroll into view                 |
| `Marks.tsx`         | `components/ui`       | no      | `Glyph`, `CornerMark`, `CornerMarks` SVGs, plus `Wordmark` |
| `HeroBackground`    | `app/(home)/_components` | yes  | Video + gradient stack, runs the intro gate          |

`HeroBackground` is the odd one out: only the home hero uses it, so it stays
with home rather than in `src/components/`. That is the rule — a component used
by exactly one page belongs in that route's `_components/`, and is promoted only
once a second page needs it.

`Wordmark` is the exception inside `Marks.tsx`: the other exports are inline
SVG, but the wordmark is a `next/image` of `public/images/logo.webp`, because
the lockup is artwork rather than a shape. See
[Content guide](./content-guide.md#replacing-the-logo).

**Ten client modules**, everything else a Server Component:
`HeroBackground`, `AboutHowWeWork`, `ContactForm`, `error.tsx`, `SiteHeader`,
`CountUp`, `IntroBackdrop`, `ScrambleAction`, `use-intro-gate`, `use-scramble`.

## Data flow

Content flows one way, from a single module:

```
lib/content/*
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

### Marking the current page

`SiteHeader` compares `usePathname()` against each nav link and hands
`ScrambleAction` an `active` flag. The current link rests at the opacity the
others only reach on hover, so the nav reads as one scale rather than two, and
`active` sets `aria-current="page"` — without it the only cue is a colour
change, which a screen reader cannot report.

`/` is compared exactly; every other link also matches its nested paths, so a
`/studio/<project>` added later keeps Studio marked. Matching `/` by prefix
would light up every route at once.

The same flag drives the mobile menu. Contact is deliberately left out: it is
the filled CTA rather than one of the three, and dimming it elsewhere would read
as disabled.

## Accessibility baseline

Verified during development and worth preserving:

- One `<h1>` per page, no skipped heading levels
- Exactly one `header`, `main`, `footer` and `nav` landmark
- Skip-to-content link as the first focusable element
- Sections labelled via `aria-labelledby`
- Decorative SVG and scrambled glyph text marked `aria-hidden`, with the real
  label in an adjacent `sr-only` span
- Collapsed header strip marked `inert` so hidden links leave the tab order
- Current nav link marked `aria-current="page"`, not colour alone
- `:focus-visible` outline in `--color-primary` at 2px with 3px offset
- All motion collapses under `prefers-reduced-motion`
