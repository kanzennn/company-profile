import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * The contact form posts cross-origin to whatever form service is configured,
 * so that origin has to be allowed explicitly — `connect-src 'self'` alone
 * blocks the submission, and the form surfaces only a generic error when it
 * does. Derived from the same variable the form reads, so the header and the
 * request cannot drift apart. Never widen this to `*`.
 */
function contactOrigin(): string {
  const value = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
  if (!value) return "";
  try {
    return new URL(value).origin;
  } catch {
    throw new Error(
      `NEXT_PUBLIC_CONTACT_ENDPOINT is not a valid absolute URL: "${value}". ` +
        "Expected something like https://formspree.io/f/xxxxxxx",
    );
  }
}

const contact = contactOrigin();
const allowContact = contact ? ` ${contact}` : "";

/**
 * `unsafe-inline` in script-src is required: the App Router inlines RSC payload
 * and bootstrap scripts, and the nonce-based alternative needs middleware,
 * which would force every route to render dynamically and lose the static
 * prerender. It weakens the XSS arm of this policy — `frame-ancestors`, which
 * closes the clickjacking gap, is unaffected. Dev additionally needs `eval`
 * for HMR and a websocket for Fast Refresh.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  `connect-src 'self'${allowContact}${isDev ? " ws: wss:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  // Also covers the form's no-JS fallback, which posts natively to the same
  // endpoint rather than letting the browser put fields in the URL.
  `form-action 'self'${allowContact}`,
  "object-src 'none'",
  // Would try to upgrade http://localhost during development.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Ignored by browsers over plain HTTP, so it is inert until TLS is live.
  // `preload` is intentionally omitted — submitting to the preload list is a
  // long-lived commitment for the apex domain and every subdomain.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
