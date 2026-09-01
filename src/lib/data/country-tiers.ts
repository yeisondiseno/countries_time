import { TIER1_COUNTRY_CODES } from "@/lib/data/country-editorial";

/** Tier 1 — hand-written editorial in all 8 locales. */
export const TIER1_CODES = TIER1_COUNTRY_CODES;

/**
 * Tier 2 — semi-automated unique editorial (~50 countries).
 * Indexed in sitemap; enriched via country-editorial-generated.ts.
 */
export const TIER2_CODES = [
  "RU",
  "ID",
  "PK",
  "NG",
  "EG",
  "VN",
  "TR",
  "IR",
  "TH",
  "ZA",
  "PL",
  "UA",
  "SE",
  "NO",
  "FI",
  "DK",
  "AT",
  "BE",
  "CZ",
  "RO",
  "HU",
  "GR",
  "IL",
  "SA",
  "MY",
  "PH",
  "SG",
  "TW",
  "NZ",
  "CL",
  "PE",
  "VE",
  "EC",
  "UY",
  "PY",
  "BO",
  "CR",
  "PA",
  "GT",
  "IE",
  "SK",
  "BG",
  "HR",
  "RS",
  "LT",
  "LV",
  "EE",
  "HK",
  "BD",
  "MA",
] as const;

const TIER1_SET = new Set<string>(TIER1_CODES);
const TIER2_SET = new Set<string>(TIER2_CODES);

export type CountryTier = 1 | 2 | 3;

export function getCountryTier(code: string): CountryTier {
  const upper = code.toUpperCase();
  if (TIER1_SET.has(upper)) {
    return 1;
  }
  if (TIER2_SET.has(upper)) {
    return 2;
  }
  return 3;
}

export function isCountryIndexable(code: string): boolean {
  return getCountryTier(code) < 3;
}

export function listIndexableCountryCodes(): string[] {
  return [...TIER1_CODES, ...TIER2_CODES].sort((a, b) => a.localeCompare(b));
}
