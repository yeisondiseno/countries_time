"use client";

import { useTranslations } from "next-intl";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";

import styles from "./CookieConsentBanner.module.css";

export function CookieConsentBanner() {
  const t = useTranslations("CookieConsent");
  const { hasAnswered, setConsent } = useCookieConsent();

  if (hasAnswered) {
    return null;
  }

  return (
    <div className={styles.banner} role="dialog" aria-label={t("ariaLabel")}>
      <p className={styles.message}>{t("message")}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.reject} onClick={() => setConsent("essential")}>
          {t("reject")}
        </button>
        <button type="button" className={styles.accept} onClick={() => setConsent("all")}>
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
