import type { ReactNode } from "react";

import { getTranslations } from "next-intl/server";

import { AdSlot } from "@/components/molecules/AdSlot/AdSlot";
import { SiteHeader } from "@/components/organisms/SiteHeader/SiteHeader";

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
          <p className={styles.note}>{tFooter("note")}</p>
        </div>
      </footer>
    </div>
  );
}
