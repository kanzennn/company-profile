import { HeroBackground } from "./HeroBackground";
import { CornerMark } from "@/components/ui/Marks";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex h-svh w-full max-w-full items-center justify-center overflow-hidden p-5"
    >
      <HeroBackground />

      <div className="relative max-w-full px-20 py-20 max-lg:px-4 max-lg:py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 text-on-surface/40"
        >
          <CornerMark className="animate-mark-top exiting:animate-mark-merge-top absolute left-0 h-[30px] w-[30px]" />
          <CornerMark className="animate-mark-bottom exiting:animate-mark-merge-bottom absolute left-0 h-[30px] w-[30px]" />
          <CornerMark className="animate-mark-top exiting:animate-mark-merge-top absolute right-0 h-[30px] w-[30px]" />
          <CornerMark className="animate-mark-bottom exiting:animate-mark-merge-bottom absolute right-0 h-[30px] w-[30px]" />
        </div>

        <div className="flex max-w-260 flex-col items-center text-center">
          <h1 className="animate-title-in exiting:animate-fade-out text-display">
            Software Built for Web, Mobile, and AI
          </h1>
          <div className="animate-desc-expand exiting:animate-desc-collapse grid w-full grid-rows-[0fr]">
            <div className="overflow-hidden">
              <p className="animate-desc-in exiting:animate-fade-out mx-auto max-w-200 pt-6 font-mono text-body-lg text-on-surface/70 max-lg:text-body">
                Kervzent Studio designs and engineers websites, mobile
                applications, and AI systems — from first prototype to
                production.
              </p>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#studio"
        aria-hidden
        tabIndex={-1}
        className="intro-ready:opacity-100 absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-label uppercase tracking-[0.3em] text-on-surface/50 opacity-0 transition-opacity duration-700 ease-out hover:text-on-surface/90 max-lg:hidden"
      >
        Scroll
      </a>
    </section>
  );
}
