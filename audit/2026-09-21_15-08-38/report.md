# Security Audit Report — Kervzent Studio (re-audit)

|              |                                                                        |
| ------------ | ---------------------------------------------------------------------- |
| **Target**   | `D:\Workplace\Code\Kervzent\kervzent-app`                              |
| **Revision** | `0ff750d` (branch `main`, with uncommitted working-tree changes)        |
| **Date**     | `2026-09-21 15:08:38`                                                  |
| **Standard** | OWASP Top 10 (2025)                                                    |
| **Reviewer** | Claude Code — `security-audit` skill                                   |
| **Scope**    | Full source tree, config, dependencies, served headers                 |
| **Previous** | `audit/2026-09-20_18-40-33` — 3 findings, all confirmed still fixed    |

## Executive summary

The site remains **fully static** — no route handlers, no server actions, no
middleware, no database. The three findings from the previous audit are all
confirmed still fixed: security headers serve on every route, `X-Powered-By` is
gone, and the base URL no longer falls back to localhost in production.

The meaningful change since then is the **contact form** — the first user input
this project has ever accepted. It is implemented client-side and posts to a
third-party endpoint, which keeps the static guarantee intact and avoids
reopening the server-side categories. The riskier parts were handled correctly:
the `mailto:` fallback encodes its inputs, so header injection is not possible,
and the endpoint comes from build-time config rather than user input, so there
is no SSRF path.

Three findings, none critical or high. The one to act on first is **F-001**: the
Content-Security-Policy restricts `connect-src` to `'self'`, which will **block
the form's POST** the moment you configure a real endpoint. It is latent today
only because no endpoint is set yet.

## Findings by severity

| Severity    | Count |
| ----------- | ----- |
| 🔴 Critical | 0     |
| 🟠 High     | 0     |
| 🟡 Medium   | 2     |
| 🔵 Low      | 1     |
| ⚪ Info      | 0     |
| **Total**   | **3** |

## OWASP Top 10 (2025) coverage

Status: ✅ assessed, no issues · ⛔ issues found · ⚠️ needs manual follow-up · ➖ not applicable

| #   | Category                              | Status | Findings                                                                                     |
| --- | ------------------------------------- | ------ | -------------------------------------------------------------------------------------------- |
| A01 | Broken Access Control                 | ➖      | No protected resources or server-side routes. No SSRF: the only outbound call targets a build-time env value, and runs in the visitor's own browser. |
| A02 | Security Misconfiguration             | ⛔      | F-001                                                                                         |
| A03 | Software Supply Chain Failures        | ✅      | 3 direct runtime deps, unchanged. `npm audit`: 0 vulnerabilities. Lockfile committed.         |
| A04 | Cryptographic Failures                | ⛔      | F-003                                                                                         |
| A05 | Injection                             | ✅      | No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or `new Function`. `mailto:` construction verified safe — see note below. |
| A06 | Insecure Design                       | ⛔      | F-002                                                                                         |
| A07 | Authentication Failures               | ➖      | No authentication, sessions, or accounts.                                                      |
| A08 | Software or Data Integrity Failures   | ✅      | No deserialization. No third-party runtime scripts — fonts self-hosted via `next/font`, so no SRI gap. |
| A09 | Security Logging and Alerting         | ⚠️      | Nothing logged client-side, which is correct here; delivery and alerting become the form provider's responsibility once F-001 is resolved. |
| A10 | Mishandling of Exceptional Conditions | ✅      | `error.tsx` exposes no stack trace. The form's `catch` fails closed — shows a generic error and offers the direct email, leaking nothing. |

### Verified clean: the `mailto:` fallback

Worth recording explicitly, because it is the obvious place a reviewer would
expect an injection bug. When no endpoint is configured the form builds a
`mailto:` URL from user input:

```ts
// src/app/_components/contact/form.tsx:48-50
window.location.href = `mailto:${contactPage.directEmail}?subject=${encodeURIComponent(
  subject,
)}&body=${encodeURIComponent(body)}`;
```

`encodeURIComponent` percent-encodes `\r` and `\n` (to `%0D` / `%0A`) along with
`&` and `?`, so a crafted name or message **cannot** inject extra mail headers
(`Bcc:`, `Cc:`) or additional URL parameters. The recipient address is a
constant, not user input. No finding.

