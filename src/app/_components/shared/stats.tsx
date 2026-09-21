import { CountUp } from "./count-up";
import { stats } from "../../_lib/content/home";

export function Stats() {
  return (
    <section
      id="studio"
      aria-labelledby="studio-heading"
      className="mx-auto flex w-full max-w-400 flex-col items-center gap-20 px-5 max-lg:gap-10"
    >
      <h2
        id="studio-heading"
        className="text-center text-headline-sm max-lg:text-left"
      >
        Kervzent Studio ships{" "}
        <span className="text-primary">production-ready software</span> across
        every layer of a product — from the site your customers land on to the
        AI running behind it.
      </h2>

      <div className="flex w-full gap-5 max-lg:flex-col">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex aspect-7/5 w-full flex-col items-center justify-center border border-outline bg-surface-tint"
          >
            <span className="font-mono text-[clamp(4.25rem,8vw,8rem)] tracking-tight">
              <CountUp
                to={stat.to}
                decimals={stat.decimals}
                suffix={stat.suffix}
              />
            </span>
            <span className="font-mono text-body-lg opacity-60 max-lg:text-body">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
