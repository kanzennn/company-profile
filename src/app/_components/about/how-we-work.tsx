"use client";

import { useEffect, useRef, useState } from "react";
import { howWeWork } from "../../_lib/content/about";
import { CornerMarks } from "../shared/marks";

const steps = howWeWork.steps;

export function AboutHowWeWork() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;

    /* Derived from geometry rather than IntersectionObserver: the step is a
       pure function of scroll position, so it can't land on the wrong one when
       several observer entries arrive in a single batch. */
    const measure = () => {
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      const index = Math.min(
        Math.floor(progress * steps.length),
        steps.length - 1,
      );
      setActive((current) => (current === index ? current : index));
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Deferred — a synchronous setState here would cascade an extra render.
    frame = requestAnimationFrame(measure);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="how-we-work"
      aria-labelledby="how-we-work-heading"
      className="relative mx-auto w-full max-w-400 lg:px-5"
    >
      {/* Tall track — the panel below pins while the page scrolls through it,
          and how far through decides which step is showing. */}
      <div ref={trackRef} className="h-[300vh]">
        <div className="sticky top-0 flex h-svh flex-col justify-center gap-10 py-20 max-lg:px-5 max-lg:py-10">
          <div className="flex items-center justify-between gap-5 max-lg:flex-col max-lg:items-start">
            <h2 id="how-we-work-heading" className="text-headline-sm">
              {howWeWork.title}
            </h2>

            <ol className="flex items-center gap-6" aria-hidden>
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className={`font-mono text-label tracking-[0.3em] transition-colors duration-500 ${
                    index === active ? "text-primary" : "text-on-surface/30"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </li>
              ))}
            </ol>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden border border-outline bg-surface-tint">
            <div aria-hidden className="absolute inset-0 -z-10">
              <div className="bg-grid absolute inset-0 opacity-40" />
              <div className="absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,86,35,0.22),transparent_70%)] blur-3xl" />
            </div>

            <CornerMarks className="inset-0 p-6 text-on-surface/40" />

            {steps.map((step, index) => (
              <div
                key={step.title}
                aria-hidden={index !== active}
                className={`absolute flex max-w-200 flex-col items-center gap-6 px-10 text-center transition-all duration-500 ease-out max-lg:px-5 ${
                  index === active
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-4 opacity-0"
                }`}
              >
                <span className="font-mono text-label uppercase tracking-[0.3em] text-primary">
                  {String(index + 1).padStart(2, "0")} — Step
                </span>
                <p className="text-headline-md">{step.title}</p>
                <p className="font-mono text-body-lg text-on-surface/70 max-lg:text-body">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
