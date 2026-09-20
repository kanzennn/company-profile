import { ScrambleAction } from "./_components/scramble-action";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-5 text-center">
      <span className="font-mono text-label uppercase tracking-[0.3em] text-on-surface/50">
        404
      </span>
      <h1 className="text-headline-lg">This page doesn&rsquo;t exist</h1>
      <p className="max-w-160 font-mono text-body-lg text-on-surface/70 max-lg:text-body">
        The link may be out of date, or the page may have moved.
      </p>
      <ScrambleAction
        href="/"
        label="Back to home"
        className="bg-primary px-10 py-3 font-mono text-body transition-colors hover:bg-primary-pressed"
      />
    </main>
  );
}
