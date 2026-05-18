import type { Locale } from "@/lib/i18n/config";

export function formatZonedInstant(
  locale: Locale,
  instant: Date,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone,
  }).format(instant);
}

/** Nombre legible del país usando CLDR (`Intl`). */
export function formatCountryRegion(
  iso3166Upper: string,
  locale: Locale,
): string {
  const region = iso3166Upper.toUpperCase();
  try {
    return (
      new Intl.DisplayNames([locale], { type: "region" }).of(region) ?? region
    );
  } catch {
    return region;
  }
}

/** Etiqueta IANA TZ legible pero estable (capitalización mínima). */
export function formatTimeZoneLabel(timeZone: string): string {
  return timeZone.replace(/_/g, " ");
}
