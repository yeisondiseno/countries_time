import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { listCountryCodesSorted } from "@/lib/data/countries";
import { renderOgImage } from "@/lib/seo/og-image";

export const alt = "Countries Time — country directory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ locale: string }> };

export default async function CountriesOgImage(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return renderOgImage({ title: "Countries Time" });
  }

  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tCountries = await getTranslations({ locale, namespace: "Countries" });

  return renderOgImage({
    badge: tCommon("siteName"),
    title: tCommon("countriesTitle"),
    subtitle: tCountries("subtitle", {
      count: listCountryCodesSorted().length,
    }),
  });
}
