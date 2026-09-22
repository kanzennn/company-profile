import { team } from "@/lib/content/about";
import { CornerMarks } from "@/components/ui/Marks";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

export function AboutTeam() {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="mx-auto flex w-full max-w-400 flex-col gap-20 px-5 max-lg:gap-10"
    >
      <div className="grid w-full grid-cols-2 gap-10 max-lg:grid-cols-1 max-lg:gap-5">
        <h2 id="team-heading" className="text-headline-sm">
          The team behind Kervzent.
        </h2>
        <p className="font-mono text-body-lg text-on-surface/70 max-lg:text-body">
          Small on purpose. Everyone here builds — there is no account layer
          between you and the people writing the code.
        </p>
      </div>

      {/* Two columns at every width — one column of six squares makes the
          section absurdly tall on a phone. */}
      <ul className="grid w-full grid-cols-3 gap-5 max-lg:grid-cols-2">
        {team.map((person) => (
          <li
            key={person.name}
            className="group relative flex aspect-7/5 w-full flex-col items-center justify-center gap-6 overflow-hidden border border-outline bg-surface-tint transition-colors hover:border-primary max-lg:aspect-square max-lg:gap-4"
          >
            <div aria-hidden className="absolute inset-0 -z-10">
              <div className="bg-grid absolute inset-0 opacity-30" />
            </div>

            <CornerMarks className="inset-0 p-4 text-on-surface/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <span
              aria-hidden
              className="flex h-20 w-20 items-center justify-center rounded-md border border-outline font-mono text-title text-on-surface/70 transition-colors group-hover:border-primary group-hover:text-primary max-lg:h-14 max-lg:w-14 max-lg:text-body"
            >
              {initials(person.name)}
            </span>
            <div className="flex flex-col items-center gap-2 px-4 text-center">
              <span className="text-title max-lg:text-body">{person.name}</span>
              <span className="font-mono text-label uppercase tracking-[0.2em] text-on-surface/60">
                {person.role}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
