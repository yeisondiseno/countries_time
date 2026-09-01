"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import styles from "./CookieConsentBanner.module.css";

const STORAGE_KEY = "countries-time:cookie-consent";

type ConsentValue = "all" | "essential";

export function CookieConsentBanner() {
  const t = useTranslations("CookieConsent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (value: ConsentValue) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.banner} role="dialog" aria-label={t("ariaLabel")}>
      <p className={styles.message}>{t("message")}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.reject} onClick={() => save("essential")}>
          {t("reject")}
        </button>
        <button type="button" className={styles.accept} onClick={() => save("all")}>
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
