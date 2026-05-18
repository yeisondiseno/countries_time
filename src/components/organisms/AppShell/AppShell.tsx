import type { ReactNode } from "react";

import { getTranslations } from "next-intl/server";

import { FiClock } from "react-icons/fi";

import { LocaleSwitcher } from "@/components/molecules/LocaleSwitcher/LocaleSwitcher";

import { Link } from "@/i18n/navigation";

import styles from "./AppShell.module.css";


type Props = {

  children: ReactNode;


};

export async function AppShell({ children }: Props) {


  const t = await getTranslations("Common");


  const tAds = await getTranslations("Ads");


  const tFooter = await getTranslations("Footer");



  return (


    <div className={styles.shell}>


      <div className={styles.banner} aria-hidden role="presentation">


        {tAds("leader")}


      </div>



      <header className={styles.nav}>
        <Link className={styles.brand} href="/">
          <FiClock aria-hidden size={22} /> {t("siteName")}


        </Link>



        <nav aria-label={t("siteName")} className={styles.navLinks}>
          <Link href="/countries">{t("navCountries")}</Link>
          <Link href="/compare">{t("navCompare")}</Link>
        </nav>



        <LocaleSwitcher />

      </header>



      <main className={styles.content}>{children}</main>



      <div className={styles.inContent} aria-hidden role="presentation">

        {tAds("inContent")}


      </div>



      <footer className={styles.footer}>{tFooter("note")}</footer>
    </div>


  );


}
