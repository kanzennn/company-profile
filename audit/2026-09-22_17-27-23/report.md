# Security Audit Report — Kervzent Studio company profile

| | |
|---|---|
| **Target** | `D:\Workplace\Code\Kervzent\company-profile` |
| **Revision** | `913c62e` on `main`, plus uncommitted work on the Studio section |
| **Date** | 2026-09-22 17:27:23 |
| **Standard** | OWASP Top 10 (2025) |
| **Reviewer** | Claude Code — `security-audit` skill |
| **Scope** | Whole application source, `next.config.ts`, dependency manifests, and everything served from `public/` |

## Executive summary

The application remains a hard target for its size: it is fully static, has no
route handlers, server actions, database, authentication or session state, and
ships no third-party script. Seven of the ten categories are simply not
reachable. Dependencies are current and `npm audit` reports zero advisories.

One real weakness was found, and it was introduced by a change made the same
day: the Studio section began accepting **client logos as SVG files dropped into
`public/`**. SVG is markup rather than a picture, and these files were served in
the site's own origin under a policy that allows `script-src 'unsafe-inline'`.
A logo carrying an inline `<script>` would have executed if anyone opened its
URL directly. The finding was fixed during this audit by narrowing the policy
for `.svg` responses; F-001 records it as **resolved**, with the verification.

Nothing else requires action. Two informational notes are recorded for the
record.

## Findings by severity

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 High | 0 |
| 🟡 Medium | 1 *(fixed during this audit)* |
| 🔵 Low | 0 |
| ⚪ Info | 2 |
| **Total** | **3** |

## OWASP Top 10 (2025) coverage

Status: ✅ assessed, no issues · ⛔ issues found · ⚠️ needs manual follow-up · ➖ not applicable

| # | Category | Status | Findings |
|---|----------|--------|----------|
| A01 | Broken Access Control | ➖ | No authenticated surface, no per-user data, no server-side fetch of a user-supplied URL. Nothing to control access to. |
| A02 | Security Misconfiguration | ⛔ | F-001 — SVG served as a document under the page policy. Fixed. |
| A03 | Software Supply Chain Failures | ✅ | `next@16.3.5`, `react@19.2.8`. `npm audit --omit=dev` → 0 vulnerabilities. Lockfile committed. |
| A04 | Cryptographic Failures | ✅ | No secrets in the repo or its history; only `.env.example`, which holds a public URL. No crypto in the app. |
| A05 | Injection | ✅ | No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or shell use anywhere. `mailto:` built with `encodeURIComponent` onto a constant recipient. |
| A06 | Insecure Design | ⚪ | F-003 — contact form has no client-side anti-automation. |
| A07 | Authentication Failures | ➖ | No authentication exists. |
| A08 | Software or Data Integrity Failures | ✅ | No external `<script>`/`<link>` in the build output — fonts are self-hosted by `next/font`. No deserialization. |
| A09 | Security Logging and Alerting Failures | ➖ | Static site with no server-side runtime of its own; nothing to log, nothing leaked to logs. |
| A10 | Mishandling of Exceptional Conditions | ✅ | F-002 — the one `catch` fails closed and leaks nothing; build-time config failure is fatal by design. |

## Findings

### F-001 — SVG logos were served as documents under the page's script policy

| | |
|---|---|
| **Severity** | 🟡 Medium |
| **Confidence** | High — reproduced against the running server |
| **Category** | A02 Security Misconfiguration (also A05 Injection — stored XSS) |
| **Location** | `next.config.ts:36-52`, `public/images/work/anima/logo.svg` |
| **Status** | ✅ **Fixed during this audit** |

#### Description

The Studio work cards gained support for a per-project `logo`, and the intended
workflow is that a client's own logo file is placed at
`public/images/work/<client>/logo.svg`. That file is served straight from
`public/`, and it therefore inherited the site-wide policy:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; …
Content-Type: image/svg+xml
```

SVG is an XML document format. Loaded through `<img>` — which is how the card
renders it — a browser will not run script inside it, so the page itself was
never at risk. But the file is also reachable at its own URL, and **navigating
to it directly renders it as a document in this origin**, where
`script-src 'unsafe-inline'` would allow an inline `<script>` in the file to run.

The risk is a property of the *workflow*, not of the file currently in the repo:
logos arrive from outside, and "it's just a logo" is exactly the assumption that
makes an SVG a useful delivery vehicle.

#### Evidence

Headers served for the logo before the fix:

```
$ curl -sD - -o /dev/null http://localhost:3000/images/work/anima/logo.svg
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; …
Content-Type: image/svg+xml
```

The file in the repo today is clean — a scan for `<script`, `onload=`,
`onerror=`, `xlink:href`, external `href`, `<foreignObject>` and `<use>` returns
zero matches. The exposure was in what the next file could contain.

#### Impact

A malicious or tampered logo would give an attacker script execution on the
studio's own domain, reachable by sending someone the logo's URL. There are no
accounts, cookies or sessions to steal, so this is not account takeover; the
realistic damage is a convincing phishing page or defacement hosted on the
brand's domain, which is a reputational problem rather than a data-loss one.
That ceiling is why this is rated Medium and not High.

#### Remediation *(applied)*

`.svg` responses now get their own policy, which overrides the site-wide one for
those paths only. Next.js resolves duplicate header keys last-match-wins, so the
narrower rule is listed second:

```ts
const svgDocumentHeaders = [
  {
    key: "Content-Security-Policy",
    value: "default-src 'none'; style-src 'unsafe-inline'; sandbox",
  },
];

