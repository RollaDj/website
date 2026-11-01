import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { localeMeta, locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getSiteUrl, isIndexingAllowed, SITE_NAME } from "@/lib/site";

import "../globals.css";

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#0a0a09",
  colorScheme: "dark",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const indexable = isIndexingAllowed();

  return {
    metadataBase: getSiteUrl(),
    title: dict.meta.title,
    description: dict.meta.description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
        "x-default": "/fr",
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: `/${locale}`,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: localeMeta[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].og),
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/og-image.jpg"],
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${serif.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-svh bg-noir text-ivory">
        {children}
        <div className="film-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
