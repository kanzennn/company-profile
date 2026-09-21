import type { Metadata } from "next";
import { AboutBand } from "../_components/about/band";
import { AboutClosing } from "../_components/about/closing";
import { AboutCover } from "../_components/about/cover";
import { AboutHowWeWork } from "../_components/about/how-we-work";
import { AboutStory } from "../_components/about/story";
import { AboutTeam } from "../_components/about/team";
import { AboutTimeline } from "../_components/about/timeline";
import { Clients } from "../_components/shared/clients";
import { Stats } from "../_components/shared/stats";
import { aboutBand } from "../_lib/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Kervzent Studio — a small, senior team building websites, mobile applications, and AI systems.",
};

export default function AboutPage() {
  return (
    <main id="main" className="flex flex-1 flex-col gap-40 max-lg:gap-20">
      <AboutCover />
      <AboutStory />
      <AboutBand title={aboutBand.title} body={aboutBand.body} />
      <Stats />
      <AboutTimeline />
      <AboutHowWeWork />
      <AboutTeam />
      <Clients />
      <AboutClosing />
    </main>
  );
}
