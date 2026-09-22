import { Clients } from "@/components/sections/Clients";
import { ContactCta } from "@/components/sections/ContactCta";
import { Hero } from "./_components/Hero";
import { Services } from "./_components/Services";
import { Stats } from "@/components/sections/Stats";

export default function Home() {
  return (
    <main id="main" className="flex flex-1 flex-col gap-60 max-lg:gap-30">
      <Hero />
      <Stats />
      <Services />
      <Clients />
      <ContactCta />
    </main>
  );
}
