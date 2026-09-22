import type { Metadata } from "next";
import { ContactCta } from "@/components/sections/ContactCta";
import { StudioCover } from "./_components/StudioCover";
import { StudioWork } from "./_components/StudioWork";
import { Clients } from "@/components/sections/Clients";
import { studioNote } from "@/lib/content/studio";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Selected work from Kervzent Studio across web, mobile, and AI development.",
};

export default function StudioPage() {
  return (
    <main id="main" className="flex flex-1 flex-col gap-40 max-lg:gap-20">
      <StudioCover />
      <StudioWork />

      <section
        id="how-we-stand-behind-it"
        aria-label="How we stand behind the work"
        className="mx-auto w-full max-w-400 px-5"
      >
        <div className="grid w-full grid-cols-2 gap-10 max-lg:grid-cols-1 max-lg:gap-5">
          <p className="text-headline-sm">{studioNote.heading}</p>
          <p className="font-mono text-body-lg text-on-surface/70 max-lg:text-body">
            {studioNote.body}
          </p>
        </div>
      </section>

      <Clients />
      <ContactCta />
    </main>
  );
}
