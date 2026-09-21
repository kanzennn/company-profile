import { aboutStory } from "../../_lib/content/about";

export function AboutStory() {
  return (
    <>
      {aboutStory.map((block, index) => (
        <section
          key={block.heading}
          id={index === 0 ? "how-we-got-here" : "growth"}
          aria-label={index === 0 ? "How we got here" : "How we grew"}
          className="mx-auto w-full max-w-400 px-5"
        >
          <div className="grid w-full grid-cols-2 gap-10 max-lg:grid-cols-1 max-lg:gap-5">
            <p className="text-headline-sm">{block.heading}</p>
            <p className="font-mono text-body-lg text-on-surface/70 max-lg:text-body">
              {block.body}
            </p>
          </div>
        </section>
      ))}
    </>
  );
}
