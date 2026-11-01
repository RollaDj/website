import type { Viewport } from "next";
import { Archivo } from "next/font/google";

import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { locales } from "@/i18n/config";
import { getLocale } from "@/i18n/dictionaries";

import "../globals.css";

/** Police unique, à largeur variable : étendue pour les titres, normale pour les textes. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${archivo.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Masque les éléments d'intro avant l'animation (filet de sécurité : 3,5 s). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');setTimeout(function(){document.documentElement.classList.add('intro-done')},3500)",
          }}
        />
      </head>
      <body className="min-h-svh bg-noir text-ivory">
        <SmoothScroll />
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
