import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { findCountry } from "@/lib/data/countries";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/i18n/config";
import { renderOgImage } from "@/lib/seo/og-image";
import { formatCountryRegion } from "@/lib/time/display";

export const alt = "Countries Time — country clock";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string; countryCode: string }>;
};

export default async function CountryOgImage(props: Props) {
  const { locale, countryCode } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return renderOgImage({ title: "Countries Time" });
  }

  const hit = findCountry(countryCode);
  if (!hit) {
    return renderOgImage({ title: "Countries Time" });
  }

  const tc = await getTranslations({ locale, namespace: "Country" });
  const pretty = formatCountryRegion(hit.code, locale as Locale);

  return renderOgImage({
    badge: tc("heroEyebrow"),
    title: pretty,
    subtitle: hit.capital,
  });
}
