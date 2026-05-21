import type { useTranslations } from "next-intl";

import styles from "./WorldComparator.module.css";

type Props = Readonly<{
  t: ReturnType<typeof useTranslations<"Compare">>;
  onOpen: () => void;
}>;

export function ComparatorEmptySlot({ t, onOpen }: Props) {
  return (
    <button
      type="button"
      className={`${styles.card} ${styles.cardEmpty}`}
      onClick={onOpen}
    >
      <span className={styles.plus} aria-hidden>
        +
      </span>
      <strong>{t("addCountry")}</strong>
      <span className={styles.addHint}>{t("addCountryHint")}</span>
    </button>
  );
}
