import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CountryPageView } from "@/components";
import { routing } from "@/i18n/routing";
import { findCountry, listCountryCodesSorted } from "@/lib/data/countries";
import type { Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/lib/seo/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { countryPath } from "@/lib/seo/paths";
import { formatCountryRegion } from "@/lib/time/display";

type Props = {
  params: Promise<{ locale: string; countryCode: string }>;
};

export function generateStaticParams() {
  return listCountryCodesSorted().map((code) => ({
    countryCode: code.toLowerCase(),
  }));
}

export async function generateMetadata(props: Props) {
  const { locale, countryCode } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: "Countries Time" };
  }
  const hit = findCountry(countryCode);
  if (!hit) {
    return { title: "Countries Time" };
  }
  const tc = await getTranslations({ locale, namespace: "Country" });
  const pretty = formatCountryRegion(hit.code, locale as Locale);
  const path = countryPath(hit.code);

  return buildPageMetadata({
    locale: locale as Locale,
    title: tc("metaTitle", { country: pretty }),
    description: tc("metaDescription", {
      country: pretty,
      capital: hit.capital,
      zone: hit.defaultZone,
    }),
    pathWithoutLocale: path,
  });
}

export default async function CountryDetail(props: Readonly<Props>) {
  const { locale, countryCode } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const hit = findCountry(countryCode);
  if (!hit) {
    notFound();
  }

  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tc = await getTranslations({ locale, namespace: "Country" });
  const pretty = formatCountryRegion(hit.code, locale as Locale);
  const path = countryPath(hit.code);
  const metaTitle = tc("metaTitle", { country: pretty });
  const metaDescription = tc("metaDescription", {
    country: pretty,
    capital: hit.capital,
    zone: hit.defaultZone,
  });

  const faqJsonLd = buildFaqPageJsonLd([
    { question: tCommon("faqTimeTitle"), answer: tCommon("faqDstBody") },
    { question: tc("faqQ2"), answer: tc("faqA2") },
    { question: tc("faqQ3"), answer: tc("faqA3") },
  ]);

  const webPageJsonLd = buildWebPageJsonLd({
    locale: locale as Locale,
    pathWithoutLocale: path,
    name: metaTitle,
    description: metaDescription,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(locale as Locale, [
    { name: tCommon("siteName"), path: "/" },
    { name: tCommon("countriesTitle"), path: "/countries" },
    { name: pretty, path },
  ]);

  return (
    <>
      <JsonLd data={[webPageJsonLd, breadcrumbJsonLd, faqJsonLd]} />
      <CountryPageView
        locale={locale as Locale}
        code={hit.code}
        capital={hit.capital}
        defaultZone={hit.defaultZone}
        zones={hit.zones}
      />
    </>
  );
}
