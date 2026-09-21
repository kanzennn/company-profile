# Kervzent Studio — Documentation

Reference documentation for the Kervzent Studio marketing site. The project
[README](../README.md) covers install and scripts; these pages cover how the
thing actually works and why it is built the way it is.

## Contents

| Document                                 | Read it when                                                                 |
| ---------------------------------------- | ---------------------------------------------------------------------------- |
| [Architecture](./architecture.md)        | Finding your way around the codebase, or adding a route                      |
| [Design system](./design-system.md)      | Styling anything — tokens, type scale, colour roles                          |
| [Animations](./animations.md)            | Touching the intro, exit, scroll locks or hover effects                      |
| [Content guide](./content-guide.md)      | Changing copy, services, clients, or navigation                              |
| [Deployment](./deployment.md)            | Shipping, configuring the domain, or debugging a bad deploy                  |
| [Security](./security.md)                | Reviewing headers, CSP, or the audit findings                                |

## The short version

A **fully static** Next.js 16 marketing site. Every route prerenders to HTML at
build time — no database, no API routes, no server actions, no authentication.
Copy is split one file per page, styling runs entirely on Tailwind v4
theme tokens, and the distinctive part of the build is a coordinated page
intro/exit animation system driven by four `<html>` data attributes.

## Conventions worth knowing up front

**Content is data, not markup.** Copy lives in `src/app/_lib/content/`, one file per page, not
inside components. Edit it there and every consumer updates.

**Use semantic tokens, never raw values.** Write `bg-primary` and `text-display`
rather than `bg-[#ff5623]` or `text-[60px]`, so a token change propagates.

**`_`-prefixed folders are private.** `_components/` and `_lib/` are excluded
from routing by Next.js, which is why they can sit inside `src/app/` without
becoming URLs.

**Animation state lives on `<html>`.** Four data attributes coordinate the
intro, exit and scroll locks across components that never talk to each other
directly. [Animations](./animations.md) documents the protocol.

## Known trade-offs

These are deliberate, documented decisions rather than oversights:

- **CSP carries `script-src 'unsafe-inline'`** — required for the static
  prerender. [Rationale](./security.md#why-unsafe-inline-is-in-script-src).
- **Substitute fonts** — the design's specified typefaces are commercial
  licenses. [Details](./design-system.md#fonts).
- **`introRoutes` is a manual list** — new pages must be registered there.
  [Details](./content-guide.md#adding-a-page).
- **The hero video is ~59 MB** — the single largest performance liability in the
  project. [Details](./deployment.md#the-hero-video).
