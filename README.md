# Kervzent Studio

Marketing site for Kervzent Studio — a software studio building websites, mobile
applications, and AI systems.

## Stack

- **Next.js 16** (App Router, Turbopack) — fully static, every route prerendered
- **React 19**
- **Tailwind CSS v4** — design tokens declared in `@theme`, no config file
- **TypeScript**

## Getting started

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000.

## Scripts

| Command         | Purpose                      |
| --------------- | ---------------------------- |
| `npm run dev`   | Dev server with Fast Refresh |
| `npm run build` | Production build             |
| `npm start`     | Serve the production build    |
| `npm run lint`  | ESLint                       |

## Structure

```
src/app/
  _components/     UI components, grouped by page + shared/
  _lib/            Site content, copy, and URL resolution
  globals.css      Design tokens, keyframes, base styles
  layout.tsx       Root layout: fonts, metadata, header, footer
  page.tsx         Home — composes the five sections
  about/, studio/  About and Studio pages
docs/              Documentation
audit/             Security audit reports
public/videos/     Hero background video
```

## Documentation

Full reference lives in [`docs/`](./docs/README.md):

| Document                                      | Covers                                            |
| --------------------------------------------- | ------------------------------------------------- |
| [Architecture](./docs/architecture.md)        | Rendering model, file layout, component map       |
| [Design system](./docs/design-system.md)      | Colour, type scale, tokens, custom variants       |
| [Animations](./docs/animations.md)            | Page intro/exit, scroll locks, hover scramble     |
| [Content guide](./docs/content-guide.md)      | Editing copy, adding a page                       |
| [Deployment](./docs/deployment.md)            | Environment, domain, verification, launch checks  |
| [Security](./docs/security.md)                | Headers, CSP rationale, audit results             |

## Before going public

The site carries placeholder content and an oversized hero video. See the
[pre-launch checklist](./docs/deployment.md#pre-launch-checklist).
