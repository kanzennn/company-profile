# Design system

All tokens are declared in `src/app/globals.css` inside Tailwind v4 `@theme`
blocks. There is no `tailwind.config.js` — v4 reads the theme from CSS.

**The rule:** use semantic utilities, never raw values. `bg-primary`, not
`bg-[#ff5623]`. `text-display`, not `text-[60px]`. A token change should
propagate everywhere without a find-and-replace.

## Colour

| Token                   | Value                | Utility examples                   | Role                                   |
| ----------------------- | -------------------- | ---------------------------------- | -------------------------------------- |
| `--color-surface`       | `#000000`            | `bg-surface`                       | Page background                        |
| `--color-on-surface`    | `#fdfcf4`            | `text-on-surface`                  | Foreground text and icons (warm white) |
| `--color-primary`       | `#ff5623`            | `bg-primary`, `text-primary`       | Accent, CTAs, focus ring               |
| `--color-primary-pressed` | `#f35422`          | `hover:bg-primary-pressed`         | CTA hover state                        |
| `--color-outline`       | `rgb(255 255 255 / 0.2)` | `border-outline`              | Borders and dividers                   |
| `--color-surface-tint`  | `rgb(255 255 255 / 0.05)` | `bg-surface-tint`            | Glass panels, raised cards             |

### Opacity: colour-alpha, not `opacity-*`

Use `text-on-surface/70` rather than `opacity-70` on anything that animates.

This is not stylistic. The entry animations end at `opacity: 1`, and with
`animation-fill-mode: both` that final value **overrides** an `opacity-70`
class, leaving the element fully opaque once the animation settles. Encoding the
transparency in the colour keeps the two independent. This bit the hero
paragraph and the scroll cue during development.

## Typography

Two families, both loaded through `next/font` and self-hosted (no runtime
request to Google, which also keeps the CSP's `font-src 'self'` intact).

| Role    | Family        | CSS variable            | Utility      |
| ------- | ------------- | ----------------------- | ------------ |
| Display | Space Grotesk | `--font-kervzent-sans`  | `font-sans`  |
| Mono    | JetBrains Mono| `--font-kervzent-mono`  | `font-mono`  |

### Scale

| Utility            | Size                          | Line height | Tracking   |
| ------------------ | ----------------------------- | ----------- | ---------- |
| `text-display`     | `clamp(2.75rem, 7.5vw, 3.75rem)` — 44→60px | 0.95 | −0.025em |
| `text-headline-lg` | `clamp(2.25rem, 5.5vw, 3.75rem)` — 36→60px | 1    | −0.025em |
| `text-headline-md` | `clamp(2rem, 4.5vw, 3rem)` — 32→48px       | 1    | −0.025em |
| `text-headline-sm` | `clamp(1.75rem, 5vw, 2.75rem)` — 28→44px   | 1    | −0.025em |
| `text-title`       | `1.25rem` — 20px              | 1.2         | —          |
| `text-body-lg`     | `1.125rem` — 18px             | 1.556       | −0.0167em  |
| `text-body`        | `1rem` — 16px                 | 1.5         | —          |
| `text-label`       | `0.75rem` — 12px              | 1.333       | —          |

Display and headline sizes are fluid: they scale with viewport width between a
floor and a ceiling. `text-display` reaches its 60px ceiling at an 800px
viewport, so every desktop width renders identically.

`text-display` and `text-headline-lg` currently share a 60px ceiling. Nothing
uses both together, but they'd need separating if you want them visually
distinct.

### Monospace is load-bearing for the scramble

The hover scramble effect substitutes random glyphs into text. In a proportional
face each substitution changes the text width and the layout jitters. Every
element using `useScramble` — nav links, all CTAs, footer links — is set in
`font-mono` for exactly this reason. **If you switch any of them to `font-sans`,
the scramble will start shifting the layout.** See
[Animations](./animations.md#hover-scramble).

## Shape and spacing

| Token          | Value | Utility     |
| -------------- | ----- | ----------- |
| `--radius-md`  | `6px` | `rounded-md` |

Spacing uses Tailwind's default 4px base, which already matches the design's
scale (4 / 8 / 20 / 24 / 40px → `gap-1` / `gap-2` / `gap-5` / `gap-6` / `gap-10`).
Tailwind v4 accepts arbitrary bare numbers, so `max-w-400` (1600px) and
`gap-60` (240px) are valid without extending the theme.

## Custom utilities and variants

| Name           | Type    | Purpose                                                  |
| -------------- | ------- | -------------------------------------------------------- |
| `bg-grid`      | utility | 80px white grid lines at 5% opacity, for backdrops       |
| `intro-ready:` | variant | Applies when `<html>` has `data-intro="ready"`           |
| `exiting:`     | variant | Applies when `<html>` has `data-exiting`                 |

The two variants differ deliberately in specificity:

```css
@custom-variant intro-ready (&:where(html[data-intro="ready"] *));
@custom-variant exiting (html[data-exiting] &);
```

`intro-ready` is wrapped in `:where()`, keeping its specificity at zero so it
behaves like an ordinary utility. `exiting` is **not**, giving it higher
specificity — it has to override the entry animation already sitting on the same
element. Without that, which rule won would depend on Tailwind's emission order.

## Base layer

Set globally in `@layer base`:

- `html` carries the surface background, on-surface text, and `scroll-behavior: smooth`
- `scrollbar-gutter: stable` — reserves the scrollbar track so the scroll lock
  engaging doesn't shift the page sideways
- `html[data-intro-lock]`, `html[data-exit-lock]` → `overflow: hidden`
- `::selection` uses primary on on-surface
- `:focus-visible` → 2px primary outline, 3px offset
- `prefers-reduced-motion` collapses all animation durations to `0.01ms`

## Relationship to DESIGN.md

`DESIGN.md` in the project root is the source token registry, extracted from
computed styles. Two deliberate deviations:

**Fonts.** The registry specifies `PPMori` and `PPSupplyMono`, both commercial
licenses. Space Grotesk and JetBrains Mono stand in — close in character and
free to use. To swap in the licensed families, change the two `next/font` calls
in `layout.tsx`; every token references the CSS variables, so nothing else moves.

**Display line-height.** The registry pairs the display size with a 1.5
line-height, but explicitly flags that pairing as *inferred rather than
measured*. At display sizes that reads as broken spacing, so display type is set
solid (0.95). The note is preserved as a comment in `globals.css`.

The display ceiling was also lowered from the registry's 116.48px to 60px as a
later design decision.
