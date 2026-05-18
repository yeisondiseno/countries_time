export type ZonesDataset = {
  schemaVersion: number;
  countries: Record<
    string,
    {
      capital: string;
      defaultZone: string;
      zones: string[];
    }
  >;
};

export function normalizeCountryCode(input: string): string {
  return input.trim().toUpperCase();
}

export function validateZonesDataset(dataset: ZonesDataset): void {
  if (dataset.schemaVersion !== 1) {
    throw new Error(
      `countries-zones: schemaVersion inesperada (${dataset.schemaVersion})`,
    );
  }
  const iso = /^[A-Z]{2}$/;
  for (const code of Object.keys(dataset.countries)) {
    if (!iso.test(code)) {
      throw new Error(`countries-zones: código ISO inválido "${code}"`);
    }
    const entry = dataset.countries[code];
    if (!entry.zones.includes(entry.defaultZone)) {
      throw new Error(
        `countries-zones: defaultZone debe estar en zones (${code} → ${entry.defaultZone})`,
      );
    }
    if (entry.zones.length === 0) {
      throw new Error(
        `countries-zones: ${code} debe tener al menos una zona IANA`,
      );
    }
  }
}
