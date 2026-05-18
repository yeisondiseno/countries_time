"use client";

import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/molecules/LocaleSwitcher/LocaleSwitcher";
import { ThemeToggle } from "@/components/molecules/ThemeToggle/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";

import shared from "@/styles/shared.module.css";

import styles from "./SiteHeader.module.css";

function navActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const t = useTranslations("Common");
  const pathname = usePathname();

  return (
    <header className={styles.header} role="banner">
      <div className={`${shared.container} ${styles.inner}`}>
        <Link className={styles.brand} href="/">
          <span className={styles.mark} aria-hidden />
          <span>{t("siteName")}</span>
        </Link>
        <nav className={styles.nav} aria-label={t("siteName")}>
          <Link
            className={styles.navBtn}
            href="/countries"
            aria-current={navActive(pathname, "/countries") ? "page" : undefined}
          >
            {t("navCountries")}
          </Link>
          <Link
            className={styles.navBtn}
            href="/compare"
            aria-current={navActive(pathname, "/compare") ? "page" : undefined}
          >
            {t("navCompare")}
          </Link>
        </nav>
        <div className={styles.tools}>
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
