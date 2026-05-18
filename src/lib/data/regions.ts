/** Agrupación editorial por región (handoff design). */
const REGION_BY_CODE: Record<string, string> = {
  US: "Americas",
  DE: "Europe",
  ES: "Europe",
  JP: "Asia",
};

const REGION_ORDER = ["Americas", "Europe", "Asia", "Oceania", "Africa"] as const;

export type CountryRegion = (typeof REGION_ORDER)[number] | "Other";

export function countryRegion(iso3166Upper: string): CountryRegion {
  return (REGION_BY_CODE[iso3166Upper.toUpperCase()] as CountryRegion | undefined) ?? "Other";
}

export function regionSortIndex(region: CountryRegion): number {
  const idx = REGION_ORDER.indexOf(region as (typeof REGION_ORDER)[number]);
  return idx === -1 ? REGION_ORDER.length : idx;
}
