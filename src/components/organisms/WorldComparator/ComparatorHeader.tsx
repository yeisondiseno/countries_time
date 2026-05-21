import type { useTranslations } from "next-intl";

import styles from "./WorldComparator.module.css";

type Props = Readonly<{
  t: ReturnType<typeof useTranslations<"Compare">>;
}>;

export function ComparatorHeader({ t }: Props) {
  return (
    <div className={styles.head}>
      <div className={styles.eyebrow}>
        <span className={styles.dot} aria-hidden />
        {t("eyebrow").toUpperCase()}
      </div>
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.sub}>{t("subtitle")}</p>
    </div>
  );
}
