import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { SiteFooter } from "./_components/shared/site-footer";
import { SiteHeader } from "./_components/shared/site-header";
import { siteUrl } from "./_lib/site-url";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-kervzent-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-kervzent-mono",
  subsets: ["latin"],
});

const siteName = "Kervzent Studio";
const title = "Kervzent Studio — Web, Mobile, and AI Development";
const description =
  "Kervzent Studio designs and engineers websites, mobile applications, and AI systems — from first prototype to production.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${siteName}` },
  description,
  applicationName: siteName,
  openGraph: {
    type: "website",
    siteName,
    title,
    description,
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Tells Next the smooth scrolling in globals.css is deliberate, so it
      // suppresses it during route transitions instead of animating them.
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface font-sans text-on-surface">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:bg-primary focus:px-5 focus:py-3 focus:font-mono focus:text-body"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
