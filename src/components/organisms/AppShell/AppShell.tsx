import type { ReactNode } from "react";

import { getTranslations } from "next-intl/server";

import { AdSlot } from "@/components/molecules";
import { SiteHeader } from "@/components/organisms";
import { Link } from "@/i18n/navigation";

import shared from "@/styles/shared.module.css";

import styles from "./AppShell.module.css";

type Props = Readonly<{ children: ReactNode }>;

export async function AppShell({ children }: Props) {
  const t = await getTranslations("Common");
  const tFooter = await getTranslations("Footer");

  return (
    <div className={styles.shell}>
      <a href="#main" className={shared.skip}>
        {t("skipToContent")}
      </a>
      <AdSlot variant="leaderboard" />
      <SiteHeader />
      <main id="main" tabIndex={-1} className={styles.main}>
        {children}
      </main>
      <div className={shared.container}>
        <AdSlot variant="inContent" />
      </div>
      <footer className={styles.footer} role="contentinfo">
        <div className={`${shared.container} ${styles.footerInner}`}>
          <p className={styles.disclaimer}>
            <strong>{t("siteName")}</strong> · {tFooter("disclaimer")}
          </p>
          <nav
            className={styles.legalNav}
            aria-label={tFooter("legalNavLabel")}
          >
            <Link href="/about">{tFooter("aboutLink")}</Link>
            <Link href="/contact">{tFooter("contactLink")}</Link>
            <Link href="/privacy">{tFooter("privacyLink")}</Link>
            <Link href="/terms">{tFooter("termsLink")}</Link>
          </nav>
          <p className={styles.note}>{tFooter("note")}</p>
        </div>
      </footer>
    </div>
  );
}
