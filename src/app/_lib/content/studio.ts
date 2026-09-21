import type { GlyphId } from "./types";

export const studioCover = {
  title: "The Work We've Shipped",
  description:
    "A selection of what Kervzent Studio has built across web, mobile, and AI — and the teams we built it with.",
};

/** Placeholder projects — replace with real case studies before launch. */
export const projects = [
  {
    name: "Northbeam",
    practice: "Web Development",
    glyph: "web" as GlyphId,
    description:
      "An internal analytics dashboard rebuilt from a spreadsheet workflow, handling live reporting for a distributed ops team.",
    tint: "#4f7cff",
  },
  {
    name: "Halcyon",
    practice: "Mobile Apps",
    glyph: "mobile" as GlyphId,
    description:
      "A cross-platform companion app shipped to both stores in a single cycle, sharing one codebase and one release train.",
    tint: "#23c2a4",
  },
  {
    name: "Cobalt Row",
    practice: "AI Development",
    glyph: "ai" as GlyphId,
    description:
      "A retrieval assistant wired into an existing support desk, answering from the team's own documentation rather than a generic model.",
    tint: "#a45cff",
  },
  {
    name: "Meridian",
    practice: "Web Development",
    glyph: "web" as GlyphId,
    description:
      "A storefront rebuild that cut page weight by two thirds and moved checkout onto a platform the client's own team could extend.",
    tint: "#ffb020",
  },
  {
    name: "Kitewave",
    practice: "Mobile Apps",
    glyph: "mobile" as GlyphId,
    description:
      "An offline-first field app for crews working without reliable signal, syncing cleanly the moment a connection returns.",
    tint: "#2e8bff",
  },
  {
    name: "Solace",
    practice: "AI Development",
    glyph: "ai" as GlyphId,
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
