import type { GlyphId } from "./types";

export const studioCover = {
  title: "The Work We've Shipped",
  description:
    "A selection of what Kervzent Studio has built across web, mobile, and AI — and the teams we built it with.",
};

type Project = {
  name: string;
  practice: string;
  glyph: GlyphId;
  description: string;
  /** Backdrop hue, used only when the card has no `image`. */
  tint: string;
  /**
   * Screenshot of the work, as a path under `public/`. Given one, the card
   * drops the tinted gradient and shows the image behind a scrim instead.
   * Left out, the card keeps the gradient — so real work and placeholders can
   * sit in one grid.
   */
  image?: string;
  /**
   * The client's own logo, which stands in for the practice glyph. It must be
   * a **white, transparent** file: the card is near-black, and a logo in brand
   * colours — which is usually dark — disappears against it.
   *
   * One folder per project keeps the pair together as the list grows:
   * `/images/work/<project>/logo.svg` and `.../screenshot.webp`.
   */
  logo?: string;
  /**
   * Set when the `logo` is a lockup that already spells the name out, rather
   * than a bare icon. The card then stops printing the name underneath it, so
   * it is not read twice over.
   */
  logoIncludesName?: boolean;
};

/** Anima is real; the rest are placeholders, still to be replaced. */
export const projects: Project[] = [
  {
    name: "Anima",
    practice: "Web Development",
    glyph: "web",
    description:
      "A marketing landing page for a motion design tool, built from the hero down to the closing call to action.",
    tint: "#4f7cff",
    image: "/images/work/anima/screenshot.webp",
    logo: "/images/work/anima/logo.svg",
    logoIncludesName: true,
  },
  {
    name: "Halcyon",
    practice: "Mobile Apps",
    glyph: "mobile",
    description:
      "A cross-platform companion app shipped to both stores in a single cycle, sharing one codebase and one release train.",
    tint: "#23c2a4",
  },
  {
    name: "Cobalt Row",
    practice: "AI Development",
    glyph: "ai",
    description:
      "A retrieval assistant wired into an existing support desk, answering from the team's own documentation rather than a generic model.",
    tint: "#a45cff",
  },
  {
    name: "Meridian",
    practice: "Web Development",
    glyph: "web",
    description:
      "A storefront rebuild that cut page weight by two thirds and moved checkout onto a platform the client's own team could extend.",
    tint: "#ffb020",
  },
  {
    name: "Kitewave",
    practice: "Mobile Apps",
    glyph: "mobile",
    description:
      "An offline-first field app for crews working without reliable signal, syncing cleanly the moment a connection returns.",
    tint: "#2e8bff",
  },
  {
    name: "Solace",
    practice: "AI Development",
    glyph: "ai",
    description:
      "A document pipeline that turns unstructured intake forms into structured records, with a human review step that stayed in the loop.",
    tint: "#ff5623",
  },
];

/** Two-column text block below the work grid. */
export const studioNote = {
  heading: "The best way to judge a studio is the work it stands behind.",
  body: "Every project here was built by the same small team, start to finish. If you want to talk to the people who shipped one of them, we can arrange that — we don't hide engineers behind account managers.",
};
