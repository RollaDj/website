import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif } from "next/font/google";
import Link from "next/link";

import "./globals.css";

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: "italic",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "404 — ROLLA",
  description: "Page introuvable / Page not found.",
};

/** 404 pour toute URL qui ne correspond à aucune route (bilingue). */
export default function GlobalNotFound() {
  return (
    <html lang="fr" className={`${serif.variable} ${mono.variable}`}>
      <body className="bg-noir text-ivory antialiased">
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-5 text-center">
          <p className="label-mono text-ivory/50">Erreur 404 — Error 404</p>
          <h1 className="font-serif text-6xl italic sm:text-8xl">Fin de bobine.</h1>
          <p lang="en" className="font-serif text-3xl italic text-ivory/55">
            End of reel.
          </p>
          <nav className="label-mono mt-8 flex gap-4">
            <Link href="/fr" className="border border-ivory/40 px-6 py-3 hover:bg-ivory hover:text-noir">
              Accueil
            </Link>
            <Link href="/en" lang="en" className="border border-ivory/40 px-6 py-3 hover:bg-ivory hover:text-noir">
              Home
            </Link>
          </nav>
        </main>
      </body>
    </html>
  );
}
