import { DateTime } from "luxon";

import { countriesZones } from "@/lib/data/countries";

import type { CmpForm, UtcResult } from "./WorldComparator.types";

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
