# Deployment

## Build

```bash
npm run build   # production build
npm start       # serve the build locally
```

A healthy build lists every route as `○ (Static)`:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ○ /product
├ ○ /robots.txt
└ ○ /sitemap.xml
```

**If a route stops being static, treat it as a regression.** Something has
pulled in a dynamic dependency — reading cookies, headers or `searchParams` in a
Server Component, or adding middleware. Beyond losing the prerender, middleware
would also break the CSP approach described in
[Security](./security.md#why-unsafe-inline-is-in-script-src).

## Hosting requirements

Modest, but not "any static host":

- **Node-capable or Next-aware hosting.** The response headers in
  `next.config.ts` are applied by the Next.js server. On a pure static-file CDN
  you must reproduce them in that platform's own header configuration, or they
  simply won't be sent.
- **HTTPS**, so HSTS takes effect — browsers ignore it over plain HTTP.

## Environment

| Variable               | Required | Purpose                                             |
| ---------------------- | -------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | Absolute base URL for metadata, Open Graph, sitemap |

Resolved in `src/app/_lib/site-url.ts`:

```
production   → https://kervzent.kanzen.my.id
development  → http://localhost:3000
env var set  → overrides both
```

Production defaults to the real domain rather than localhost, so a deploy that
forgets the variable still emits correct, reachable URLs instead of silently
publishing `http://localhost:3000` into your sitemap and social cards.

**Set it explicitly on preview and staging deployments.** Otherwise their
sitemaps and canonical URLs point at the production domain.

`.env.example` documents the variable. It is the one `.env*` file committed —
`.gitignore` carries a `!.env.example` exception for it.

## Domain

`kervzent.kanzen.my.id`

If this changes, update `PRODUCTION_URL` in `_lib/site-url.ts` and the URL in
`.env.example`. Nothing else references the domain.

## Post-deploy verification

```bash
curl -sI https://kervzent.kanzen.my.id
```

Confirm:

- [ ] `Content-Security-Policy` present, with `frame-ancestors 'none'`
- [ ] `Strict-Transport-Security` present
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` present
- [ ] **No** `X-Powered-By`

Then:

```bash
curl -s https://kervzent.kanzen.my.id/robots.txt   # sitemap points at the live domain
curl -s https://kervzent.kanzen.my.id/sitemap.xml  # all URLs use https + real domain
```

Some platforms inject or strip headers at the edge, so **re-verify after any
hosting change** — not just the first deploy. <https://securityheaders.com> is a
convenient second opinion.

Also worth checking by hand, since automated checks won't catch them: the intro
animation runs, the nav appears after it, and navigation between pages plays the
exit transition.

## The hero video

`public/videos/hero-background.mp4` is roughly **59 MB** — the single largest
performance liability in the project, and worth fixing before launch.

It loads at the very top of the page, so it directly hurts Largest Contentful
Paint and burns mobile data. It's also 3 minutes long, which no visitor will
ever see the end of, and it starves the main thread enough to interfere with the
page's own animation timing.

A background loop wants roughly **8–15 seconds** and **under 5 MB**:

```bash
ffmpeg -i public/videos/hero-background.mp4 \
  -t 12 -vf scale=1600:-2 -an \
  -c:v libx264 -crf 30 -preset slow -movflags +faststart \
  public/videos/hero-background.mp4
```

Trims to 12s, drops the audio track (it's muted anyway), and enables fast-start
so playback begins before the file finishes downloading.

The intro waits on the video's `canplay` event, so a smaller file also makes the
whole opening sequence noticeably snappier.

### Committing it to git

At 59 MB this is also a repository problem. Git history is permanent — removing
a large blob later means rewriting history for everyone, and GitHub warns above
50 MB and hard-blocks at 100 MB. Compress it first, or use Git LFS, or host it
externally and reference the URL.

Confirm you hold the rights to any footage you ship.

## Pre-launch checklist

- [ ] Hero video compressed
- [ ] Placeholder `stats` figures replaced with real numbers
- [ ] Placeholder `clients` names replaced or the section removed
- [ ] LinkedIn and X URLs filled in (`footerSocial`)
- [ ] `hello@kervzent.com` in `contact-cta.tsx` is a real, monitored mailbox
- [ ] Privacy Policy and Terms links resolved or removed (`footerLegal`)
- [ ] `favicon.ico` replaced with Kervzent branding
- [ ] Open Graph image added (drop `opengraph-image.png` in `src/app/`)
- [ ] Headers verified against the live domain
