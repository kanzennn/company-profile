# Security Audit Report — Kervzent Studio

|                |                                                                     |
| -------------- | ------------------------------------------------------------------- |
| **Target**     | `D:\Workplace\Code\Kervzent\kervzent-app`                            |
| **Revision**   | `eed53fd` (branch `main`, with uncommitted working-tree changes)     |
| **Date**       | `2026-09-20 18:40:33`                                                |
| **Standard**   | OWASP Top 10 (2025)                                                  |
| **Reviewer**   | Claude Code — `security-audit` skill                                 |
| **Scope**      | Full source tree (`src/`), config, dependencies, and served headers  |

## Executive summary

Kervzent Studio is a **fully static marketing site** — every route prerenders to
HTML, and the application has no server-side input handling whatsoever: no API
route handlers, no server actions, no middleware or proxy, no database, no
authentication, and no outbound HTTP calls. That eliminates the majority of the
OWASP Top 10 by construction, and the classes that remain came back clean: no
injection sinks, no secrets in source, and a dependency tree that `npm audit`
reports as having zero known vulnerabilities.

No critical, high, or exploitable issues were found. The three findings are all
**configuration hardening** on an otherwise sound codebase. The one worth acting
on before launch is **F-001: no security response headers are set** — most
notably the absence of a frame-ancestors policy, which leaves the site open to
being embedded in an attacker-controlled iframe (clickjacking). It is a
ten-line fix in `next.config.ts`.

## Findings by severity

| Severity    | Count |
| ----------- | ----- |
| 🔴 Critical | 0     |
| 🟠 High     | 0     |
| 🟡 Medium   | 1     |
| 🔵 Low      | 2     |
| ⚪ Info      | 0     |
| **Total**   | **3** |

## OWASP Top 10 (2025) coverage

Status: ✅ assessed, no issues · ⛔ issues found · ⚠️ needs manual follow-up · ➖ not applicable

| #   | Category                            | Status | Findings                                                                                          |
| --- | ----------------------------------- | ------ | ------------------------------------------------------------------------------------------------- |
| A01 | Broken Access Control               | ➖      | No protected resources, no server-side routes, no user-supplied identifiers. No SSRF surface — the app makes no outbound requests. |
| A02 | Security Misconfiguration           | ⛔      | F-001, F-002, F-003                                                                                |
| A03 | Software Supply Chain Failures      | ✅      | 3 direct runtime deps, all current. `npm audit`: 0 vulnerabilities. Lockfile committed.            |
| A04 | Cryptographic Failures              | ➖      | No secrets, credentials, hashing, tokens, or sensitive data handled. See note on `Math.random` below. |
| A05 | Injection                           | ✅      | No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, or `document.write`. No SQL/NoSQL/shell. All rendering goes through JSX auto-escaping. |
| A06 | Insecure Design                     | ➖      | No business logic, transactions, or abusable workflows. Site is presentational only.               |
| A07 | Authentication Failures             | ➖      | No authentication, sessions, or accounts exist.                                                     |
| A08 | Software or Data Integrity Failures | ✅      | No deserialization. No third-party runtime scripts — fonts are self-hosted via `next/font`, so no SRI gap. |
| A09 | Security Logging and Alerting       | ➖      | No security-relevant events to log (no auth, no privileged actions). Hosting-layer access logs are the appropriate control. |
| A10 | Mishandling of Exceptional Conditions | ✅    | `error.tsx` renders a generic message and does not expose the `error` object or stack trace. The intro gate's 6s fallback and cleanup paths fail safe. |

### Note on `Math.random` (not a finding)

`src/app/_components/use-scramble.ts:16` uses `Math.random()` to pick decorative
glyphs for the hover text effect. This is **not** a cryptographic use — no token,
identifier, or secret is derived from it — so a CSPRNG is not required here. Flagged
explicitly because automated scanners routinely report this pattern as a false
positive.

## Findings

### F-001 — No security response headers configured

|                |                                                          |
| -------------- | -------------------------------------------------------- |
| **Severity**   | 🟡 Medium                                                |
| **Confidence** | High                                                     |
| **OWASP**      | `A02:2025 Security Misconfiguration`                     |
| **CWE**        | `CWE-1021 Improper Restriction of Rendered UI Layers`, `CWE-693 Protection Mechanism Failure` |
| **Location**   | `next.config.ts:3-5`                                     |

**Description.** The Next.js configuration is empty, so the application ships
none of the standard defensive response headers. Confirmed against the running
server: the response contains no `Content-Security-Policy`,
`Strict-Transport-Security`, `X-Frame-Options` / `frame-ancestors`,
`X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`.

The most consequential gap is the missing frame-ancestors restriction. Without
it, any third-party page may embed this site in an iframe.

**Evidence.**

```text
// next.config.ts:1-7 — no headers() defined
const nextConfig: NextConfig = {
  /* config options here */
};

$ curl -sI http://localhost:3000
HTTP/1.1 200 OK
X-Powered-By: Next.js
Content-Type: text/html; charset=utf-8
(no CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
```

**Impact.** An attacker can embed the site in a transparent iframe on a page they
control and overlay their own UI — a clickjacking setup that can trick a visitor
into clicking the "Contact" call to action or a social link while believing they
are interacting with the attacker's page. Absent HSTS, a first visit over `http://`
on a hostile network is also open to an SSL-stripping downgrade. The remaining
headers (`X-Content-Type-Options`, `Referrer-Policy`) are defense-in-depth: low
impact on a static brochure site today, but they cost nothing and prevent whole
classes of issue if forms or embedded content are added later.

