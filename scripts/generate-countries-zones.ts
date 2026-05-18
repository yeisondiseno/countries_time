import { writeFileSync } from "node:fs";
import { join } from "node:path";

import ct from "countries-and-timezones";
import wc from "world-countries";

import {
  validateZonesDataset,
  type ZonesDataset,
} from "../src/data/countries-zones";

/** Zona IANA principal cuando la heurística por capital no basta. */
const DEFAULT_ZONE_OVERRIDES: Record<string, string> = {
  AR: "America/Argentina/Buenos_Aires",
  AU: "Australia/Sydney",
  BR: "America/Sao_Paulo",
  CA: "America/Toronto",
  CN: "Asia/Shanghai",
  DE: "Europe/Berlin",
  ES: "Europe/Madrid",
  FR: "Europe/Paris",
  GB: "Europe/London",
  GL: "America/Nuuk",
  HM: "Antarctica/Mawson",
  ID: "Asia/Jakarta",
  JP: "Asia/Tokyo",
  KZ: "Asia/Almaty",
  MX: "America/Mexico_City",
  RU: "Europe/Moscow",
  US: "America/New_York",
  XK: "Europe/Belgrade",
  BV: "Europe/Oslo",
};

function mapRegion(entry: (typeof wc)[number]): string {
  switch (entry.region) {
    case "Africa":
      return "Africa";
    case "Americas":
      return "Americas";
    case "Asia":
      return "Asia";
    case "Europe":
      return "Europe";
    case "Oceania":
    case "Antarctic":
      return "Oceania";
    default:
      return "Other";
  }
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function pickDefaultZone(
  code: string,
  capital: string,
  zones: string[],
): string {
  const override = DEFAULT_ZONE_OVERRIDES[code];
  if (override) {
    return override;
  }

  const cap = normalizeText(capital);
  if (cap) {
    for (const zone of zones) {
      const segment = normalizeText(zone.split("/").pop() ?? "");
      if (segment.includes(cap) || cap.includes(segment)) {
        return zone;
      }
    }
    for (const zone of zones) {
      const segment = normalizeText(zone.split("/").pop() ?? "");
      if (segment.slice(0, 4) === cap.slice(0, 4)) {
        return zone;
      }
    }
  }

  return zones[0];
}

function main(): void {
  const countries: ZonesDataset["countries"] = {};
  const regions: Record<string, string> = {};

  for (const entry of wc) {
    const code = entry.cca2;
    if (!/^[A-Z]{2}$/.test(code)) {
      continue;
    }

    const tzEntry = ct.getCountry(code);
    const capital = entry.capital?.[0] ?? "";
    let zones: string[] = tzEntry?.timezones ? [...tzEntry.timezones] : [];

    if (zones.length === 0) {
      const fallback = DEFAULT_ZONE_OVERRIDES[code];
      if (fallback) {
        zones = [fallback];
      }
    }

    if (zones.length === 0) {
      console.warn(`Omitiendo ${code}: sin zonas IANA`);
      continue;
    }

    const defaultZone = pickDefaultZone(code, capital, zones);
    if (!zones.includes(defaultZone)) {
      zones.unshift(defaultZone);
    }

    countries[code] = {
      capital: capital || code,
      defaultZone,
      zones: [...new Set(zones)].sort((a, b) => a.localeCompare(b)),
    };

    const mapped = mapRegion(entry);
    regions[code] = mapped;
  }

  const dataset: ZonesDataset = {
    schemaVersion: 1,
    countries,
  };

  validateZonesDataset(dataset);

  const root = join(import.meta.dirname, "..");
  writeFileSync(
    join(root, "src/data/countries-zones.json"),
    `${JSON.stringify(dataset, null, 2)}\n`,
  );
  writeFileSync(
    join(root, "src/data/country-regions.json"),
    `${JSON.stringify(regions, null, 2)}\n`,
  );

  console.log(
    `Generados ${Object.keys(countries).length} países y ${Object.keys(regions).length} regiones`,
  );
}

main();
