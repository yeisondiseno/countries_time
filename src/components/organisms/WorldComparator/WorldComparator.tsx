"use client";

import shared from "@/styles/shared.module.css";

import { ComparatorAnchorPanel } from "./ComparatorAnchorPanel";
import { ComparatorCountryPicker } from "./ComparatorCountryPicker";
import { ComparatorHeader } from "./ComparatorHeader";
import { ComparatorSlotGrid } from "./ComparatorSlotGrid";
import { ComparatorValidation } from "./ComparatorValidation";
import { useWorldComparator } from "./useWorldComparator";

import styles from "./WorldComparator.module.css";

export function WorldComparator() {
  const cmp = useWorldComparator();

  return (
    <section className={shared.container}>
      <ComparatorHeader t={cmp.t} />

      {cmp.summaryText ? (
        <p className={styles.summary} role="status">
          {cmp.summaryText}
        </p>
      ) : null}

      <ComparatorAnchorPanel
        t={cmp.t}
        locale={cmp.locale}
        anchorCode={cmp.anchorCode}
        form={cmp.form}
        followNow={cmp.followNow}
        onOpenAnchorPicker={() => cmp.openPicker({ kind: "anchor" })}
        onDateChange={(value) => cmp.setField("date", value)}
        onTimeChange={(value) => cmp.setField("time", value)}
        onToggleFollowNow={cmp.toggleFollowNow}
      />

      <ComparatorValidation
        t={cmp.t}
        isActive={cmp.isActive}
        isUtcValid={cmp.utcResult.ok}
      />

      <ComparatorSlotGrid
        t={cmp.t}
        locale={cmp.locale}
        slots={cmp.slots}
        form={cmp.form}
        anchorCode={cmp.anchorCode}
        anchorIdx={cmp.anchorIdx}
        utcResult={cmp.utcResult}
        openPicker={cmp.openPicker}
        setAsAnchor={cmp.setAsAnchor}
        removeSlot={cmp.removeSlot}
      />

      {cmp.pickerTarget !== null ? (
        <ComparatorCountryPicker
          t={cmp.t}
          locale={cmp.locale}
          title={cmp.pickerTitle}
          ariaLabel={cmp.pickerAriaLabel}
          search={cmp.search}
          codes={cmp.filteredPicker}
          onSearchChange={cmp.setSearch}
          onSelect={cmp.selectPickerCountry}
          onClose={cmp.closePicker}
        />
      ) : null}
    </section>
  );
}