**Remediation.** Add a `headers()` block to `next.config.ts`. The CSP below suits
the current site (self-hosted fonts, no third-party scripts); widen it
deliberately if you later add analytics or embeds.

```ts
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'", // Tailwind/Next inject inline styles
      "img-src 'self' data: blob:",
      "media-src 'self'",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // also resolves F-003
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
```

Verify after deploying with `curl -sI https://<your-domain>` or
<https://securityheaders.com>. Note that `Strict-Transport-Security` only takes
effect over HTTPS and should not be added until TLS is live in production.

**References.** `OWASP A02:2025 Security Misconfiguration` · `CWE-1021` · `CWE-693` · [MDN: CSP frame-ancestors](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)

---

### F-002 — Public base URL silently falls back to `localhost` in production

|                |                                                                        |
| -------------- | ---------------------------------------------------------------------- |
| **Severity**   | 🔵 Low                                                                 |
| **Confidence** | High                                                                   |
| **OWASP**      | `A02:2025 Security Misconfiguration`                                   |
| **CWE**        | `CWE-1188 Insecure Default Initialization of Resource`                 |
| **Location**   | `src/app/layout.tsx:23-25`, `src/app/robots.ts:3`, `src/app/sitemap.ts:3` |

**Description.** Three modules derive the site's absolute base URL from
`NEXT_PUBLIC_SITE_URL` and fall back to `http://localhost:3000` when it is unset.
The fallback is silent — a production build with a missing environment variable
succeeds and emits `localhost` URLs into `metadataBase`, Open Graph tags,
`robots.txt`, and `sitemap.xml`. No `.env` file exists in the repository, so this
is the state a fresh deployment lands in by default.

**Evidence.**

```text
// src/app/robots.ts:3 (same pattern in sitemap.ts:3 and layout.tsx:24)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

$ curl -s http://localhost:3000/robots.txt
Sitemap: http://localhost:3000/sitemap.xml
```

**Impact.** Primarily a correctness and SEO defect — crawlers receive an
unreachable sitemap and social cards resolve against `localhost`. The security
dimension is the hardcoded `http://` scheme: any absolute URL emitted from the
fallback advertises a cleartext endpoint, and the failure is silent rather than
loud, so a misconfigured deploy is easy to miss.

**Remediation.** Fail the build instead of falling back, so a missing variable
surfaces at deploy time rather than in production output. Centralise it so the
three call sites cannot drift.

```ts
// src/app/_lib/site-url.ts
function resolveSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be set for production builds");
  }
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
```

Then import `siteUrl` in `layout.tsx`, `robots.ts`, and `sitemap.ts`. Set the
variable to the `https://` origin in the hosting provider's environment settings.

**References.** `OWASP A02:2025 Security Misconfiguration` · `CWE-1188`

---

### F-003 — `X-Powered-By` header discloses the framework

|                |                                                     |
| -------------- | --------------------------------------------------- |
| **Severity**   | 🔵 Low                                              |
| **Confidence** | High                                                |
| **OWASP**      | `A02:2025 Security Misconfiguration`                |
| **CWE**        | `CWE-200 Exposure of Sensitive Information to an Unauthorized Actor` |
| **Location**   | `next.config.ts:3-5` (absent `poweredByHeader: false`) |

**Description.** Next.js emits `X-Powered-By: Next.js` by default and the
configuration does not disable it. Confirmed on the running server.

**Evidence.**

```text
$ curl -sI http://localhost:3000 | grep -i x-powered-by
X-Powered-By: Next.js
```

**Impact.** Minor information disclosure. It tells an attacker which framework to
target, letting them skip fingerprinting and go straight to framework-specific
probes when a Next.js CVE is published. It does not expose a vulnerability on its
own — this is attack-surface hygiene, not an exploitable flaw.

**Remediation.** One line, included in the F-001 snippet above:

```ts
const nextConfig: NextConfig = {
  poweredByHeader: false,
};
```

**References.** `OWASP A02:2025 Security Misconfiguration` · `CWE-200`

---

## Scope & limitations

- **Reviewed:** the complete `src/` tree (15 components, 7 routes, 8 client
  components), `next.config.ts`, `package.json` / `package-lock.json`,
  `.gitignore`, `public/`, git-tracked file inventory, and live HTTP response
  headers from the running dev server. Every one of the ten OWASP 2025 categories
  was assessed.
- **Verified absent (not assumed):** route handlers, server actions, middleware,
  proxy, `"use server"` directives, outbound `fetch`/HTTP calls, XSS sinks,
  hardcoded secrets, and committed `.env` files — each confirmed by targeted search
  across the tree.
- **Sampled or not covered:**
  - **Transitive dependencies** were assessed via `npm audit` (0 vulnerabilities)
    rather than manual review of the full tree.
  - **Production hosting configuration** (TLS, CDN, WAF, bucket permissions,
    platform-level headers) is outside the repository and was not reviewed. Some
    hosts inject security headers at the edge, which may partially mitigate F-001 —
    verify against the deployed origin.
  - **CI/CD pipelines** — none present in the repository.
  - **`public/videos/hero-background.mp4`** was not inspected as a binary.
    Separately from security: it is ~59 MB, which is a significant performance
    liability, and its content licensing should be confirmed before publication.
- **Method:** static source-code review against the OWASP Top 10 (2025), tracing
  untrusted input from entry points to sinks; severity = exploitability × impact.
  Header findings were confirmed dynamically against the running server.
- **Not a substitute for:** dynamic testing (DAST), a manual penetration test, or
  a review of the production hosting environment. This review complements those.
