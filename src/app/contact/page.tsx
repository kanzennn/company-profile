import type { Metadata } from "next";
import { ContactForm } from "../_components/contact/form";
import { IntroBackdrop } from "../_components/shared/intro-backdrop";
import { CornerMarks } from "../_components/shared/marks";
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
        <CornerMarks className="inset-0 text-on-surface/40" />

        <div className="flex w-full flex-col gap-10">
          <h1 className="animate-title-in exiting:animate-fade-out text-headline-lg font-bold">
            {contactPage.title}
          </h1>

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
    </main>
  );
}
