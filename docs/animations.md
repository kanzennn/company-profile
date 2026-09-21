# Animations

The distinctive part of this build. Three systems: a page **intro**, a page
**exit**, and a **hover scramble** on interactive text.

## The attribute protocol

Components that never reference each other coordinate through four data
attributes on `<html>`. This is the mental model to hold:

| Attribute         | Set by         | Cleared by             | Effect                                        |
| ----------------- | -------------- | ---------------------- | --------------------------------------------- |
| `data-intro`      | `useIntroGate` | its own cleanup        | `"ready"` reveals the nav, strip and scroll cue |
| `data-intro-lock` | `useIntroGate` | gate tail / cleanup    | `overflow: hidden` while the intro plays      |
| `data-exiting`    | `SiteHeader`   | route-change effect    | Page content runs its animations backwards    |
| `data-exit-lock`  | `SiteHeader`   | route-change effect    | `overflow: hidden` while the exit plays       |

Two separate lock attributes rather than one is deliberate: the intro and exit
locks overlap when navigating back to a page, and a shared attribute would let
whichever cleared first release the other's lock.

**All four are applied from JavaScript, never server-rendered.** Rendering the
lock into the initial HTML would apply it from first paint — but then a failed
JS bundle would leave the page permanently unscrollable. The server-rendered
content is perfectly readable in that scenario, so stranding it is the worse
failure. The trade-off is a ~200ms window before hydration where scrolling still
works.

## The intro

Runs on mount for every route listed in `introRoutes`. Pure CSS animations, no
JavaScript driving the keyframes — so it starts the instant the HTML paints,
with no hydration flash and no dependency on JS succeeding.

| Delay  | Element        | Animation                                           |
| ------ | -------------- | --------------------------------------------------- |
| 0ms    | Title          | `fade-in` 900ms                                     |
| 700ms  | Corner marks   | `fade-in` 500ms                                     |
| 1300ms | Corner marks   | `split-to-top` / `split-to-bottom` 900ms            |
| 1300ms | Description    | `desc-expand` 900ms (grid rows `0fr` → `1fr`)       |
| 1500ms | Description    | `fade-in` 700ms                                     |
| gated  | Background     | opacity 0 → 1 over 1000ms                           |
| gated  | Nav, strip, cue| revealed by `data-intro="ready"`                    |

### The splitting marks

Each side of the frame holds **two stacked `+` marks** occupying the same
position, so they read as one. At 1300ms one animates `top: calc(50% - 15px) → 0`
and the other `bottom: calc(50% - 15px) → 0`, separating into the four corners.

### Why the description starts collapsed

The marks are centred on the content frame. If the description occupied layout
space from the start, the frame's centre would sit *below* the title and the
marks would visibly miss it.

Starting it at `grid-template-rows: 0fr` means the frame initially contains only
the title, so frame centre = title centre. Expanding it then lifts the title
into its final position as a consequence of layout, not a separate animation
that could drift out of sync.

The 24px gap lives on the description's `pt-6` rather than the flex container's
`gap`, because a container gap would still push the title while the description
was collapsed.

> `grid-template-rows` interpolation between `fr` units is well supported in
> current Chrome, Safari and Firefox. In an older browser the description
> appears at full height instead of expanding — it degrades safely.

### `useIntroGate`

Owns the timing and the flags. Takes an optional video ref:

```ts
const revealed = useIntroGate(videoRef); // home — waits for playable video
const revealed = useIntroGate();         // other pages — clock only
```

| Constant        | Value  | Purpose                                                    |
| --------------- | ------ | ---------------------------------------------------------- |
| `MIN_INTRO_MS`  | 2000   | Floor — the reveal never fires earlier, even if video is ready |
| `FALLBACK_MS`   | 6000   | Hard release if `canplay` never fires                      |
| `TAIL_MS`       | 1000   | Wait after reveal before unlocking scroll                  |

The nav gate is **not** a fixed timer. A large video could take seconds, and a
timer would drop the nav in over a still-black hero. It listens for the video's
`canplay` event instead — with the 6s fallback so a broken or missing video can
never leave the site without navigation.

Unlock lands at reveal + 1000ms ≥ 3000ms, always after the 2200ms mark where the
last keyframe finishes.

The cleanup clears `data-intro` on unmount. Leaving it set meant returning to a
page replayed its CSS animations while the nav they gate was already visible — a
half-replayed intro.

## The exit

Triggered by clicking a nav link while on an intro route. Reverses the intro,
then navigates.

```
click
  ├─ already at top?  → begin exit
  └─ scrolled down?   → smooth-scroll to top, then begin exit

begin exit:
  0ms      background fades out, title fades, marks merge, description collapses
  0→300    service strip clears
  150→550  nav slides up
  550ms    router.push() — screen is already black
```

