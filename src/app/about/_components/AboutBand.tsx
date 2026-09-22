import { CornerMarks } from "@/components/ui/Marks";

/**
 * Full-bleed wide banner that breaks up the text sections. Uses the site's
 * gradient/grid treatment rather than photography, so it stays on-brand and
 * ships no extra image weight.
 */
export function AboutBand({
  title,
  body,
  children,
}: {
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate flex aspect-8/3 w-full items-center justify-center overflow-hidden max-lg:aspect-square">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute left-1/2 top-1/2 h-[80%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,86,35,0.2),rgba(46,74,168,0.22)_40%,transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent,rgba(0,0,0,0.85))]" />
      </div>

      <div className="relative mx-auto w-full max-w-400 px-5">
        <div className="relative px-20 py-20 max-lg:px-4 max-lg:py-12">
          <CornerMarks className="inset-0 text-on-surface/40" />

          <div className="mx-auto flex max-w-200 flex-col items-center gap-6 text-center">
            <p className="text-headline-sm">{title}</p>
            {body && (
              <p className="font-mono text-body-lg text-on-surface/70 max-lg:text-body">
                {body}
              </p>
            )}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
