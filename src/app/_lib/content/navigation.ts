import type { GlyphId } from "./types";

/** Header top strip — the three practices. */
export const serviceLinks = [
  { name: "Web Development", href: "/#services", glyph: "web" as GlyphId },
  { name: "Mobile Apps", href: "/#services", glyph: "mobile" as GlyphId },
  { name: "AI Development", href: "/#services", glyph: "ai" as GlyphId },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Studio", href: "/studio" },
];

export const contactLink = { label: "Contact", href: "/contact" };

/* Routes that mount an intro sequence. The header keeps its nav hidden until
   [data-intro="ready"], so a route missing from this list would never reveal
   it — error and not-found deliberately stay out and show the nav at once. */
export const introRoutes = ["/", "/about", "/studio", "/contact"];

/** Mirrors the header nav so the two can't drift apart. */
export const footerNav = [...navLinks, contactLink];

export const footerSocial = [
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" },
  { label: "GitHub", href: "https://github.com/Kervzent-Studio" },
];

export const footerLegal = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];