async headers() {
  return [
    { source: "/:path*", headers: securityHeaders },
    // Last match wins per key, so this narrows the policy above for SVG only.
    { source: "/:path(.*\\.svg)", headers: svgDocumentHeaders },
  ];
}
```

`style-src` stays open because logos legitimately carry a `<style>` block and
stylesheets cannot execute.

#### Verification

```
.svg     → default-src 'none'; style-src 'unsafe-inline'; sandbox
page     → default-src 'self'; script-src 'self' 'unsafe-inline'; …   (unchanged)
.webp    → default-src 'self'; script-src 'self' 'unsafe-inline'; …   (unchanged)
```

Rendering is unaffected, as expected — a response CSP applies to a document
context, not to a subresource. Measured on `/studio` after the change: the logo
renders at 330 × 108.7 px with 444 ink pixels drawn to a canvas, and the console
is clean.

#### Reference

CWE-79 (Cross-site Scripting) · CWE-16 (Configuration) ·
OWASP A02:2025, A05:2025

---

### F-002 — Contact form failure path is silent by design

| | |
|---|---|
| **Severity** | ⚪ Info |
| **Confidence** | High |
| **Category** | A10 Mishandling of Exceptional Conditions |
| **Location** | `src/app/contact/_components/ContactForm.tsx:54-67` |

#### Description

The submit handler catches everything and sets a generic `error` status:

```tsx
} catch {
  setStatus("error");
}
```

This is recorded as a positive, not a defect. It **fails closed** — a failed
POST never reports success — and it surfaces no status code, endpoint or
exception text to the visitor. The empty binding makes clear the error object is
deliberately unused rather than accidentally swallowed.

The one trade-off is operational: a misconfigured endpoint produces a silent
stream of failures that nobody is alerted to. For a contact form on a static
brochure site this is an acceptable trade; it is worth remembering if the form
ever becomes a revenue path.

#### Reference

CWE-390 (Detection of Error Condition Without Action) · OWASP A10:2025

---

### F-003 — No anti-automation on the contact form

| | |
|---|---|
| **Severity** | ⚪ Info |
| **Confidence** | High |
| **Category** | A06 Insecure Design |
| **Location** | `src/app/contact/_components/ContactForm.tsx:25-67` |

#### Description

The form has no CAPTCHA, honeypot field, or client-side throttle. A script can
POST it repeatedly.

This is largely somebody else's problem by construction: the site is static and
owns no server, so submissions go to whatever third-party form service
`NEXT_PUBLIC_CONTACT_ENDPOINT` names, and rate limiting and spam filtering are
that service's job. The `disabled={status === "sending"}` on the submit button
prevents accidental double-submits but is not a security control.

The residual risk is inbox spam and burning the form service's quota. Worth
confirming that whichever service is chosen has spam protection enabled, rather
than adding a control here.

#### Reference

CWE-799 (Improper Control of Interaction Frequency) · OWASP A06:2025

---

## What was checked and found sound

Recorded so a future audit need not re-derive it:

- **No server-side attack surface.** No `route.ts`, no `"use server"`, no API
  handler, no middleware. All nine routes prerender to static HTML.
- **No injection sinks.** `dangerouslySetInnerHTML`, `innerHTML`, `eval`,
  `new Function`, `child_process` — none appear anywhere in `src/`.
- **No SSRF.** The single outbound `fetch` targets a build-time environment
  variable, not anything a visitor controls.
- **`mailto:` construction is safe.** Subject and body pass through
  `encodeURIComponent`; the recipient is a module constant, so header injection
  into the draft is not possible.
- **Environment variables are public by design.** Both are `NEXT_PUBLIC_`, so
  both are already inlined into the client bundle; neither is a secret.
- **Build-time config fails loudly.** An unparseable
  `NEXT_PUBLIC_CONTACT_ENDPOINT` throws during `next build` rather than silently
  widening the CSP.
- **Dev-only relaxations are gated.** `'unsafe-eval'` and `ws: wss:` are added
  only when `NODE_ENV === "development"`; `upgrade-insecure-requests` is added
  only when it is not.
- **Security headers are set and verified live:** CSP, `X-Content-Type-Options:
  nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS, and
  `poweredByHeader: false`.
- **No secret has ever been committed.** The full history contains only
  `.env.example`, whose single value is the public production URL.

## Scope and limitations

**Reviewed:** every file under `src/`, `next.config.ts`, `package.json`,
`package-lock.json`, and every file served from `public/`. Live response headers
were checked against the running development server for HTML, `.webp` and `.svg`
paths.

**Not covered:**

- This is a static source review. It does not replace dynamic testing (DAST) or
  a manual penetration test against the deployed site.
- The **third-party form service** behind `NEXT_PUBLIC_CONTACT_ENDPOINT` is
  outside this repository and was not assessed. Its handling of submitted
  personal data — storage, retention, access — is a live privacy question that
  this audit cannot answer.
- **Hosting configuration** was not reviewed. `next.config.ts` headers only take
  effect on a host that honours them; a static export served elsewhere would
  drop every header in this report, including the F-001 fix.
- Dependency findings rest on `npm audit` and the installed versions at the time
  of writing. Re-run before each release.
- `next dev` was running during the audit. The CSP values quoted from live
  responses therefore include the development-only relaxations noted above;
  production values were read from the source instead.
