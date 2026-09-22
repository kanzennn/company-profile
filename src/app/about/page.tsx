import type { Metadata } from "next";
import { AboutBand } from "./_components/AboutBand";
import { AboutClosing } from "./_components/AboutClosing";
import { AboutCover } from "./_components/AboutCover";
import { AboutHowWeWork } from "./_components/AboutHowWeWork";
import { AboutStory } from "./_components/AboutStory";
import { AboutTeam } from "./_components/AboutTeam";
import { AboutTimeline } from "./_components/AboutTimeline";
import { Clients } from "@/components/sections/Clients";
import { Stats } from "@/components/sections/Stats";
import { aboutBand } from "@/lib/content/about";

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
