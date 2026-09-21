import { Clients } from "./_components/shared/clients";
import { ContactCta } from "./_components/shared/contact-cta";
import { Hero } from "./_components/home/hero";
import { Services } from "./_components/home/services";
import { Stats } from "./_components/shared/stats";

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
