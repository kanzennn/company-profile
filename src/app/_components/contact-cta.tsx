import { CornerMarks } from "./marks";
import { ScrambleAction } from "./scramble-action";

export function ContactCta() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate flex h-screen w-full max-w-full items-center justify-center overflow-hidden p-5 max-lg:max-h-175"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="absolute left-1/2 top-1/2 h-[60vh] w-[110vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,86,35,0.28),transparent_68%)] blur-3xl" />
      </div>

      <div className="relative max-w-full px-20 py-20 max-lg:px-4 max-lg:py-12">
        <CornerMarks className="inset-0 text-on-surface/40" />
        <div className="flex max-w-240 flex-col items-center gap-8 text-center">
          <h2 id="contact-heading" className="text-headline-lg">
            Start a Project with Kervzent
          </h2>
          <p className="max-w-200 font-mono text-body-lg opacity-70 max-lg:text-body">
            Tell us what you&rsquo;re building — a website, a mobile app, an AI
            feature, or all three. We&rsquo;ll scope it and come back with a
            plan.
          </p>
          <ScrambleAction
            href="mailto:hello@kervzent.com"
            label="Contact"
            className="bg-primary px-10 py-3 font-mono text-body transition-colors hover:bg-primary-pressed"
          />
        </div>
      </div>
    </section>
  );
}
