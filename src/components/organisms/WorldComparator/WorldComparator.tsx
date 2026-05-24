"use client";

import { useMemo } from "react";

import { FormProvider } from "react-hook-form";

import { usePersistedForm } from "@/hooks";

import { ComparatorAnchorPanel } from "./ComparatorAnchorPanel";
import { ComparatorCountryPicker } from "./ComparatorCountryPicker";
import { ComparatorHeader } from "./ComparatorHeader";
import { ComparatorSlotGrid } from "./ComparatorSlotGrid";
import { ComparatorValidation } from "./ComparatorValidation";
import type { WorldComparatorFormValues } from "./WorldComparator.types";
import {
  WORLD_COMPARATOR_FORM_STORAGE_KEY,
  buildFormDefaults,
  parseStoredWorldComparatorForm,
} from "./WorldComparator.utils";
import { useWorldComparator } from "./useWorldComparator";

import shared from "@/styles/shared.module.css";

import styles from "./WorldComparator.module.css";

const PERSISTED_FORM_OMIT_KEYS = ["pickerSearch"] as const satisfies ReadonlyArray<
  keyof WorldComparatorFormValues
>;

export function WorldComparator() {
  const defaultValues = useMemo(() => buildFormDefaults(), []);

  const formMethods = usePersistedForm<WorldComparatorFormValues>({
    storageKey: WORLD_COMPARATOR_FORM_STORAGE_KEY,
    defaultValues,
    omitKeys: PERSISTED_FORM_OMIT_KEYS,
    parseStored: parseStoredWorldComparatorForm,
  });

  const cmp = useWorldComparator(formMethods);

  return (
    <FormProvider {...formMethods}>
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
            codes={cmp.filteredPicker}
            onSelect={cmp.selectPickerCountry}
            onClose={cmp.closePicker}
          />
        ) : null}
      </section>
    </FormProvider>
  );
}
