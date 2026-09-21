export const aboutCover = {
  eyebrow: "About the studio",
  title: "We Build What Teams Can't Staff For",
  description:
    "Kervzent Studio is a small, senior team. We take on the web, mobile, and AI work that sits between a roadmap and the people available to build it.",
};

/** The two narrative blocks below the cover. */
export const aboutStory = [
  {
    heading: "We started Kervzent because good products kept stalling.",
    body: "Not for lack of ideas — for lack of hands that could ship them. We began taking on the pieces other teams could not resource: a dashboard nobody had time for, a mobile build that kept slipping, an inference pipeline that needed someone senior. The work compounded, and so did the reasons to keep doing it.",
  },
  {
    heading: "What began as contract builds became a practice.",
    body: "We kept the team small and senior on purpose. Fewer handoffs, less translation, and engineers who stay with a product long enough to actually understand it. We would rather ship one thing properly than staff four things thinly.",
  },
];

/** Copy for the wide full-bleed band that breaks up the page. */
export const aboutBand = {
  title: "Three practices. One team that ships all of them.",
  body: "Web, mobile, and AI are not separate departments here. The same people carry a product across all three.",
};

/** Placeholder milestones — replace with the studio's real history. */
export const timeline = [
  {
    year: "2017",
    title: "First build",
    body: "A single contract project for a team that needed a launcher and had nobody free to write it.",
  },
  {
    year: "2019",
    title: "The studio takes shape",
    body: "Repeat work turned into a standing team. We stopped calling it freelancing.",
  },
  {
    year: "2021",
    title: "Mobile practice",
    body: "Clients kept asking for the app alongside the site, so we built the capability properly instead of subcontracting it.",
  },
  {
    year: "2023",
    title: "AI practice",
    body: "LLM features stopped being experiments and started being roadmap items. We staffed for it.",
  },
  {
    year: "2026",
    title: "Where we are now",
    body: "Three practices, one team, and a preference for work we can see all the way through.",
  },
];

/**
 * Drives the pinned, scroll-stepped section. Adding or removing a step changes
 * how the track divides — the component splits scroll progress evenly across
 * however many are here.
 */
export const howWeWork = {
  title: "How We Work",
  steps: [
    {
      title: "We scope it with you, not at you.",
      body: "Before anything gets built we sit with the actual problem — the constraint you keep hitting, the thing that keeps slipping. Estimates come after that conversation, not instead of it. If the honest answer is that you don't need us, we say so.",
    },
    {
      title: "We build in the open.",
      body: "You see the work while it is happening, not at a milestone demo three weeks later. Every project runs against a live environment you can open at any point. When something turns out harder than scoped, you hear it that week.",
    },
    {
      title: "We stay after launch.",
      body: "Handing over a repository is not the same as delivering a product. We stay through the first weeks of real traffic, when the interesting failures actually show up, and leave you with something your own team can carry.",
    },
  ],
};

/** Placeholder people — replace with the real team before launch. */
export const team = [
  { name: "A. Rahman", role: "Founder, Engineering" },
  { name: "S. Putri", role: "Lead, Web" },
  { name: "D. Wibowo", role: "Lead, Mobile" },
  { name: "M. Hakim", role: "Lead, AI" },
  { name: "N. Sari", role: "Design" },
  { name: "R. Pratama", role: "Infrastructure" },
];

export const aboutClosing = {
  eyebrow: "Looking ahead",
  title: "We're just getting started.",
  body: "Three practices in, the interesting problems keep arriving. If you have one, we would like to hear about it.",
};
