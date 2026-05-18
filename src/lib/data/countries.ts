import raw from "@/data/countries-zones.json";
import type { ZonesDataset } from "@/data/countries-zones";
import {
  normalizeCountryCode,
  validateZonesDataset,
} from "@/data/countries-zones";

const typed = raw as ZonesDataset;
validateZonesDataset(typed);

export const countriesZones: ZonesDataset = typed;

export type CountrySlug = keyof typeof typed.countries;

export function findCountry(slug: string) {
  const code = normalizeCountryCode(slug);
  const entry = countriesZones.countries[code];
  if (!entry) {
    return null;
  }
  return { code, ...entry };
}

export function listCountryCodesSorted(): string[] {
  return Object.keys(countriesZones.countries).sort((a, b) =>
    a.localeCompare(b),
  );
}
