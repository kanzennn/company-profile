"use client";

import { ScrambleAction } from "@/components/ui/ScrambleAction";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-5 text-center">
      <span className="font-mono text-label uppercase tracking-[0.3em] text-on-surface/50">
        Error
      </span>
      <h1 className="text-headline-lg">Something went wrong</h1>
      <p className="max-w-160 font-mono text-body-lg text-on-surface/70 max-lg:text-body">
        An unexpected error interrupted this page. Try again, and if it keeps
        happening, let us know.
      </p>
      <ScrambleAction
        label="Try again"
        onClick={reset}
        className="cursor-pointer bg-primary px-10 py-3 font-mono text-body transition-colors hover:bg-primary-pressed"
      />
    </main>
  );
}
