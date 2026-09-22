import type { GlyphId } from "./types";

/** Placeholder figures — replace with real numbers before launch. */
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

/** The fourth card in the services grid. */
export const customWork = {
  eyebrow: "Something Else",
  title: "Tell us what you need",
};
