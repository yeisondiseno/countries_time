"use client";


import { useEffect, useMemo, useState } from "react";

import { useLocale, useTranslations } from "next-intl";


import styles from "./LiveClock.module.css";

type Props = {



  timeZone: string;



};

/** Cliente · tick ~60s y `aria-live` suave. */

export function LiveClock({ timeZone }: Props) {



  const locale = useLocale();


  const [now, setNow] = useState(() => new Date());



  const t = useTranslations("LiveClock");


  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "full",


        timeStyle: "medium",


        timeZone,



      }),

    [locale, timeZone],


  );


  useEffect(() => {


    const interval = window.setInterval(() => {


      setNow(new Date());



    }, 60_000);


    return () => window.clearInterval(interval);


  }, []);

  return (
    <section className={styles.card} aria-labelledby="live-clock-heading">


      <h2 id="live-clock-heading" className={styles.visuallyHidden}>


        {t("heading")}


      </h2>



      <time


        className={styles.face}


        dateTime={now.toISOString()}


        suppressHydrationWarning


        aria-live="polite"


        aria-atomic="true"


      >


        {formatter.format(now)}


      </time>



      <p className={styles.zone}>


        <span className={styles.visuallyHidden}>{t("ianaLabel")}</span>



        <code>{timeZone}</code>


      </p>


    </section>


  );


}

