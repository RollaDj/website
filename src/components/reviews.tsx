import { localeMeta, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { REVIEWS, type Review } from "@/lib/reviews";
import { frenchTypography } from "@/lib/typography";

import { SectionHeading } from "./section-heading";

type Props = {
  locale: Locale;
  reviews: Dictionary["reviews"];
};

export function Reviews({ locale, reviews }: Props) {
  const formatDate = new Intl.DateTimeFormat(localeMeta[locale].intl, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const items = REVIEWS.map((review) =>
    review.lang === "fr" ? frenchTypography(review) : review,
  );
  const [featured, ...others] = items;

  const caption = (review: Review) => (
    <figcaption className="label-mono mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-ivory/45">
      <span className="text-ivory/80">{review.author}</span>
      <span aria-hidden="true">·</span>
      <span>
        {reviews.weddingOn}{" "}
        <time dateTime={review.date}>{formatDate.format(new Date(`${review.date}T00:00:00Z`))}</time>
      </span>
      <span aria-hidden="true">·</span>
      <span>
        {reviews.verified} {reviews.source} ✓
      </span>
    </figcaption>
  );

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="mx-auto max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12 lg:py-44"
    >
      <div className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading index={reviews.index} label={reviews.label} id="reviews-title">
          {reviews.title}
        </SectionHeading>
        <p className="max-w-sm text-sm leading-relaxed text-ivory/50 lg:text-right">
          {reviews.intro}
          {reviews.originalLanguage && (
            <>
              <br />
              {reviews.originalLanguage}
            </>
          )}
        </p>
      </div>

      {/* Avis à la une */}
      <figure lang={featured.lang} className="reveal mt-20 border-t border-ivory/15 pt-14 lg:mt-24 lg:grid lg:grid-cols-12 lg:gap-12">
        <blockquote className="contents">
          <p className="font-serif text-5xl italic leading-[1] text-balance sm:text-6xl lg:col-span-6 lg:text-7xl">
            “{featured.title}”
          </p>
          <p className="mt-8 text-lg leading-relaxed text-ivory/70 lg:col-span-5 lg:col-start-8 lg:mt-0">
            {featured.quote}
          </p>
        </blockquote>
        <div className="lg:col-span-5 lg:col-start-8">{caption(featured)}</div>
      </figure>

      {/* Autres avis */}
      <ul className="mt-20 grid gap-px bg-ivory/10 md:grid-cols-2">
        {others.map((review) => (
          <li key={review.id} className="reveal bg-noir py-10 md:p-10 lg:p-14">
            <figure lang={review.lang}>
              <blockquote>
                <p className="font-serif text-3xl italic leading-tight lg:text-4xl">“{review.title}”</p>
                <p className="mt-5 text-[0.95rem] leading-relaxed text-ivory/65">{review.quote}</p>
              </blockquote>
              {caption(review)}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
