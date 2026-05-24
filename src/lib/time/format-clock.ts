import { DateTime } from "luxon";

export type HourFormat = "12h" | "24h";

export function hour12FromFormat(format: HourFormat): boolean {
  return format === "12h";
}

export function formatClockTime(
  instant: Date,
  timeZone: string,
  locale: string,
  hour12: boolean,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12,
  }).format(instant);
}

export function formatLuxonClock(dt: DateTime, hour12: boolean): string {
  return dt.toFormat(hour12 ? "h:mm a" : "HH:mm");
}
