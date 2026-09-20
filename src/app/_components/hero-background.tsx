"use client";

import { useRef } from "react";
import { useIntroGate } from "./use-intro-gate";

export function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealed = useIntroGate(videoRef);

  return (
    <div
      aria-hidden
      className={`exiting:opacity-0 exiting:duration-400 absolute inset-0 -z-10 overflow-hidden transition-opacity duration-1000 ease-out ${
        revealed ? "opacity-100" : "opacity-0"
      }`}
    >
      <video
        ref={videoRef}
        src="/videos/hero-background.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out motion-reduce:hidden ${
          revealed ? "scale-100" : "scale-105"
        }`}
      />
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      <div className="absolute -bottom-[45%] left-1/2 h-[85vh] w-[150vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,86,35,0.22),rgba(46,74,168,0.28)_38%,transparent_70%)] blur-3xl" />
      <div className="absolute inset-0 bg-surface/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent,rgba(0,0,0,0.9))]" />
    </div>
  );
}
