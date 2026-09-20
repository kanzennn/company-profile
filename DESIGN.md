# Kervzent Design System

> Captured from computed styles on `https://www.moonsworth.com` — 595 DOM elements walked, 2 color spaces detected (`rgb`, `oklab`), 4 web components noted (Shadow DOM content may be under-sampled). No named CSS custom properties were recovered: the page reports 3 color-related custom properties (`colorVarTotal: 3`) but `brandPrefixedVars` came back empty, so nothing here is sourced from `--geist-*` / `--color-*` / `--brand-*` / `--theme-*` / `--ds-*` names — every token below is derived from computed/rendered values only. Treat this file as a **starting token registry for Kervzent**, not a finalized brand decision.

## YAML Configuration

```yaml
version: "1.0"
name: Kervzent
description: >
  Frequency-weighted design tokens extracted from moonsworth.com's rendered
  styles, registered as a starting point for the Kervzent design system.
omitted:
  - colors.secondary        # no second chromatic color cleared the 3-sample confidence bar
  - colors.on-secondary
  - colors.tertiary         # no third chromatic color cleared the 3-sample confidence bar
  - colors.on-tertiary
  - colors.on-primary       # no captured sample pairs text against colors.primary
  - colors.primary-container
  - colors.on-primary-container
  - colors.error
  - colors.on-error
  - colors.surface-variant
  - colors.on-surface-variant
  - colors.inverse-surface
  - colors.inverse-on-surface
  - components              # no hover/active/pressed state data was captured
  - shadows / elevation     # topShadows was empty in the extraction
  - gradients                # linear/radial/conic gradient counts were all 0
colors:
  # --- roles assigned (each backed by >=3 total samples) ---
  surface: "rgb(0, 0, 0)"
    # surface because: direct background sample is thin (count 1), but this
    # value is the only plausible base for the page — it's the dominant TEXT
    # color's contrast partner (rgb(0,0,0) is used as text 82x, which only
    # makes sense on a light surface) and the only way to explain why
    # rgb(253,252,244) is used as text 356x (needs a dark base to read against).
    # Direct bg evidence is weak — verify against the live site's root/body background.
  on-surface: "rgb(253, 252, 244)"
    # on-surface because frequency 356 as the top text color (plus 64 as the
    # top SVG fill) — by far the most-used foreground color in the capture.
  primary: "rgb(255, 86, 35)"
    # primary because frequency 8 in background (highest-frequency chromatic/
    # non-neutral background color) + 1 as text — the brand accent/CTA color.
  outline: "oklab(0.999994 0.0000455678 0.0000200868 / 0.2)"
    # outline because frequency 3 in border colors — the only border color captured.
  surface-tint: "oklab(0.999994 0.0000455678 0.0000200868 / 0.05)"
    # surface-tint because frequency 4 in background — a translucent white
    # overlay distinct from solid surface/on-surface, likely a hover/glass tint.

  # --- captured but unassigned: below the 3-sample bar, per hard rule ---
  unassigned-white: "rgb(255, 255, 255)"  # low-confidence — verify on live site (count 1)
  unassigned-orange-alt: "rgb(243, 84, 34)"  # low-confidence — verify on live site (count 2; visually close to colors.primary but a distinct sampled value — not enough samples to say whether it's an intentional hover/pressed shade or measurement noise)

typography:
  # NOTE: fontSize, lineHeight and letterSpacing were captured as three
  # independent frequency tables, not per-element tuples — the pairings
  # below are inferred by matching scale position and sample count, not
  # verified 1:1. Confirm against the live site before shipping.
  display:
    fontFamily: "PPMori, \"PPMori Fallback\""
    fontSize: 116.48px
    fontWeight: "400"
    lineHeight: 174.72px   # count 3
    letterSpacing: -2.912px # count 6 — most-frequent tracking value, paired with the largest size
  headline-lg:
    fontFamily: "PPMori, \"PPMori Fallback\""
    fontSize: 60px
    fontWeight: "400"
    lineHeight: 60px       # count 3
    letterSpacing: -1.5px  # count 3
  headline-md:
    fontFamily: "PPMori, \"PPMori Fallback\""
    fontSize: 48px
    fontWeight: "400"
    lineHeight: 44px       # count 4
    letterSpacing: -1.2px  # count 2 — thin sample, verify
  headline-sm:
    fontFamily: "PPMori, \"PPMori Fallback\""
    fontSize: 44px
    fontWeight: "400"
    lineHeight: 44px       # count 4
    letterSpacing: -1.1px  # count 4
  title:
    fontFamily: "PPMori, \"PPMori Fallback\""
    fontSize: 20px
    fontWeight: "400"
    lineHeight: 24px
  body-lg:
    fontFamily: "PPMori, \"PPMori Fallback\""
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px       # count 18
    letterSpacing: -0.3px  # count 5
  body:
    fontFamily: "PPMori, \"PPMori Fallback\""
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px       # count 551 — overwhelmingly the dominant size/line-height pair; the default body style
  label:
    fontFamily: "PPSupplyMono, \"PPSupplyMono Fallback\""
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 16px       # count 5

rounded:
  DEFAULT: 6px  # low-confidence — verify on live site (only radius sample captured, count 1)

spacing:
  unit: 8px   # count 16 — most-frequent gap, the base grid unit
  2xs: 4px    # count 5
  md: 20px    # count 5
  lg: 24px    # count 10
  xl: 40px    # count 3
```

