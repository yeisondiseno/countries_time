import type { Locale } from "@/lib/i18n/config";

import { getSiteOrigin } from "./site-origin";

type FaqItem = Readonly<{ question: string; answer: string }>;

type BreadcrumbItem = Readonly<{ name: string; path: `/${string}` | "" }>;

function pageUrl(locale: Locale, pathWithoutLocale: `/${string}` | ""): string {
  const suffix =
    !pathWithoutLocale || pathWithoutLocale === "/"
      ? ""
      : pathWithoutLocale.startsWith("/")
        ? pathWithoutLocale
        : `/${pathWithoutLocale}`;

  return new URL(`/${locale}${suffix}`, getSiteOrigin()).href;
}

export function buildWebPageJsonLd(input: {
  locale: Locale;
  pathWithoutLocale: `/${string}` | "";
  name: string;
  description: string;
}) {
  const origin = getSiteOrigin().href;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: pageUrl(input.locale, input.pathWithoutLocale),
    inLanguage: input.locale,
    isPartOf: {
      "@type": "WebSite",
      name: "Countries Time",
      url: origin,
    },
  };
}

export function buildBreadcrumbJsonLd(
  locale: Locale,
  items: readonly BreadcrumbItem[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: pageUrl(locale, item.path),
    })),
  };
}

export function buildFaqPageJsonLd(faqs: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildWebSiteJsonLd(locale: Locale) {
  const origin = getSiteOrigin().href;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Countries Time",
    url: origin,
    inLanguage: locale,
  };
}
