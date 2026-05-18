"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";

import { LOCALE_ENDONYMS } from "@/lib/i18n/locale-labels";

import { routing } from "@/i18n/routing";

import styles from "./LocaleSwitcher.module.css";

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("LocaleSwitcher");

  return (
    <div className={styles.wrap}>
      <label className={styles.label} htmlFor="locale-switch">
        {t("label")}
      </label>
      <select
        id="locale-switch"
        className={styles.select}
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value })}
        aria-label={t("label")}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {LOCALE_ENDONYMS[l] ?? l}
          </option>
        ))}
      </select>
    </div>
  );
}
