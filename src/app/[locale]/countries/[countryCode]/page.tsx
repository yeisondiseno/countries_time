import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CountryPageEditorial, CountryPageHero } from "@/components";
import { routing } from "@/i18n/routing";
import { findCountry, listCountryCodesSorted } from "@/lib/data/countries";
import { getCountryEditorial } from "@/lib/data/country-editorial";
import { getCountryTier } from "@/lib/data/country-tiers";
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
  const localeCode = locale as Locale;
  const tc = await getTranslations({ locale, namespace: "Country" });
  const pretty = formatCountryRegion(hit.code, localeCode);
  const path = countryPath(hit.code);
  const editorial = getCountryEditorial(hit.code, localeCode);
  const tier = getCountryTier(hit.code);

  const description = editorial
    ? editorial.overview.slice(0, 155)
    : tc("metaDescription", {
        country: pretty,
        capital: hit.capital,
        zone: hit.defaultZone,
      });

  const base = buildPageMetadata({
    locale: localeCode,
    title: tc("metaTitle", { country: pretty }),
    description,
    pathWithoutLocale: path,
  });

  if (tier === 3) {
    return {
      ...base,
      robots: { index: false, follow: true },
    };
  }

  return base;
}

export default async function CountryDetail(props: Readonly<Props>) {
  const { locale, countryCode } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const hit = findCountry(countryCode);
  if (!hit) {
    notFound();
  }

  setRequestLocale(locale);
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tc = await getTranslations({ locale, namespace: "Country" });
  const localeCode = locale as Locale;
  const pretty = formatCountryRegion(hit.code, localeCode);
  const path = countryPath(hit.code);
  const metaTitle = tc("metaTitle", { country: pretty });
  const editorial = getCountryEditorial(hit.code, localeCode);
  const metaDescription = editorial
    ? editorial.overview.slice(0, 155)
    : tc("metaDescription", {
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
    locale: localeCode,
    pathWithoutLocale: path,
    name: metaTitle,
    description: metaDescription,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(localeCode, [
    { name: tCommon("siteName"), path: "/" },
    { name: tCommon("countriesTitle"), path: "/countries" },
    { name: pretty, path },
  ]);

  const relatedCountries = (editorial?.relatedCodes ?? []).flatMap(
    (relatedCode) => {
      const related = findCountry(relatedCode);
      if (!related) {
        return [];
      }
      return [
        {
          code: related.code,
          name: formatCountryRegion(related.code, localeCode),
          href: countryPath(related.code),
        },
      ];
    },
  );

  const compareLinks = (editorial?.relatedCodes ?? []).slice(0, 3).flatMap(
    (relatedCode) => {
      const related = findCountry(relatedCode);
      if (!related) {
        return [];
      }
      return [
        {
          code: related.code,
          name: formatCountryRegion(related.code, localeCode),
          href: `/compare?a=${hit.code.toLowerCase()}&b=${related.code.toLowerCase()}`,
        },
      ];
    },
  );

  return (
    <>
      <JsonLd data={[webPageJsonLd, breadcrumbJsonLd, faqJsonLd]} />
      <article>
        <CountryPageHero
          locale={localeCode}
          code={hit.code}
          defaultZone={hit.defaultZone}
          zones={hit.zones}
        />
        <CountryPageEditorial
          locale={localeCode}
          code={hit.code}
          capital={hit.capital}
          zone={hit.defaultZone}
          editorialOverview={editorial?.overview}
          editorialDstNotes={editorial?.dstNotes}
          editorialPracticalTip={editorial?.practicalTip}
          relatedCountries={relatedCountries}
          compareLinks={compareLinks}
        />
      </article>
    </>
  );
}
