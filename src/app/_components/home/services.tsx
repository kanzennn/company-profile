import { CornerMarks, Glyph } from "../shared/marks";
import { ScrambleAction } from "../shared/scramble-action";
import { customWork, services } from "../../_lib/content/home";

function CardBackdrop({ tint }: { tint: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-1 overflow-hidden transition-transform duration-500 group-hover:scale-75"
    >
      <div
        className="absolute inset-0 blur-[2px]"
        style={{
          backgroundImage: `radial-gradient(ellipse at 28% 18%, ${tint}66, transparent 62%), radial-gradient(ellipse at 82% 88%, ${tint}33, transparent 58%), linear-gradient(140deg, #14161c, #05060a)`,
        }}
      />
      <div className="bg-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-surface/50" />
    </div>
  );
}

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="mx-auto flex w-full max-w-400 flex-col gap-20 px-5 max-lg:gap-10"
    >
      <div className="flex flex-col items-center justify-center gap-5">
        <h2 id="services-heading" className="text-center text-headline-sm">
          What We Build
        </h2>
        <p className="max-w-180 text-center font-mono text-body-lg opacity-70 max-lg:text-body">
          Three core practices, one team. Take a single piece or hand us the
          whole build.
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-5 max-lg:grid-cols-1">
        {services.map((service) => (
          <div
            key={service.name}
            className="group relative flex aspect-7/5 w-full items-center justify-center overflow-hidden max-lg:aspect-square"
          >
            <CardBackdrop tint={service.tint} />
            <CornerMarks className="inset-0 z-1 scale-75 p-4 text-on-surface/70 opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100" />

            <div className="relative z-2 flex flex-col items-center gap-6 px-5 text-center">
              <div className="flex items-center gap-3">
                <Glyph id={service.glyph} className="h-9 w-9 text-primary" />
                <span className="text-headline-md">{service.name}</span>
              </div>
              <p className="max-w-80 font-mono text-body-lg opacity-80 max-lg:text-body">
                {service.description}
              </p>
              <ScrambleAction
                href={service.href}
                label={service.action}
                context={service.name}
                className="w-fit bg-primary px-10 py-3 font-mono text-body transition-colors hover:bg-primary-pressed"
              />
            </div>
          </div>
        ))}

        <a
          href="#contact"
          className="group relative flex aspect-7/5 w-full items-center justify-center overflow-hidden border border-outline transition-colors hover:border-primary max-lg:aspect-square"
        >
          <div className="bg-grid absolute inset-0 z-1 opacity-40" />
          <div className="relative z-2 flex flex-col items-center gap-5 px-5 text-center">
            <Glyph
              id="chat"
              className="h-9 w-9 opacity-50 transition-opacity group-hover:opacity-100"
            />
            <span className="font-mono text-label uppercase tracking-[0.3em] opacity-60">
              {customWork.eyebrow}
            </span>
            <span className="text-headline-md">{customWork.title}</span>
          </div>
        </a>
      </div>
    </section>
  );
}
