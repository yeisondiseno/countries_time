import { DateTime } from "luxon";

import { countriesZones } from "@/lib/data/countries";

import type { DefaultValues } from "react-hook-form";

import type { CmpForm, UtcResult, WorldComparatorFormValues } from "./WorldComparator.types";

export const WORLD_COMPARATOR_FORM_STORAGE_KEY =
  "countries-time:world-comparator-form";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

export function utcMillisFromWall(values: CmpForm): UtcResult {
  const wall = DateTime.fromISO(`${values.date}T${values.time}`, {
    zone: values.anchorZone,
  });
  if (!wall.isValid) {
    return { ok: false };
  }
  return { ok: true, utcMillis: wall.toUTC().toMillis() };
}

export function buildDefaults(code: string): CmpForm {
  const zone = countriesZones.countries[code]?.defaultZone ?? "UTC";
  const now = DateTime.now().setZone(zone).startOf("minute");
  return {
    anchorCountry: code,
    anchorZone: zone,
    date: now.toFormat("yyyy-LL-dd"),
    time: now.toFormat("HH:mm"),
  };
}

export function buildFormDefaults(code = "DE"): WorldComparatorFormValues {
  return {
    ...buildDefaults(code),
    followNow: true,
    pickerSearch: "",
  };
}

export function parseStoredWorldComparatorForm(
  raw: unknown,
  defaults: DefaultValues<WorldComparatorFormValues>,
): DefaultValues<WorldComparatorFormValues> {
  const base = buildFormDefaults(
    typeof defaults.anchorCountry === "string" ? defaults.anchorCountry : "DE",
  );

  if (!raw || typeof raw !== "object") {
    return base;
  }

  const stored = raw as Partial<WorldComparatorFormValues>;
  const anchorCountry =
    typeof stored.anchorCountry === "string" &&
    countriesZones.countries[stored.anchorCountry]
      ? stored.anchorCountry
      : base.anchorCountry;
  const anchorEntry = countriesZones.countries[anchorCountry];
  const anchorZone = anchorEntry?.defaultZone ?? base.anchorZone;
  const date =
    typeof stored.date === "string" && DATE_PATTERN.test(stored.date)
      ? stored.date
      : base.date;
  const time =
    typeof stored.time === "string" && TIME_PATTERN.test(stored.time)
      ? stored.time
      : base.time;

  return {
    anchorCountry,
    anchorZone,
    date,
    time,
    followNow:
      typeof stored.followNow === "boolean" ? stored.followNow : base.followNow,
    pickerSearch: base.pickerSearch,
  };
}

export function fmtDelta(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "−";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h === 0) {
    return `${sign}${m}m`;
  }
  return `${sign}${h}h${m > 0 ? ` ${m}m` : ""}`;
}

function currentEpochMillis(): number {
  return Date.now();
}

export function refreshLiveMinute(
  setLiveMinute: (value: number) => void,
): void {
  setLiveMinute(currentEpochMillis());
}

export { currentEpochMillis };
