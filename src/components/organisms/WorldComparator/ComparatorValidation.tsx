import type { useTranslations } from "next-intl";

import { FiInfo } from "react-icons/fi";

import styles from "./WorldComparator.module.css";

type Props = Readonly<{
  t: ReturnType<typeof useTranslations<"Compare">>;
  isActive: boolean;
  isUtcValid: boolean;
}>;

export function ComparatorValidation({ t, isActive, isUtcValid }: Props) {
  return (
    <>
      {!isActive ? (
        <div className={styles.validation} role="alert">
          <FiInfo width={18} height={18} aria-hidden />
          {t("validationMin")}
        </div>
      ) : null}
      {!isUtcValid ? (
        <div className={styles.validation} role="alert">
          {t("validationError")}
        </div>
      ) : null}
    </>
  );
}
