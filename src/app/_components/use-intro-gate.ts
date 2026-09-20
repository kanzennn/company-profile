"use client";

import { useEffect, useState, type RefObject } from "react";

const MIN_INTRO_MS = 2000;
const FALLBACK_MS = 6000;
/* Covers the background fade and the nav sliding in, which both start once the
   sequence is revealed and outlast every keyframe on the page. */
const TAIL_MS = 1000;

/**
 * Runs the shared page intro: locks scroll, then flips [data-intro="ready"] —
 * which the header's nav reveal is gated on. Pass a video ref to wait for
 * playable footage; without one the clock is the only gate.
 */
export function useIntroGate(videoRef?: RefObject<HTMLVideoElement | null>) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const video = videoRef?.current ?? null;
    const mountedAt = performance.now();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let settled = false;
    let revealTimer = 0;
    let unlockTimer = 0;

    // Holding someone who asked for reduced motion through a 3s intro is worse
    // than skipping it, so they get the finished page immediately.
    if (!reducedMotion) {
      html.dataset.introLock = "";
      window.scrollTo(0, 0);
    }

    const reveal = () => {
      if (settled) return;
      settled = true;
      const elapsed = performance.now() - mountedAt;
      const wait = reducedMotion ? 0 : Math.max(0, MIN_INTRO_MS - elapsed);

      revealTimer = window.setTimeout(() => {
        setRevealed(true);
        html.dataset.intro = "ready";
        unlockTimer = window.setTimeout(
          () => delete html.dataset.introLock,
          reducedMotion ? 0 : TAIL_MS,
        );
      }, wait);
    };

    if (reducedMotion || !video || video.readyState >= 3) reveal();
    video?.addEventListener("canplay", reveal);
    const fallback = window.setTimeout(reveal, FALLBACK_MS);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(unlockTimer);
      window.clearTimeout(fallback);
      video?.removeEventListener("canplay", reveal);
      delete html.dataset.introLock;
      // Leaving tears down the page that owns these flags. Left set, returning
      // would replay the animations and scroll lock while the nav they gate
      // was already showing.
      delete html.dataset.intro;
    };
  }, [videoRef]);

  return revealed;
}
