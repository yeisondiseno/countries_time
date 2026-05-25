import type { useTranslations } from "next-intl";

import { FiInfo, FiSearch } from "react-icons/fi";
import { Controller, useFormContext } from "react-hook-form";

import { Input } from "@/components/atoms";

import { flagEmoji } from "@/lib/display/flags";
import type { Locale } from "@/lib/i18n/config";
import { formatCountryRegion } from "@/lib/time/display";

import type { CmpForm, WorldComparatorFormValues } from "./WorldComparator.types";

import styles from "./WorldComparator.module.css";

type Props = Readonly<{
  t: ReturnType<typeof useTranslations<"Compare">>;
  locale: Locale;
  anchorCode: string;
  form: CmpForm;
  followNow: boolean;
  onOpenAnchorPicker: () => void;
}>;

export function ComparatorAnchorPanel({
  t,
  locale,
  anchorCode,
  form,
  followNow,
  onOpenAnchorPicker,
}: Props) {
  const { control, setValue } = useFormContext<WorldComparatorFormValues>();

  const pauseLive = () => {
    setValue("followNow", false);
  };

  const toggleFollowNow = () => {
    setValue("followNow", !followNow);
  };

  return (
    <div
      className={styles.anchor}
      role="group"
      aria-label={t("anchorControls")}
    >
      <div className={styles.anchorField}>
        <label htmlFor="anchor-country">{t("anchorLabel")}</label>
        <button
          type="button"
          id="anchor-country"
          className={styles.anchorPickerBtn}
          onClick={onOpenAnchorPicker}
          aria-haspopup="dialog"
        >
          <span>{flagEmoji(anchorCode)}</span>
          <span>{formatCountryRegion(anchorCode, locale)}</span>
          <FiSearch className={styles.anchorPickerIcon} aria-hidden />
        </button>
      </div>
      <div className={styles.anchorField}>
        <label htmlFor="anchor-date">{t("dateLabel")}</label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Input
              id="anchor-date"
              type="date"
              value={form.date}
              onChange={(event) => {
                field.onChange(event.target.value);
                pauseLive();
              }}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />
      </div>
      <div className={styles.anchorField}>
        <label htmlFor="anchor-time">{t("timeLabel")}</label>
        <Controller
          name="time"
          control={control}
          render={({ field }) => (
            <Input
              id="anchor-time"
              type="time"
              step={60}
              value={form.time}
              onChange={(event) => {
                field.onChange(event.target.value);
                pauseLive();
              }}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />
      </div>
      <div className={styles.anchorField}>
        <label htmlFor="follow-now" className={styles.srOnly}>
          {t("liveToggle")}
        </label>
        <button
          id="follow-now"
          type="button"
          className={`${styles.liveBtn} ${followNow ? styles.liveBtnOn : ""}`}
          onClick={toggleFollowNow}
          aria-pressed={followNow}
        >
          {followNow ? t("liveOn") : t("liveOff")}
        </button>
      </div>
      <p className={styles.anchorHelp}>
        <FiInfo width={16} height={16} aria-hidden />
        {t("anchorHelp")}
      </p>
    </div>
  );
}
