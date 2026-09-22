"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Glyph, Wordmark } from "@/components/ui/Marks";
import { ScrambleAction } from "@/components/ui/ScrambleAction";
import {
  contactLink,
  introRoutes,
  navLinks,
  serviceLinks,
} from "@/lib/content/navigation";

/* Long enough for the strip to clear and the nav to finish sliding out. */
const EXIT_MS = 550;
const AT_TOP_EPSILON = 2;
const SCROLL_SETTLE_MAX_MS = 900;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function useIsAtTop() {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY <= 8,
    () => true,
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const atTop = useIsAtTop();
  const pathname = usePathname();
  const router = useRouter();
  const exitTimer = useRef(0);
  const scrollPoll = useRef(0);
  const scrollFallback = useRef(0);

  // Every intro route flips [data-intro="ready"] when its sequence finishes.
  // Routes without one (error, not-found) have nothing to wait for, so the
  // header skips the gate there rather than hiding its nav forever.
  const runsIntro = introRoutes.includes(pathname);

  // End the exit the moment a new route commits. Adjusting state during render
  // is React's pattern for this — an effect would repaint the stale frame
  // first, and deriving it from the route we left kept the header stuck when
  // that same route was visited again later.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (leaving) setLeaving(false);
  }

  useEffect(() => {
    window.clearTimeout(exitTimer.current);
    window.clearInterval(scrollPoll.current);
    window.clearTimeout(scrollFallback.current);
    delete document.documentElement.dataset.exitLock;
    delete document.documentElement.dataset.exiting;
  }, [pathname]);

  // The mobile menu covers the viewport, so the page behind it shouldn't scroll.
  useEffect(() => {
    const html = document.documentElement;
    if (open) html.dataset.menuLock = "";
    else delete html.dataset.menuLock;
    return () => {
      delete html.dataset.menuLock;
    };
  }, [open]);

  const startExit =
    (href: string) => (event: React.MouseEvent<HTMLElement>) => {
      setOpen(false);

      const sameDestination = href === pathname;
      const isAnchor = href.startsWith("/#");
      const modified =
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

      // `leaving` guards against a second click landing mid-exit, which would
      // otherwise orphan the running timers and fire two navigations.
      if (leaving || !runsIntro || sameDestination || isAnchor || modified) {
        return;
      }

      event.preventDefault();

      // A click during the scroll-to-top wait lands before `leaving` is set,
      // so drop any in-flight timers rather than letting two runs overlap.
      window.clearInterval(scrollPoll.current);
      window.clearTimeout(scrollFallback.current);

      const beginExit = () => {
        setLeaving(true);
        document.documentElement.dataset.exitLock = "";
        // Page content watches this to run its intro backwards.
        document.documentElement.dataset.exiting = "";
        exitTimer.current = window.setTimeout(() => router.push(href), EXIT_MS);
      };

      if (window.scrollY <= AT_TOP_EPSILON) {
        beginExit();
        return;
      }

      // Ride back to the top first. The exit animation lives at the top of the
      // page, so starting it from further down would play it off screen. The
      // scroll has to finish before the lock lands, or it would be frozen
      // mid-way — hence waiting rather than locking straight away.
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
      window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "instant" });

      const settle = () => {
        window.clearInterval(scrollPoll.current);
        window.clearTimeout(scrollFallback.current);
        // Snap to the top before locking. If the cap below won the race the
        // smooth scroll is still mid-flight, and the lock would otherwise
        // freeze the page part-way up. Must be "instant" — "auto" defers to
        // the CSS scroll-behavior, which is smooth, so it would animate again.
        window.scrollTo({ top: 0, behavior: "instant" });
        beginExit();
      };

      scrollPoll.current = window.setInterval(() => {
        if (window.scrollY <= AT_TOP_EPSILON) settle();
      }, 50);
      // Smooth scrolling has no reliable completion signal across browsers, so
      // cap the wait rather than risk stalling the navigation.
      scrollFallback.current = window.setTimeout(settle, SCROLL_SETTLE_MAX_MS);
    };

  /* `/` would prefix-match every route, so it is the one link compared
     exactly; the rest also light up on their nested pages, should any appear
     later (`/studio/a-project` keeps Studio marked). */
  const isCurrent = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  // Entry runs nav first, then the strip. Exit reverses that: the strip clears
  // before the nav slides away, so the two don't leave at once.
  const stripReveal = leaving
    ? "opacity-0 duration-300 delay-0"
    : runsIntro
      ? "intro-ready:opacity-100 opacity-0 duration-700 delay-200"
      : "opacity-100 duration-700 delay-200";
  const navReveal = leaving
    ? "-translate-y-[200%] duration-400 delay-150"
    : runsIntro
      ? "intro-ready:translate-y-0 -translate-y-[200%] duration-700 delay-0"
      : "translate-y-0 duration-700 delay-0";

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-5 pt-3">
      <div
        inert={!atTop}
        className={`mx-auto w-full max-w-400 overflow-hidden transition-all duration-300 ease-out max-lg:hidden ${
          atTop ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`${stripReveal} flex items-center gap-6 pb-3 transition-opacity ease-out`}
        >
          {serviceLinks.map((link, index) => (
            <div key={link.name} className="flex items-center gap-6">
              {index > 0 && (
                <div className="h-6 w-px bg-on-surface/60" aria-hidden />
              )}
              <Link
                href={link.href}
                className="flex items-center gap-1.5 opacity-60 transition-opacity hover:opacity-100"
              >
                <Glyph id={link.glyph} className="h-4 w-4" />
                <span className="text-label tracking-tight">{link.name}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <nav
        aria-label="Main"
        /* The glass panel is desktop-only. On mobile the header sits directly
           on the page, and on the full-screen menu it reads as part of the
           overlay rather than floating over it.

           Desktop also lays out as three columns rather than a flex row, so the
           links sit on the nav's centre line instead of merely halfway between
           the logo and the button. The two `1fr` tracks stay equal whatever
           they hold, which is what keeps the middle one centred as the logo or
           the button changes width. Mobile stays a flex row — both side columns
           are hidden there, leaving the logo and the toggle. */
        className={`${navReveal} relative z-40 mx-auto flex w-full max-w-400 items-center gap-10 rounded-md p-4 transition-transform ease-out lg:grid lg:grid-cols-[1fr_auto_1fr] lg:border lg:border-outline/60 lg:bg-surface-tint lg:p-5 lg:backdrop-blur-xl`}
      >
        {/* `justify-self-start` holds the link to the logo's width; a grid item
            otherwise stretches across its whole track, making the empty half of
            it clickable. Inert in the mobile flex row. */}
        <Link
          href="/"
          className="shrink-0 justify-self-start"
          aria-label="Kervzent Studio home"
        >
          <Wordmark />
        </Link>

        <div className="flex items-center gap-8 max-lg:hidden">
          {navLinks.map((link) => (
            <ScrambleAction
              key={link.label}
              href={link.href}
              label={link.label}
              onClick={startExit(link.href)}
              active={isCurrent(link.href)}
              /* The current page rests at the opacity the others reach on
                 hover, so the nav reads as one scale rather than two. */
              className={`text-body font-mono transition-opacity hover:opacity-100 ${
                isCurrent(link.href) ? "opacity-100" : "opacity-70"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-end max-lg:hidden">
          <ScrambleAction
            href={contactLink.href}
            label={contactLink.label}
            className="bg-primary px-10 py-3 font-mono text-body transition-colors hover:bg-primary-pressed"
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="ml-auto flex h-8 w-8 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {/* Open state collapses the two bars into a single dash. */}
          <span
            className={`h-px w-6 bg-on-surface transition-transform duration-300 ${open ? "translate-y-[3.5px]" : ""}`}
          />
          <span
            className={`h-px w-6 bg-on-surface transition-transform duration-300 ${open ? "-translate-y-[3.5px]" : ""}`}
          />
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          /* Sits below the header's z-40 so the logo and close button stay on
             top of it. */
          className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-surface px-5 pb-10 pt-32 lg:hidden"
        >
          <nav
            aria-label="Mobile"
            className="flex flex-col items-center gap-8 pt-6"
          >
            {navLinks.map((link) => (
              <ScrambleAction
                key={link.label}
                href={link.href}
                label={link.label}
                onClick={startExit(link.href)}
                active={isCurrent(link.href)}
                /* The menu had every link at full strength, which left nothing
                   to mark the current one. Same scale as the desktop nav. */
                className={`font-mono text-title tracking-tight transition-opacity ${
                  isCurrent(link.href) ? "opacity-100" : "opacity-70"
                }`}
              />
            ))}
          </nav>

          <ScrambleAction
            href={contactLink.href}
            label={contactLink.label}
            onClick={() => setOpen(false)}
            className="mt-12 w-full bg-primary py-4 text-center font-mono text-body transition-colors hover:bg-primary-pressed"
          />

          <ul className="mt-12 flex flex-col items-center gap-8">
            {serviceLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-on-surface/60 transition-colors hover:text-on-surface"
                >
                  <Glyph id={link.glyph} className="h-6 w-6" />
                  <span className="text-title tracking-tight">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
