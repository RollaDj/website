import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";

import { PageShell } from "@/components/layout/page-shell";
import { LegalPage } from "@/components/pages/legal-page";
import { WeddingsPage } from "@/components/pages/weddings-page";
import { hasLocale } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { pageFromSlug, pages, type PageKey } from "@/i18n/routes";
import { buildMetadata } from "@/lib/seo";

/** Pages secondaires, avec des adresses traduites (/fr/mariage, /en/weddings…). */
export async function generateStaticParams() {
  const locale = await lang();
  if (!hasLocale(locale)) return [];
  return (Object.keys(pages) as PageKey[])
    .filter((key) => key !== "home")
    .map((key) => ({ slug: pages[key][locale] }));
}

/** Les adresses inconnues ou dans la mauvaise langue sont traitées par src/proxy.ts. */
async function resolve(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const locale = await getLocale();
  const page = pageFromSlug(slug, locale);
  if (!page) notFound();
  return { locale, page };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { locale, page } = await resolve(params);
  return buildMetadata(locale, page, await getDictionary(locale), { noindex: page === "legal" });
}

export default async function SecondaryPage({ params }: PageProps<"/[lang]/[slug]">) {
  const { locale, page } = await resolve(params);
  const dict = await getDictionary(locale);

  return (
    <PageShell locale={locale} page={page} dict={dict}>
      {page === "weddings" ? <WeddingsPage locale={locale} dict={dict} /> : <LegalPage locale={locale} dict={dict} />}
    </PageShell>
  );
}
