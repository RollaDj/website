import { Artist } from "@/components/artist";
import { Contact } from "@/components/contact";
import { Credits } from "@/components/credits";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { Reviews } from "@/components/reviews";
import { ScrollFilm } from "@/components/scroll-film";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { FILM, getSiteUrl, SOCIALS } from "@/lib/site";

/** Année du copyright, figée au moment du rendu statique. */
async function getYear() {
  "use cache";
  return new Date().getFullYear();
}

export default async function HomePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const year = await getYear();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "ROLLA",
    alternateName: "Rolla DJ",
    url: new URL(`/${locale}`, getSiteUrl()).toString(),
    description: dict.meta.description,
    genre: ["House", "Electronic", "Jazz", "Live Music"],
    foundingLocation: { "@type": "Place", name: "Lyon, France" },
    areaServed: { "@type": "Country", name: "France" },
    sameAs: SOCIALS.map((s) => s.href),
  };

  return (
    <>
      <a
        href="#main"
        className="label-mono sr-only z-[70] bg-ivory px-4 py-3 text-noir focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {dict.a11y.skipToContent}
      </a>

      <SiteHeader locale={locale} nav={dict.nav} a11y={dict.a11y} />

      <main id="main">
        <Hero hero={dict.hero} />
        <ScrollFilm
          src={FILM.src}
          poster={FILM.poster}
          fps={FILM.fps}
          chapterStarts={FILM.chapterStarts}
          chapters={dict.film.chapters}
          label={dict.film.label}
          hint={dict.film.hint}
          sceneLabel={dict.film.scene}
          description={dict.film.description}
        />
        <Artist artist={dict.artist} photoAlts={dict.photos} />
        <Services services={dict.services} photoAlts={dict.photos} />
        <Gallery gallery={dict.gallery} photoAlts={dict.photos} />
        <Credits credits={dict.credits} />
        <Reviews locale={locale} reviews={dict.reviews} />
        <Contact contact={dict.contact} newTab={dict.a11y.newTab} />
      </main>

      <SiteFooter
        locale={locale}
        footer={dict.footer}
        languageSwitchLabel={dict.a11y.languageSwitch}
        year={year}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
