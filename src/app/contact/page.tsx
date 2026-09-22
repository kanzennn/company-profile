import type { Metadata } from "next";
import { ContactForm } from "../_components/contact/form";
import { IntroBackdrop } from "../_components/shared/intro-backdrop";
import { CornerMark } from "../_components/shared/marks";
import { contactPage } from "../_lib/content/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Kervzent Studio about web, mobile, or AI development work.",
};

export default function ContactPage() {
  return (
    <main
      id="main"
      className="relative isolate flex min-h-svh w-full flex-1 items-center justify-center overflow-hidden px-5 py-40 max-lg:py-28"
    >
      <IntroBackdrop />

      <div className="relative w-full max-w-200 px-20 py-20 max-lg:px-4 max-lg:py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 text-on-surface/40"
        >
          <CornerMark className="animate-mark-top exiting:animate-mark-merge-top absolute left-0 h-[30px] w-[30px]" />
          <CornerMark className="animate-mark-bottom exiting:animate-mark-merge-bottom absolute left-0 h-[30px] w-[30px]" />
          <CornerMark className="animate-mark-top exiting:animate-mark-merge-top absolute right-0 h-[30px] w-[30px]" />
          <CornerMark className="animate-mark-bottom exiting:animate-mark-merge-bottom absolute right-0 h-[30px] w-[30px]" />
        </div>

        <div className="flex w-full flex-col">
          <h1 className="animate-title-in exiting:animate-fade-out text-headline-lg font-bold">
            {contactPage.title}
          </h1>

          {/* Collapsed until it expands, so the frame — and the marks centred
              on it — line up with the title alone while it fades in. The gap
              below the title lives inside the clipped box rather than on the
              column, or it would hold the frame open while the row is at 0fr. */}
          <div className="animate-desc-expand exiting:animate-desc-collapse grid w-full grid-rows-[0fr]">
            {/* The padding widens the clip box and the negative margin takes
                the width back out of the layout, so the submit button's focus
                ring is not shaved off against the edge of the overflow. */}
            <div className="-mx-2 overflow-hidden px-2">
              <div className="animate-desc-in exiting:animate-fade-out flex flex-col gap-10 pt-10">
                <ContactForm />

                <p className="font-mono text-label text-on-surface/50">
                  Prefer email? Write to{" "}
                  <a
                    href={`mailto:${contactPage.directEmail}`}
                    className="text-on-surface/80 underline underline-offset-4 transition-colors hover:text-primary"
                  >
                    {contactPage.directEmail}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
