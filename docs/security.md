# Security

## Posture

The site has an unusually small attack surface, and that is structural rather
than incidental: **every route is statically prerendered and there is no
server-side request handling at all** — no route handlers, no server actions, no
middleware or proxy, no database, no authentication, no outbound HTTP calls.

Most of the OWASP Top 10 therefore does not apply by construction. The classes
that do apply came back clean: no injection sinks, no secrets in source, and a
dependency tree with zero known vulnerabilities.

The most valuable thing you can do to preserve this is **keep the site static**.
Adding an API route, a form handler, or middleware reintroduces whole categories
of risk that are currently absent.

## Response headers

Configured in `next.config.ts`, applied to every route via `headers()`.

| Header                      | Value                                                  |
| --------------------------- | ------------------------------------------------------ |
| `Content-Security-Policy`   | See below — environment-aware                          |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains`                  |
| `X-Content-Type-Options`    | `nosniff`                                              |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                      |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| `X-Powered-By`              | **disabled** via `poweredByHeader: false`              |

### The CSP

```
default-src 'self'
script-src 'self' 'unsafe-inline'      [+ 'unsafe-eval' in development]
style-src 'self' 'unsafe-inline'
img-src 'self' data: blob:
media-src 'self'
font-src 'self'
connect-src 'self'                     [+ ws: wss: in development]
frame-ancestors 'none'
base-uri 'self'
form-action 'self'
object-src 'none'
upgrade-insecure-requests              [production only]
```

**It is environment-aware, and it has to be.** Next.js development needs
`'unsafe-eval'` for HMR and websocket origins for Fast Refresh; a strict policy
breaks the dev server outright. `upgrade-insecure-requests` is production-only
because it would try to upgrade `http://localhost` during development.

`font-src 'self'` works because `next/font` self-hosts the Google fonts at build
time — no runtime third-party request. If you ever switch to a CDN font link,
this directive must change.

### Why `unsafe-inline` is in `script-src`

This is the policy's real weakness and worth understanding rather than
inheriting blindly.

The App Router inlines RSC payload and bootstrap scripts into the HTML. The
correct fix is a nonce-based CSP — but nonces must be generated per request,
which requires middleware, which forces **every route to render dynamically**.
That would discard the static prerender the whole site is built on.

The trade-off was accepted because:

- `'unsafe-inline'` weakens CSP's **XSS** protection specifically
- This site has no user input, no forms, and no XSS sinks — audited and
  confirmed: no `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or
  `document.write` anywhere
- `frame-ancestors 'none'` — the directive that actually closes the clickjacking
  gap — is completely unaffected by it

**Revisit this if the site ever accepts user input**, renders user-generated
content, or embeds third-party scripts. At that point the XSS arm of the policy
starts carrying real weight and the dynamic-rendering cost may be worth paying.

### HSTS and `preload`

`preload` is deliberately omitted. Submitting to the HSTS preload list is a
long-lived commitment binding the apex domain *and every subdomain* to HTTPS,
and it is slow to reverse. Opt into it consciously once the domain is settled,
not by default.

HSTS is inert until TLS is live — browsers ignore the header over plain HTTP.

## Audit

A full OWASP Top 10 (2025) audit lives in `audit/<timestamp>/report.md`.

**Result:** no critical, high, or exploitable findings. Three configuration
findings — one medium, two low — all since fixed:

| ID    | Finding                                        | Status                                   |
| ----- | ---------------------------------------------- | ---------------------------------------- |
| F-001 | No security response headers                   | Fixed — `next.config.ts`                 |
| F-002 | Base URL fell back to `localhost` in production| Fixed — `lib/site-url.ts`               |
| F-003 | `X-Powered-By` disclosed the framework         | Fixed — `poweredByHeader: false`         |

### Deliberately not a finding

`use-scramble.ts` uses `Math.random()` to pick decorative glyphs for the hover
effect. No token, identifier, or secret derives from it, so a CSPRNG is not
warranted. Recorded here because scanners flag the pattern reflexively and
someone will eventually re-raise it.

## Practices to maintain

**External links.** `ScrambleAction` applies `target="_blank"` with
`rel="noopener noreferrer"` automatically to any `http`-prefixed href. Keep
routing external links through it rather than hand-writing anchors.

**Secrets.** `.gitignore` covers `.env*` with a single `!.env.example` exception.
That file must never hold a real secret — only `NEXT_PUBLIC_*` values, which are
public by definition since they're inlined into the client bundle. Never put a
secret behind a `NEXT_PUBLIC_` prefix.

**Error output.** `error.tsx` renders a generic message and does **not** expose
the `error` object or stack trace. If you add error reporting, send the object
to your logging service — don't render it.

**Dependencies.** Run `npm audit` periodically. The tree is small (three runtime
dependencies), which keeps supply-chain exposure low — worth preserving.

## Re-auditing

Re-run the audit after any change that adds server-side behaviour — an API
route, a form, authentication, a third-party script, or a CMS integration. Each
of those reopens OWASP categories that are currently not applicable.