## Findings

### F-001 — CSP `connect-src 'self'` will block the contact form's submission

|                |                                                         |
| -------------- | ------------------------------------------------------- |
| **Severity**   | 🟡 Medium                                               |
| **Confidence** | High                                                    |
| **OWASP**      | `A02:2025 Security Misconfiguration`                    |
| **CWE**        | `CWE-16 Configuration`                                  |
| **Location**   | `next.config.ts:20`, `src/app/_components/contact/form.tsx:16,56` |

**Description.** The contact form POSTs to whatever origin
`NEXT_PUBLIC_CONTACT_ENDPOINT` names — in practice a third-party form service.
The CSP restricts `connect-src` to `'self'` (plus websocket schemes in
development only), so the browser will refuse that request in production.

The failure is quiet: the blocked `fetch` rejects, the `catch` sets the error
state, and the visitor sees the generic "Something went wrong" message. Nothing
identifies CSP as the cause unless someone opens the console.

**Evidence.**

```text
// next.config.ts:20 — production resolves to exactly "connect-src 'self'"
`connect-src 'self'${isDev ? " ws: wss:" : ""}`,

// src/app/_components/contact/form.tsx:56 — cross-origin by design
const response = await fetch(endpoint, { method: "POST", ... });

$ curl -sI http://localhost:3000/contact
Content-Security-Policy: ... connect-src 'self' ws: wss'; ...
```

**Impact.** Every contact submission fails silently once an endpoint is
configured — enquiries are lost with no server-side record, since there is no
server. The secondary risk is the likely fix under time pressure: broadening the
directive to `connect-src *`, which would discard the protection entirely.

**Remediation.** Add the specific endpoint origin — not a wildcard. Keep it in
one place so the CSP and the form cannot drift apart:

```ts
// next.config.ts
const contactOrigin = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT
  ? new URL(process.env.NEXT_PUBLIC_CONTACT_ENDPOINT).origin
  : "";

const contentSecurityPolicy = [
  // …
  `connect-src 'self'${contactOrigin ? ` ${contactOrigin}` : ""}${isDev ? " ws: wss:" : ""}`,
  // …
];
```

Because the variable is `NEXT_PUBLIC_`, it is available at build time, so the
origin is baked into the header with no runtime cost. After deploying, submit
the form once and confirm no CSP violation appears in the console.

**References.** `OWASP A02:2025 Security Misconfiguration` · `CWE-16` · [MDN: connect-src](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/connect-src)

---

### F-002 — Contact form has no anti-automation, and its endpoint is public

|                |                                                              |
| -------------- | ------------------------------------------------------------ |
| **Severity**   | 🟡 Medium                                                    |
| **Confidence** | High                                                         |
| **OWASP**      | `A06:2025 Insecure Design`                                   |
| **CWE**        | `CWE-799 Improper Control of Interaction Frequency`, `CWE-770 Allocation of Resources Without Limits` |
| **Location**   | `src/app/_components/contact/form.tsx:16,28-67`              |

**Description.** The form has no honeypot, no captcha, and no rate limiting. Its
only validation is the HTML `required` attribute, which is client-side and
trivially bypassed.

Compounding this: `NEXT_PUBLIC_` variables are **inlined into the client
bundle** at build time. The endpoint URL is therefore readable by anyone who
views source, and can be POSTed to directly — the form UI is not a gate, it is
just one convenient client.

This is inherent to client-side form submission rather than a coding mistake,
but it means the protection has to live at the endpoint, and right now nothing
verifies that it does.

**Evidence.**

```text
// src/app/_components/contact/form.tsx:16 — inlined into the bundle, publicly readable
const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

// :28-34 — no honeypot check, no throttle, no origin check before sending
const handleSubmit = async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  …
};
```

**Impact.** Automated submissions flood the destination inbox. On a metered form
service this consumes quota and can incur cost or suspend the account, taking
the contact route down. A scripted client can also submit arbitrary field
values, so anything downstream that trusts `email` or `category` is trusting
attacker-controlled data.

**Remediation.** Two layers.

First, a honeypot in the form — cheap and catches naive bots:

```tsx
{/* Visually hidden, not display:none — some bots skip hidden inputs */}
<input
  type="text"
  name="_gotcha"
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
  className="sr-only"
/>
```

