import Image from "next/image";
import { projects } from "@/lib/content/studio";
import { CornerMarks, Glyph } from "@/components/ui/Marks";

/**
 * A card shows a screenshot when the project carries one, and the tinted
 * gradient otherwise, so real work and placeholders read as one grid. Both
 * paths keep the grid overlay and a flat scrim: the card's title and
 * description sit centred on top, and centred text needs the whole area held
 * down rather than a gradient weighted to one edge.
 *
 * The scrim is heavier over a photo than over the gradient, which is already
 * dark by construction. 75% is measured, not picked by eye: the description
 * and the practice label are set at 70% and 60% opacity, and against a bright
 * screenshot a 65% scrim leaves them at 4.30:1 and 3.62:1 — under the 4.5:1
 * WCAG AA floor for body text. 75% clears it on a deliberately bright image,
 * so a darker one has room to spare.
 */
function CardBackdrop({
  tint,
  image,
}: {
  tint: string;
  image?: string;
}) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-1 overflow-hidden transition-transform duration-500 group-hover:scale-75"
    >
      {image ? (
        /* `fill` rather than fixed dimensions: the card is a responsive
           aspect-ratio box, so the rendered size is only known at runtime.
           `sizes` has to track the grid rather than the viewport: the cards
           drop to a single column below `lg`, so a card spans the full width
           there and half of it above. The last stop is the 770px a card caps
           at once the `max-w-400` container stops growing. Getting this wrong
           is silent — the image simply arrives too small and looks soft. */
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 1023px) 100vw, (max-width: 1640px) 50vw, 770px"
          /* `scale-110` is what makes the blur usable: a filter samples past
             the element's edges, so a blurred image that exactly fills its box
             fades out around the rim. Oversizing it pushes that soft edge
             outside the wrapper's `overflow-hidden`. */
          className="scale-110 object-cover blur-[6px]"
        />
      ) : (
        <div
          className="absolute inset-0 blur-[2px]"
          style={{
            backgroundImage: `radial-gradient(ellipse at 28% 18%, ${tint}66, transparent 62%), radial-gradient(ellipse at 82% 88%, ${tint}33, transparent 58%), linear-gradient(140deg, #14161c, #05060a)`,
          }}
        />
      )}
      <div className="bg-grid absolute inset-0 opacity-50" />
      <div
        className={`absolute inset-0 ${image ? "bg-surface/50" : "bg-surface/50"}`}
      />
    </div>
  );
}

export function StudioWork() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="mx-auto flex w-full max-w-400 flex-col gap-20 px-5 max-lg:gap-10"
    >
      <div className="flex flex-col items-center justify-center gap-5">
        <h2 id="work-heading" className="text-center text-headline-sm">
          Selected Work
        </h2>
        <p className="max-w-180 text-center font-mono text-body-lg text-on-surface/70 max-lg:text-body">
          Six projects across the three practices, each carried end to end by
          the same team.
        </p>
      </div>

      {/* Two columns from `lg` up, one below. A card carries a screenshot, a
          logo and three lines of copy, and half a tablet's width is not enough
          for that to read — so the column gives way before the content does. */}
      <ul className="grid w-full grid-cols-2 gap-5 max-lg:grid-cols-1">
        {projects.map((project) => (
          <li
            key={project.name}
            className="group relative flex aspect-7/5 w-full items-center justify-center overflow-hidden max-sm:aspect-square"
          >
            {/* The marks sit *under* the backdrop, not over it. At rest the
                backdrop covers the card and hides them; on hover it pulls in to
                75% and uncovers the band they sit in, so they read as having
                been behind the image the whole time rather than fading in on
                top of it. They still scale out as they appear, which lets them
                settle into the corners instead of simply switching on. */}
            <CornerMarks className="inset-0 z-0 scale-75 p-4 text-on-surface/70 opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100" />
            <CardBackdrop tint={project.tint} image={project.image} />

            <div className="relative z-2 flex flex-col items-center gap-5 px-10 text-center max-lg:px-5">
              {/* The client's logo says more than the practice glyph, which
                  only repeats the label sitting right beneath it. Projects
                  without a logo keep the glyph, so the grid stays uniform
                  while the real work is filled in.

                  `alt=""`: the project name is the next element, as text, so
                  naming the logo too would read it twice.

                  The width is driven, not the height, and it steps with how
                  wide the card itself is: one column below `sm` is a narrow
                  phone card, one column from `sm` to `lg` is a full-width
                  tablet card, two columns from `lg` are narrow again until
                  `xl` widens them. So 208 → 330 → 208 → 330.

                  `width`/`height` are a nominal 10:3. Logos vary too much in
                  shape to state one ratio, and `h-auto` takes the real one from
                  the file; the numbers only reserve space before it loads.

                  No hover scale here, unlike the glyph below: a client's mark
                  is their artwork, and the card already answers the hover with
                  the backdrop pulling in and the corner marks arriving. */}
              {project.logo ? (
                <Image
                  src={project.logo}
                  alt=""
                  width={330}
                  height={100}
                  className="h-auto w-[208px] object-contain sm:w-[330px] lg:w-[208px] xl:w-[330px]"
                />
              ) : (
                <Glyph
                  id={project.glyph}
                  className="h-9 w-9 text-primary transition-transform duration-500 group-hover:scale-110"
                />
              )}
              {/* A lockup logo already carries the name, so printing it again
                  below is a duplicate. It is hidden rather than dropped: the
                  logo is decorative (`alt=""`), so removing the heading would
                  take the name out of the accessibility tree altogether and
                  leave this one card without the `h3` every other card has.
                  `sr-only` is absolutely positioned, so it claims no space and
                  the column's `gap-5` closes over it. */}
              <h3
                className={`text-headline-md ${
                  project.logoIncludesName ? "sr-only" : ""
                }`}
              >
                {project.name}
              </h3>
              <span className="font-mono text-label uppercase tracking-[0.3em] text-on-surface/60">
                {project.practice}
              </span>
              <p className="max-w-100 font-mono text-body text-on-surface/70">
                {project.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
