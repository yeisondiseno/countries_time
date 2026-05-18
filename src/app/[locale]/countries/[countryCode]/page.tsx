import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CountryPageView } from "@/components/organisms/CountryPageView/CountryPageView";
import { routing } from "@/i18n/routing";
import { findCountry, listCountryCodesSorted } from "@/lib/data/countries";
import type { Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
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
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tc = await getTranslations({ locale, namespace: "Country" });
  const pretty = formatCountryRegion(hit.code, locale as Locale);
  return buildPageMetadata({
    locale: locale as Locale,
    title: `${pretty} (${hit.code}) · ${tCommon("siteName")}`,
    description: tc("capitalIntro", {
      country: pretty,
      capital: hit.capital,
    }),
    pathWithoutLocale: `/countries/${hit.code}`,
  });
}

export default async function CountryDetail(props: Props) {
  const { locale, countryCode } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const hit = findCountry(countryCode);
  if (!hit) {
    notFound();
  }

  return (
    <CountryPageView
      locale={locale as Locale}
      code={hit.code}
      capital={hit.capital}
      defaultZone={hit.defaultZone}
      zones={hit.zones}
    />
  );
}