```ts
// then bail before sending
if (data._gotcha) { setStatus("sent"); return; } // silent no-op
```

Second, and more importantly: **choose a form provider that enforces spam
filtering and rate limiting server-side**, and enable it. Formspree, Web3Forms
and Getform all offer this. Configure the provider to accept submissions only
from `https://kervzent.kanzen.my.id`. Treat every field as untrusted at the
destination — validate and escape before rendering any submission in an admin
view or email client.

**References.** `OWASP A06:2025 Insecure Design` · `CWE-799` · `CWE-770`

---

### F-003 — Form has no non-JS fallback; a native submit would put the message in the URL

|                |                                                     |
| -------------- | --------------------------------------------------- |
| **Severity**   | 🔵 Low                                              |
| **Confidence** | High                                                |
| **OWASP**      | `A04:2025 Cryptographic Failures` (data exposure)   |
| **CWE**        | `CWE-598 Use of GET Request Method With Sensitive Query Strings` |
| **Location**   | `src/app/_components/contact/form.tsx:70`           |

**Description.** The `<form>` element declares neither `method` nor `action` —
submission is handled entirely by the React `onSubmit` handler:

```tsx
// src/app/_components/contact/form.tsx:70
<form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
```

If JavaScript fails to load or errors before hydration, the submit button still
works, but performs a **native HTML submit**. With no `method`, the default is
`GET`, and with no `action` the target is the current URL. Every field —
including the visitor's name, email address and full message — is appended as a
query string.

**Impact.** Sensitive data lands in places URLs routinely persist: browser
history, the `Referer` header on any subsequent navigation, CDN and hosting
access logs, and any analytics that records page paths. The message is not
delivered either, so the visitor believes they have made contact when they have
not. Narrow — it requires a JS failure — but the exposure is silent when it does
occur.

**Remediation.** Declare `method="post"` so the degraded path cannot put field
values in a URL:

```tsx
<form
  method="post"
  onSubmit={handleSubmit}
  className="flex w-full flex-col gap-6"
>
```

Better still, set `action` to the form provider's endpoint as well. Most
services accept a standard form POST, which turns the no-JS path into a genuine
fallback that actually delivers the message rather than merely failing safely.
Note that `form-action 'self'` in the current CSP would need the same origin
added as in F-001 for that to work.

**References.** `OWASP A04:2025 Cryptographic Failures` · `CWE-598`

---

## Previous findings — status

| ID    | Finding                                         | Status                                            |
| ----- | ----------------------------------------------- | ------------------------------------------------- |
| F-001 | No security response headers                    | ✅ Fixed — all five verified serving on `/contact` |
| F-002 | Base URL fell back to `localhost` in production | ✅ Fixed — `_lib/site-url.ts` defaults to the real domain |
| F-003 | `X-Powered-By` disclosed the framework          | ✅ Fixed — absent from responses                   |

## Scope & limitations

- **Reviewed:** the full `src/` tree after the component reorganisation (24
  components across `shared/`, `home/`, `about/`, `studio/`, `contact/`), all
  four page routes, `next.config.ts`, `_lib/content/*`, `_lib/site-url.ts`,
  dependency manifests, and live response headers. All ten OWASP 2025 categories
  assessed.
- **Traced end to end:** the contact form's two submission paths — the
  cross-origin `fetch` and the `mailto:` fallback — from form input to sink.
- **Verified absent (not assumed):** route handlers, server actions, middleware,
  proxy, `"use server"`, XSS sinks, hardcoded secrets, committed `.env` files.
- **Not covered:**
  - **The form provider itself.** F-002's remediation depends entirely on
    controls at a service that has not been chosen yet. Re-audit once it is.
  - **Transitive dependencies** assessed via `npm audit` rather than manual review.
  - **Production hosting** (TLS, CDN, WAF, edge header injection) is outside the
    repository. Re-verify headers against the live origin.
  - **`public/videos/hero-background.mp4`** not inspected as a binary.
- **Method:** static source review against the OWASP Top 10 (2025), tracing
  untrusted input from entry points to sinks; severity = exploitability × impact.
  Header findings confirmed dynamically against the running server.
- **Not a substitute for:** dynamic testing (DAST), a manual penetration test, or
  a review of the production hosting environment.
