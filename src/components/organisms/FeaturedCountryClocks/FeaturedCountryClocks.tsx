"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { flagEmoji } from "@/lib/display/flags";

import styles from "./FeaturedCountryClocks.module.css";

type CountryItem = Readonly<{
  code: string;
  name: string;
  zone: string;
  href: string;
}>;

type Props = Readonly<{
  countries: CountryItem[];
}>;

export function FeaturedCountryClocks({ countries }: Props) {
  return (
    <ul className={styles.grid}>
      {countries.map((country) => (
        <li key={country.code}>
          <FeaturedClockCard country={country} />
        </li>
      ))}
    </ul>
  );
}

function FeaturedClockCard({ country }: Readonly<{ country: CountryItem }>) {
  const locale = useLocale();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: country.zone,
      }).format(now),
    [country.zone, locale, now],
  );

  const offset = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        timeZone: country.zone,
        timeZoneName: "shortOffset",
      })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value ?? "",
    [country.zone, locale, now],
  );

  return (
    <Link href={country.href} className={styles.card}>
      <span className={styles.flag} aria-hidden>
        {flagEmoji(country.code)}
      </span>
      <span className={styles.name}>{country.name}</span>
      <time
        className={styles.time}
        dateTime={now.toISOString()}
        suppressHydrationWarning
        aria-live="off"
      >
        {time}
      </time>
      <span className={styles.meta}>
        {country.zone} · {offset}
      </span>
    </Link>
  );
}