## Brand & Style

The captured pattern reads as a dark, minimal, editorial system: a near-black base (`colors.surface`) carrying off-white/cream foreground text and iconography (`colors.on-surface`, used 356x as text and 64x as SVG fill), with a single saturated orange (`colors.primary`) reserved for accents — it shows up 8 of the 9 non-neutral background samples and nowhere else with comparable frequency, consistent with a CTA/highlight color rather than a body surface. `fontWeights` reported only `"400"` across the whole page, so hierarchy here is carried by font-family switching (`PPMori` for display/body copy at 522 samples vs. `PPSupplyMono` for compact/label text at 67 samples) and by scale + negative tracking rather than by weight.

## Colors

Two font-adjacent facts shape how confidently each color can be used. `colors.surface` has strong *indirect* evidence (it is the only value that explains 356 cream text samples and 82 black text samples coexisting) but weak *direct* background evidence (a single background sample) — flagged above, worth a manual check against the live site's `<body>`/`<html>` background before treating it as certain. `colors.primary`, `colors.outline`, and `colors.surface-tint` all clear the 3-sample bar directly. No sample paired text against an orange background, so `on-primary` is left out rather than guessed — check that manually too. `unassigned-white` and `unassigned-orange-alt` are kept in the registry per your "don't drop colors" instruction, but sit below the confidence bar and are excluded from every semantic role.

## Typography

`PPMori` carries almost everything (522 of 595 elements) and is the default family for both body and display sizes; `PPSupplyMono` (67 samples) is reserved for the smallest scale step, consistent with a mono label/eyebrow/nav-tag treatment layered on top of the main typeface. `Times New Roman` also appeared (6 samples) but with no distinguishing size/weight/spacing signal of its own — most likely a fallback rendering somewhere rather than an intentional type choice, so it isn't promoted to a scale token here. Line-height 24px is overwhelmingly dominant (551 of ~586 line-height samples), which is why `body` is treated as the system default; everything above it tightens progressively (60px → 44px line-heights) as letter-spacing goes more negative (-1.1px → -2.912px), the standard "bigger text, tighter tracking" pattern — plausible, but the exact size/line-height pairings are inferred rather than measured per-element.

## Layout & Spacing

Gaps cluster around an 8px base unit (16 samples, the most frequent single value), with 24px (10 samples) as the next most common step — likely section/card-level spacing — and 4px/20px (5 samples each) and 40px (3 samples) rounding out the scale. No shadow or elevation data was captured (`topShadows` was empty), so there's nothing here to register as an elevation system; `backdropFilter: blur(24px)` appeared once and `clip-path` twice, both too thin to promote past a passing note — if Kervzent wants a frosted/blur treatment, that's worth confirming on the live site rather than taking from this extraction.

## Shapes

Only one border-radius value was captured — `6px`, a single sample — so `rounded.DEFAULT` is marked low-confidence. Treat it as a hint, not a settled radius scale; there isn't enough data here to derive `sm`/`md`/`lg`/`full` steps the way a fuller capture would support.

## Components

No hover/active/pressed/disabled state data was in the extraction, so no `components` block is defined — inventing button/card/input compositions from a single static pass would mean guessing at states this data doesn't show. `colors.primary`, `colors.surface`, `colors.on-surface`, `typography.body`, and `spacing.unit` are the tokens most likely to compose cleanly into a first `button-primary` / `card` pass once Kervzent's actual interaction states are designed.
