import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CountryDirectory } from "@/components";
import { routing } from "@/i18n/routing";
import { listCountryCodesSorted } from "@/lib/data/countries";
import type { Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/lib/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: "Countries Time" };
  }
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tCountries = await getTranslations({ locale, namespace: "Countries" });

  return buildPageMetadata({
    locale: locale as Locale,
    title: `${tCommon("countriesTitle")} · ${tCommon("siteName")}`,
    description: tCountries("metaDescription", {
      count: listCountryCodesSorted().length,
    }),
    pathWithoutLocale: "/countries",
  });
}

export default async function CountriesDirectory(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tCountries = await getTranslations({ locale, namespace: "Countries" });
  const countryCount = listCountryCodesSorted().length;
  const metaDescription = tCountries("metaDescription", {
    count: countryCount,
  });
  const metaTitle = `${tCommon("countriesTitle")} · ${tCommon("siteName")}`;

  const webPageJsonLd = buildWebPageJsonLd({
    locale: locale as Locale,
    pathWithoutLocale: "/countries",
    name: metaTitle,
    description: metaDescription,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(locale as Locale, [
    { name: tCommon("siteName"), path: "/" },
    { name: tCommon("countriesTitle"), path: "/countries" },
  ]);

  return (
    <>
      <JsonLd data={[webPageJsonLd, breadcrumbJsonLd]} />
      <CountryDirectory />
    </>
  );
}
