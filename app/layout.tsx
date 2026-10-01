import { site } from "@/config/site";
import { getCheckoutUrl, getCompleteAuthors, getSiteUrl } from "@/lib/publication";
import type { Metadata, Viewport } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
});

const siteUrl = getSiteUrl();
const checkoutReady = Boolean(getCheckoutUrl());
const authors = getCompleteAuthors();

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.seo.description,
  applicationName: site.name,
  ...(authors.length > 0 ? { authors: authors.map((author) => ({ name: author.name })) } : {}),
  robots: checkoutReady ? { index: true, follow: true } : { index: false, follow: false },
  ...(siteUrl ? { metadataBase: siteUrl, alternates: { canonical: "/" } } : {}),
  openGraph: {
    title: site.name,
    description: site.seo.description,
    locale: "pt_BR",
    type: "website",
    siteName: site.name,
    ...(siteUrl ? { url: siteUrl.toString() } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.seo.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c2340",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${sourceSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white font-sans text-ink antialiased" data-checkout={checkoutReady ? "ready" : "preview"}>
        <a className="skip-link" href="#conteudo-principal">
          Ir para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