| Constant                | Value | Purpose                                         |
| ----------------------- | ----- | ----------------------------------------------- |
| `EXIT_MS`               | 550   | Delay before navigating                         |
| `AT_TOP_EPSILON`        | 2     | Tolerance for "already at top"                  |
| `SCROLL_SETTLE_MAX_MS`  | 900   | Cap on waiting for the smooth scroll            |

### Scroll-to-top before exiting

The exit animation lives at the top of the page, so starting it from further
down would play it off screen. Two details make this reliable:

**The cap is a bound, not a guarantee.** Smooth scrolling has no dependable
cross-browser completion event, so the code polls for arrival and caps the wait
at 900ms. When the cap wins the race, `settle()` snaps to the top *before*
locking — otherwise the lock freezes the page part-way up.

**The snap uses `behavior: "instant"`, not `"auto"`.** `"auto"` defers to the CSS
`scroll-behavior`, which is `smooth` here, so it would animate again and defeat
the point.

### Exit animation specificity

Exit animations override entry animations on the same element at equal
specificity, which would otherwise be decided by Tailwind's emission order. The
`exiting:` variant is defined without `:where()` so it reliably wins. See
[Design system](./design-system.md#custom-utilities-and-variants).

| Element     | Entry                          | Exit                               |
| ----------- | ------------------------------ | ---------------------------------- |
| Title       | `fade-in`                      | `fade-out`                         |
| Marks       | `fade-in`, `split-to-*`        | `merge-from-*`, `fade-out`         |
| Description | `desc-expand`                  | `desc-collapse`                    |
| Background  | opacity 1000ms                 | opacity 400ms (`exiting:duration-400`) |

The background needs the duration override too — reusing its 1000ms entry fade
would still be half-visible when the route swaps.

### Why `leaving` is a plain boolean

An earlier version derived it from *which route you left* and compared against
the current path. That read correctly on the way out but never cleared, so
returning to that same route later re-triggered the comparison and the nav
stayed stuck off-screen.

It is now a boolean reset when a new route commits, compared against the
previous pathname **during render** — React's documented pattern for resetting
state on a prop change. An effect would paint the stale frame first.

`SiteHeader` lives in the layout and never unmounts across navigation, which is
what makes this state survive the route change — and also why a stale flag is so
easy to get wrong here.

## Hover scramble

`useScramble` resolves text left-to-right out of random glyphs:

```
[6%9K  →  AbTC4  →  About
```

| Constant           | Value | Purpose                                     |
| ------------------ | ----- | ------------------------------------------- |
| `LOCK_STEP_MS`     | 55    | How long each character waits before locking |
| `ROLL_INTERVAL_MS` | 35    | How often unresolved characters re-roll      |

Re-rolling every animation frame reads as static rather than legible glyphs, so
the roll rate is throttled independently of the lock progression.

Applied to nav links, all CTA buttons, and footer navigation and social links —
via `ScrambleAction`, which also picks the right element type (link, external
anchor, or button).

**Accessibility:** the scrambled glyphs sit in an `aria-hidden` span with the
real label in a sibling `sr-only` span, so assistive tech never announces
`[6%9K`. `ScrambleAction` takes a `context` prop for distinguishing otherwise
identical labels — the three "Start a Project" buttons announce as
`Start a Project — Web Development` and so on.

Triggers on `focus` as well as hover, so keyboard users see it, and is skipped
entirely under `prefers-reduced-motion`.

> `useScramble` uses `Math.random()`. This is decorative glyph selection — no
> token or identifier derives from it — so a CSPRNG is not required. Noted
> because scanners flag the pattern reflexively.

## Reduced motion

`prefers-reduced-motion: reduce` collapses every animation to `0.01ms`, disables
smooth scrolling, and makes `useIntroGate` **skip the scroll lock entirely**.

That last part matters: holding someone who asked for reduced motion through a
three-second intro is worse than skipping it, since there's no animation for
them to watch.

## Adding animation to a new page

1. Add the route to `introRoutes` in `_lib/content/navigation.ts`
2. Render `<IntroBackdrop />` (or `<HeroBackground />` for video)
3. Apply the animation classes to your content:

```tsx
<h1 className="animate-title-in exiting:animate-fade-out text-display">
  {title}
</h1>

<div className="animate-desc-expand exiting:animate-desc-collapse grid w-full grid-rows-[0fr]">
  <div className="overflow-hidden">
    <div className="animate-desc-in exiting:animate-fade-out pt-6">
      {/* description, CTA */}
    </div>
  </div>
</div>
```

The simplest path is copying `_components/studio/cover.tsx`, which is already
wired correctly and is the smallest example.
