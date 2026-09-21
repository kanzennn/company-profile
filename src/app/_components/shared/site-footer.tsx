import { Wordmark } from "./marks";
import { ScrambleAction } from "./scramble-action";
import { footerLegal, footerNav, footerSocial } from "../../_lib/content/navigation";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-400 px-5 pb-10">
      <div className="flex flex-col gap-20 border-t border-outline/50 pt-20 max-lg:gap-10 max-lg:pt-10">
        <div className="flex justify-between gap-10 max-lg:flex-col">
          <div className="flex flex-col gap-6">
            <Wordmark />
            <p className="max-w-100 text-headline-md">
              Websites, mobile apps, and AI for teams that need to ship.
            </p>
          </div>

          <div className="flex gap-20 max-lg:gap-10">
            <FooterColumn title="Navigation" links={footerNav} />
            <FooterColumn title="Social" links={footerSocial} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-5 border-t border-outline/50 pt-5 font-mono text-label opacity-60 max-lg:flex-col max-lg:items-start">
          <span>{new Date().getFullYear()}&copy; | All Rights Reserved</span>
          <div className="flex gap-6">
            {footerLegal.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-opacity hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <span className="font-mono text-label uppercase tracking-[0.3em] opacity-50">
        {title}
      </span>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <ScrambleAction
              href={link.href}
              label={link.label}
              className="font-mono text-body opacity-80 transition-opacity hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
