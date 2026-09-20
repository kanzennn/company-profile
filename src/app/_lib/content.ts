export type GlyphId = "kervzent" | "web" | "mobile" | "ai" | "chat";

export const serviceLinks = [
  { name: "Web Development", href: "/#services", glyph: "web" as GlyphId },
  { name: "Mobile Apps", href: "/#services", glyph: "mobile" as GlyphId },
  { name: "AI Development", href: "/#services", glyph: "ai" as GlyphId },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Product", href: "/product" },
];

export const contactLink = { label: "Contact", href: "/#contact" };

/* Routes that mount an intro sequence. The header keeps its nav hidden until
   [data-intro="ready"], so a route missing from this list would never reveal
   it — error and not-found deliberately stay out and show the nav at once. */
export const introRoutes = ["/", "/about", "/product"];

export const stats = [
  { to: 120, decimals: 0, suffix: "+", label: "Projects Delivered" },
  { to: 45, decimals: 0, suffix: "+", label: "Clients Worldwide" },
  { to: 9, decimals: 0, suffix: "", label: "Years Building" },
];

export const services = [
  {
    name: "Web Development",
    glyph: "web" as GlyphId,
    description:
      "Marketing sites, dashboards, and web apps built to load fast and scale",
    href: "#contact",
    action: "Start a Project",
    tint: "#4f7cff",
  },
  {
    name: "Mobile Apps",
    glyph: "mobile" as GlyphId,
    description:
      "Native and cross-platform apps for iOS and Android, shipped to the stores",
    href: "#contact",
    action: "Start a Project",
    tint: "#23c2a4",
  },
  {
    name: "AI Development",
    glyph: "ai" as GlyphId,
    description:
      "LLM features, agents, and data pipelines wired into the product you already run",
    href: "#contact",
    action: "Start a Project",
    tint: "#a45cff",
  },
];

export const customWork = {
  eyebrow: "Something Else",
  title: "Tell us what you need",
};

export const clients = [
  "Northbeam",
  "Halcyon",
  "Cobalt Row",
  "Meridian",
  "Kitewave",
  "Solace",
  "Orbital Six",
  "Verge",
];

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
