import { IntroBackdrop } from "./intro-backdrop";
import { CornerMark } from "./marks";
import { ScrambleAction } from "./scramble-action";

export function UnderDevelopment({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main
      id="main"
      className="relative isolate flex h-svh w-full max-w-full items-center justify-center overflow-hidden p-5"
    >
      <IntroBackdrop />

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
            {title}
          </h1>

          {/* Collapsed until it expands, so the frame — and the marks centred
              on it — line up with the title alone while it fades in. */}
          <div className="animate-desc-expand exiting:animate-desc-collapse grid w-full grid-rows-[0fr]">
            <div className="overflow-hidden">
              <div className="animate-desc-in exiting:animate-fade-out mx-auto flex max-w-200 flex-col items-center gap-6 pt-6">
                <span className="font-mono text-label uppercase tracking-[0.3em] text-primary">
                  Under Development
                </span>
                <p className="font-mono text-body-lg text-on-surface/70 max-lg:text-body">
                  {description}
                </p>
                <ScrambleAction
                  href="/"
                  label="Back to home"
                  className="bg-primary px-10 py-3 font-mono text-body transition-colors hover:bg-primary-pressed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
