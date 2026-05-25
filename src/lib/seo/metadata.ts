import type { Locale } from "@/lib/i18n/config";

import { routing } from "@/i18n/routing";

import type { Metadata } from "next";

import { getSiteOrigin } from "./site-origin";

function normalizeSuffix(pathWithoutLocale: `/${string}` | "") {
  if (!pathWithoutLocale || pathWithoutLocale === "/") {
    return "/";
  }

  return pathWithoutLocale.startsWith("/")
    ? pathWithoutLocale
    : `/${pathWithoutLocale}`;
}

/** Alternates tipo hreflang sobre el sufijo deduplicado por locale (`/countries/...`). */

export function localeAlternateLanguages(
  pathWithoutLocale: `/${string}` | "",
): Record<string, string> {
  const base = getSiteOrigin();
  const map: Record<string, string> = {};
  const suffix = normalizeSuffix(pathWithoutLocale);
  for (const l of routing.locales) {
    map[l] = new URL(`/${l}${suffix}`, base).href;
  }
  map["x-default"] = new URL(`/${routing.defaultLocale}${suffix}`, base).href;

  return map;
}

export type PageMetaInput = {
  locale: Locale;
  title: string;
  description: string;
  pathWithoutLocale: `/${string}` | "";
};

export function buildPageMetadata({
  locale,
  title,
  description,
  pathWithoutLocale,
}: PageMetaInput): Metadata {
  const suffix = normalizeSuffix(pathWithoutLocale);

  const canonical = new URL(`/${locale}${suffix}`, getSiteOrigin()).href;

  return {
    metadataBase: getSiteOrigin(),
    title,
    description,
    alternates: {
      canonical,
      languages: localeAlternateLanguages(pathWithoutLocale || "/"),
    },
    openGraph: {
      title,
      description,
      locale,
      url: canonical,
      siteName: "Countries Time",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
