import type { Metadata } from "next";
import { UnderDevelopment } from "../_components/under-development";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Kervzent Studio — the team behind the websites, mobile applications, and AI systems we build.",
};

export default function AboutPage() {
  return (
    <UnderDevelopment
      title="About Kervzent Studio"
      description="We're still writing this one. It'll cover who we are, how we work, and the people behind the builds."
    />
  );
}
