export type ClockParts = {
  hour: string;
  minute: string;
  second: string;
  ampm: string;
};

export function clockPartsFor(
  instant: Date,
  timeZone: string,
  hour12: boolean,
): ClockParts {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(instant).map((p) => [p.type, p.value]),
  );
  return {
    hour: parts.hour ?? "00",
    minute: parts.minute ?? "00",
    second: parts.second ?? "00",
    ampm: parts.dayPeriod ?? "",
  };
}

export function offsetLabel(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    timeZoneName: "shortOffset",
  }).formatToParts(instant);
  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  return tz.replace("GMT", "UTC");
}

export function isDaytime(instant: Date, timeZone: string): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "numeric",
      hour12: false,
    }).format(instant),
  );
  return hour >= 6 && hour < 20;
}
