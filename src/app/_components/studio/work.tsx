import { projects } from "../../_lib/content/studio";
import { CornerMarks, Glyph } from "../shared/marks";

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

export function StudioWork() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="mx-auto flex w-full max-w-400 flex-col gap-20 px-5 max-lg:gap-10"
    >
      <div className="flex flex-col items-center justify-center gap-5">
        <h2 id="work-heading" className="text-center text-headline-sm">
          Selected Work
        </h2>
        <p className="max-w-180 text-center font-mono text-body-lg text-on-surface/70 max-lg:text-body">
          Six projects across the three practices, each carried end to end by
          the same team.
        </p>
      </div>

      {/* Holds two columns down to phone width — six full-width squares on a
          tablet makes this section absurdly tall. */}
      <ul className="grid w-full grid-cols-2 gap-5 max-sm:grid-cols-1">
        {projects.map((project) => (
          <li
            key={project.name}
            className="group relative flex aspect-7/5 w-full items-center justify-center overflow-hidden max-sm:aspect-square"
          >
            <CardBackdrop tint={project.tint} />
            <CornerMarks className="inset-0 z-1 scale-75 p-4 text-on-surface/70 opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100" />

            <div className="relative z-2 flex flex-col items-center gap-5 px-10 text-center max-lg:px-5">
              <Glyph
                id={project.glyph}
                className="h-9 w-9 text-primary transition-transform duration-500 group-hover:scale-110"
              />
              <h3 className="text-headline-md">{project.name}</h3>
              <span className="font-mono text-label uppercase tracking-[0.3em] text-on-surface/60">
                {project.practice}
              </span>
              <p className="max-w-100 font-mono text-body text-on-surface/70">
                {project.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
