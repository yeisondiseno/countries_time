import type { WorldComparatorState } from "./useWorldComparator";

import { ComparatorCountryCard } from "./ComparatorCountryCard";
import { ComparatorEmptySlot } from "./ComparatorEmptySlot";

import styles from "./WorldComparator.module.css";

type Props = Readonly<
  Pick<
    WorldComparatorState,
    | "t"
    | "locale"
    | "slots"
    | "form"
    | "anchorCode"
    | "anchorIdx"
    | "utcResult"
    | "openPicker"
    | "setAsAnchor"
    | "removeSlot"
  >
>;

export function ComparatorSlotGrid({
  t,
  locale,
  slots,
  form,
  anchorCode,
  anchorIdx,
  utcResult,
  openPicker,
  setAsAnchor,
  removeSlot,
}: Props) {
  return (
    <div className={styles.grid}>
      {slots.map((code, idx) => {
        if (!code) {
          return (
            <ComparatorEmptySlot
              key={`empty-${idx}`}
              t={t}
              onOpen={() => openPicker({ kind: "slot", idx })}
            />
          );
        }

        if (!utcResult.ok) {
          return null;
        }

        return (
          <ComparatorCountryCard
            key={code}
            t={t}
            locale={locale}
            code={code}
            idx={idx}
            anchorCode={anchorCode}
            anchorIdx={anchorIdx}
            form={form}
            utcMillis={utcResult.utcMillis}
            onSetAnchor={setAsAnchor}
            onRemove={removeSlot}
          />
        );
      })}
    </div>
  );
}
