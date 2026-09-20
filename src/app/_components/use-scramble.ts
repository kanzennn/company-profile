"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>/\\*+-=$#%&@!?";
/* How long each character waits before locking in, and how often the unresolved
   ones re-roll. Re-rolling every frame reads as static rather than as glyphs. */
const LOCK_STEP_MS = 55;
const ROLL_INTERVAL_MS = 35;

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/** Resolves `text` left to right from random glyphs. Call `scramble` to run it.
 *  Widths only stay put in a monospace face — expect jitter otherwise. */
export function useScramble(text: string) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(0);

  const cancel = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
  }, []);

  const scramble = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    cancel();
    const startedAt = performance.now();
    let lastRoll = 0;

    const tick = (now: number) => {
      const locked = (now - startedAt) / LOCK_STEP_MS;

      if (locked >= text.length) {
        setDisplay(text);
        frameRef.current = 0;
        return;
      }

      if (now - lastRoll >= ROLL_INTERVAL_MS) {
        lastRoll = now;
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          out += char === " " || i < locked ? char : randomGlyph();
        }
        setDisplay(out);
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [text, cancel]);

  useEffect(() => cancel, [cancel]);

  return { display, scramble };
}
