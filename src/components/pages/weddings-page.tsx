import Image from "next/image";

import { ContactSection } from "@/components/contact/contact-section";
import { ButtonLink, Arrow } from "@/components/ui/button-link";
import { MediaTag } from "@/components/ui/media-tag";
import { SectionLabel } from "@/components/ui/section-label";
import { weddingsHeroMedia } from "@/content/media";
import { WEDDING_TESTIMONIALS, WEDDING_TESTIMONIALS_SOURCE } from "@/content/testimonials";
import { localeMeta, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pathFor } from "@/i18n/routes";
import { JsonLd, weddingsJsonLd } from "@/lib/seo";
import { frenchTypography } from "@/lib/typography";

type Props = { locale: Locale; dict: Dictionary };

/** Page dédiée aux mariages (intérêt commercial et SEO). */
export function WeddingsPage({ locale, dict }: Props) {
  const t = dict.weddings;
  const media = weddingsHeroMedia;
  const formatDate = new Intl.DateTimeFormat(localeMeta[locale].intl, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const testimonials = WEDDING_TESTIMONIALS.map((r) => (r.lang === "fr" ? frenchTypography(r) : r));

  return (
    <>
      {/* En-tête */}
      <section className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden px-5 pb-14 pt-32 sm:px-8 lg:px-12 lg:pb-20">
        <div className="absolute inset-0 -z-10">
          <Image src={media.image} alt={media.alt[locale]} fill priority sizes="100vw" className="tone object-cover object-[center_30%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/60 to-noir/30" />
        </div>
        <MediaTag status={media.status} labels={dict.mediaTag} note={media.note} className="absolute right-5 top-24 sm:right-8 lg:right-12" />
        <p className="eyebrow text-champagne">{t.kicker}</p>
        <h1 data-split className="display mt-6 max-w-6xl text-[13vw] text-balance sm:text-7xl xl:text-[8.5vw]">
          {t.title}
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <p data-reveal className="max-w-xl text-lg leading-relaxed text-ivory/75 lg:col-span-6">
            {t.intro}
          </p>
          <div data-reveal className="flex flex-wrap gap-3 lg:col-span-5 lg:col-start-8 lg:justify-end">
            <ButtonLink href="#contact">
              {t.ctaTitle} <Arrow />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Le déroulé */}
      <section aria-labelledby="moments-title" className="border-t border-ivory/10">
        <div className="mx-auto max-w-[1680px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <SectionLabel index="01">{t.momentsTitle}</SectionLabel>
          <h2 id="moments-title" className="sr-only">
            {t.momentsTitle}
          </h2>
          <ol className="mt-14 grid gap-px bg-ivory/10 lg:grid-cols-3">
            {t.moments.map((moment, i) => (
              <li key={moment.name} data-reveal data-reveal-delay={i * 0.08} className="bg-noir p-8 lg:p-10">
                <span className="eyebrow text-champagne tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display mt-10 text-3xl sm:text-4xl lg:text-[clamp(1.75rem,2.6vw,3rem)]">{moment.name}</h3>
                <p className="mt-6 max-w-sm leading-relaxed text-ivory/65">{moment.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Les formules */}
      <section aria-labelledby="formulas-title" className="border-t border-ivory/10 bg-anthracite/30">
        <div className="mx-auto grid max-w-[1680px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-36">
          <div className="lg:col-span-4">
            <SectionLabel index="02">{t.kicker}</SectionLabel>
            <h2 id="formulas-title" data-split className="display mt-8 text-[8.2vw] sm:text-5xl lg:text-[3.3vw]">
              {t.formatsTitle}
            </h2>
          </div>
          <ul className="border-b border-ivory/15 lg:col-span-7 lg:col-start-6">
            {t.formats.map((format) => (
              <li key={format.name} data-reveal className="grid gap-3 border-t border-ivory/15 py-8 sm:grid-cols-2 sm:gap-10">
                <h3 className="display text-2xl xl:text-3xl">{format.name}</h3>
                <p className="leading-relaxed text-ivory/65">{format.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Avis réels */}
      <section aria-labelledby="reviews-title" className="border-t border-ivory/10">
        <div className="mx-auto max-w-[1680px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel index="03">{WEDDING_TESTIMONIALS_SOURCE}</SectionLabel>
              <h2 id="reviews-title" data-split className="display mt-8 text-[8.2vw] sm:text-5xl lg:text-6xl xl:text-7xl">
                {t.reviewsTitle}
              </h2>
            </div>
            <p data-reveal className="text-sm leading-relaxed text-ivory/55 lg:col-span-4 lg:col-start-9">
              {t.reviewsSource} {WEDDING_TESTIMONIALS_SOURCE}.
              {t.originalLanguage && (
                <>
                  <br />
                  {t.originalLanguage}
                </>
              )}
            </p>
          </div>
          <ul className="mt-16 grid gap-px bg-ivory/10 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((review) => (
              <li key={review.id} data-reveal className="bg-noir">
                <figure lang={review.lang} className="flex h-full flex-col p-8 lg:p-10">
                  <blockquote className="flex-1">
                    <p className="display text-2xl leading-tight text-champagne">“{review.title}”</p>
                    <p className="mt-6 text-[0.95rem] leading-relaxed text-ivory/70">{review.quote}</p>
                  </blockquote>
                  <figcaption className="eyebrow mt-8 text-[0.625rem] text-ivory/45">
                    <span className="text-ivory/80">{review.author}</span> · {t.weddingOn}{" "}
                    <time dateTime={review.date}>{formatDate.format(new Date(`${review.date}T00:00:00Z`))}</time> ·{" "}
                    {WEDDING_TESTIMONIALS_SOURCE} ✓
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactSection
        locale={locale}
        dict={dict}
        index="04"
        title={t.ctaTitle}
        text={t.ctaText}
        defaultEventType="wedding"
      />

      <div className="border-t border-ivory/10 px-5 py-10 sm:px-8 lg:px-12">
        <a href={pathFor("home", locale)} className="eyebrow group inline-flex items-center gap-3 text-ivory/70 hover:text-champagne">
          <span aria-hidden="true">←</span> {t.back}
        </a>
      </div>

      <JsonLd data={weddingsJsonLd(locale, dict)} />
    </>
  );
}
