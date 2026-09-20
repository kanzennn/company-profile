"use client";

import { useIntroGate } from "./use-intro-gate";

/** Runs the page intro and fades the decorative backdrop in behind it, so the
 *  sequence opens on black the same way the hero does. */
export function IntroBackdrop() {
  const revealed = useIntroGate();

  return (
    <div
      aria-hidden
      className={`exiting:opacity-0 exiting:duration-400 absolute inset-0 -z-10 overflow-hidden transition-opacity duration-1000 ease-out ${
        revealed ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="absolute left-1/2 top-1/2 h-[55vh] w-[110vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,86,35,0.18),rgba(46,74,168,0.2)_40%,transparent_70%)] blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent,rgba(0,0,0,0.85))]" />
    </div>
  );
}
