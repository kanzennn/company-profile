import { Clients } from "./_components/clients";
import { ContactCta } from "./_components/contact-cta";
import { Hero } from "./_components/hero";
import { Services } from "./_components/services";
import { Stats } from "./_components/stats";

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
