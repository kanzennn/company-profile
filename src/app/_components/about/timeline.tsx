import { timeline } from "../../_lib/content/about";

export function AboutTimeline() {
  return (
    <section
      id="timeline"
      aria-labelledby="timeline-heading"
      className="mx-auto flex w-full max-w-400 flex-col gap-20 px-5 max-lg:gap-10"
    >
      <div className="flex flex-col items-center justify-center gap-5">
        <h2 id="timeline-heading" className="text-center text-headline-sm">
          Kervzent Timeline
        </h2>
        <p className="max-w-180 text-center font-mono text-body-lg text-on-surface/70 max-lg:text-body">
          Nine years of taking on the work that was next.
        </p>
      </div>

      <ol className="flex w-full flex-col border-t border-outline/50">
        {timeline.map((entry) => (
          <li
            key={entry.year}
            className="group grid grid-cols-[8rem_1fr] gap-10 border-b border-outline/50 py-10 transition-colors hover:bg-surface-tint max-lg:grid-cols-1 max-lg:gap-3 max-lg:py-6"
          >
            <span className="font-mono text-title text-primary max-lg:text-body">
              {entry.year}
            </span>
            <div className="flex flex-col gap-3">
              <h3 className="text-headline-md">{entry.title}</h3>
              <p className="max-w-200 font-mono text-body-lg text-on-surface/70 max-lg:text-body">
                {entry.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
