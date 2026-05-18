import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/config";
import { defaultLocale } from "@/lib/i18n/config";
import shared from "@/styles/shared.module.css";

import styles from "./NotFoundContent.module.css";

type Props = Readonly<{
  locale?: Locale;
}>;

export async function NotFoundContent({ locale = defaultLocale }: Props) {
  const t = await getTranslations({ locale, namespace: "NotFound" });

  return (
    <section className={`${shared.containerNarrow} ${styles.wrap}`}>
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.description}>{t("description")}</p>
      <p>
        <Link className={styles.link} href="/" locale={locale}>
          {t("homeLink")}
        </Link>
      </p>
    </section>
  );
}
