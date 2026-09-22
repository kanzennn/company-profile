"use client";

import Link from "next/link";
import { useScramble } from "./use-scramble";

/**
 * A call-to-action whose label scrambles on hover. Renders a router link, a
 * plain anchor for mailto/external targets, or a button when given no href.
 */
export function ScrambleAction({
  label,
  href,
  className,
  onClick,
  context,
  active,
}: {
  label: string;
  href?: string;
  className?: string;
  /** Typed to HTMLElement so one handler works across the link and button
   *  variants — callers that need the event (preventDefault, modifier keys)
   *  get it either way. */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Distinguishes otherwise identical labels for screen readers. */
  context?: string;
  /** Marks this as the page currently being viewed. Styling stays with the
   *  caller — this only carries the meaning to assistive tech, which would
   *  otherwise have nothing but a colour change to go on. */
  active?: boolean;
}) {
  const { display, scramble } = useScramble(label);

  const inner = (
    <>
      {/* The glyphs are decorative; assistive tech reads the real label. */}
      <span className="sr-only">
        {label}
        {context ? ` — ${context}` : ""}
      </span>
      <span aria-hidden>{display}</span>
    </>
  );
  const shared = {
    className,
    onMouseEnter: scramble,
    onFocus: scramble,
    "aria-current": active ? ("page" as const) : undefined,
  };

  if (href === undefined) {
    return (
      <button type="button" onClick={onClick} {...shared}>
        {inner}
      </button>
    );
  }

  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        onClick={onClick}
        {...(href.startsWith("http") && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
        {...shared}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} {...shared}>
      {inner}
    </Link>
  );
}
