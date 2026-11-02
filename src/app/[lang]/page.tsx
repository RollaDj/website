import type { Metadata } from "next";

import { ContactSection } from "@/components/contact/contact-section";
import { Artist } from "@/components/home/artist";
import { Bookings } from "@/components/home/bookings";
import { Experience } from "@/components/home/experience";
import { Formats } from "@/components/home/formats";
import { Hero } from "@/components/home/hero";
import { Performances } from "@/components/home/performances";
import { TrustedBy } from "@/components/home/trusted-by";
import { PageShell } from "@/components/layout/page-shell";
import { heroCutout } from "@/content/media";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { artistJsonLd, buildMetadata, JsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata(locale, "home", await getDictionary(locale));
}

export default async function HomePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <PageShell locale={locale} page="home" dict={dict}>
      <Hero locale={locale} hero={dict.hero} tags={dict.mediaTag} cutout={heroCutout} />
      <Experience copy={dict.experience} tags={dict.mediaTag} />
      <Artist locale={locale} dict={dict} />
      <Formats locale={locale} formats={dict.formats} tags={dict.mediaTag} />
      <Performances locale={locale} copy={dict.performances} tags={dict.mediaTag} />
      <TrustedBy copy={dict.trusted} />
      <Bookings locale={locale} copy={dict.bookings} />
      <ContactSection locale={locale} dict={dict} index="07" />
      <JsonLd data={artistJsonLd(locale, dict)} />
    </PageShell>
  );
}
