import type { useTranslations } from "next-intl";

import { FiSearch, FiX } from "react-icons/fi";

import { flagEmoji } from "@/lib/display/flags";
import type { Locale } from "@/lib/i18n/config";
import { formatCountryRegion } from "@/lib/time/display";

import styles from "./WorldComparator.module.css";

type Props = Readonly<{
  t: ReturnType<typeof useTranslations<"Compare">>;
  locale: Locale;
  title: string;
  ariaLabel: string;
  search: string;
  codes: string[];
  onSearchChange: (value: string) => void;
  onSelect: (code: string) => void;
  onClose: () => void;
}>;

export function ComparatorCountryPicker({
  t,
  locale,
  title,
  ariaLabel,
  search,
  codes,
  onSearchChange,
  onSelect,
  onClose,
}: Props) {
  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal
      aria-label={ariaLabel}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className={styles.modalHead}>
          <h3>{title}</h3>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onClose}
            aria-label={t("closePicker")}
          >
            <FiX size={14} aria-hidden />
          </button>
        </div>
        <div className={styles.modalSearch}>
          <FiSearch className={styles.searchIcon} aria-hidden />
          <input
            type="search"
            placeholder={t("searchCountry")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            autoFocus
          />
        </div>
        <div className={styles.modalList}>
          {codes.length === 0 ? (
            <p className={styles.emptyPicker}>{t("noResults")}</p>
          ) : (
            codes.map((code) => (
              <button
                key={code}
                type="button"
                className={styles.pickerRow}
                onClick={() => onSelect(code)}
              >
                <span>{flagEmoji(code)}</span>
                <span>{formatCountryRegion(code, locale)}</span>
                <span className={styles.pickerCode}>{code}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
