import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Link from "next/link";

import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

export const metadata: Metadata = {
  title: "404 — ROLLA",
  description: "Page introuvable / Page not found.",
};

/** 404 pour toute URL hors /fr et /en (bilingue). */
export default function GlobalNotFound() {
  return (
    <html lang="fr" className={archivo.variable}>
      <body className="bg-noir text-ivory antialiased">
        <main className="flex min-h-svh flex-col items-start justify-end gap-6 px-5 pb-16 sm:px-8 lg:px-12">
          <p className="eyebrow text-champagne">Erreur 404 — Error 404</p>
          <h1 className="display text-[9.4vw] leading-[0.85] lg:text-[8vw]">Page introuvable.</h1>
          <p lang="en" className="display text-3xl text-ivory/45">
            Page not found.
          </p>
          <nav className="mt-6 flex gap-3">
            <Link href="/fr" className="eyebrow bg-ivory px-6 py-4 text-noir hover:bg-champagne">
              Accueil
            </Link>
            <Link href="/en" lang="en" className="eyebrow border border-ivory/30 px-6 py-4 hover:border-champagne">
              Home
            </Link>
          </nav>
        </main>
      </body>
    </html>
  );
}
