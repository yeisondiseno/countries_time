"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import { useTimeFormat } from "@/components";
import { listCountryCodesSorted } from "@/lib/data/countries";
import { countriesZones } from "@/lib/data/countries";
import type { Locale } from "@/lib/i18n/config";
import { formatCountryRegion } from "@/lib/time/display";
import { formatLuxonClock } from "@/lib/time/format-clock";

import {
  LIVE_TICK_MS,
  type PickerTarget,
  type WorldComparatorFormValues,
} from "./WorldComparator.types";
import {
  buildDefaults,
  currentEpochMillis,
  refreshLiveMinute,
  utcMillisFromWall,
} from "./WorldComparator.utils";

export function useWorldComparator(
  formMethods: UseFormReturn<WorldComparatorFormValues>,
) {
  const locale = useLocale() as Locale;
  const { hour12 } = useTimeFormat();
  const t = useTranslations("Compare");
  const { watch, setValue, getValues } = formMethods;

  const [liveMinute, setLiveMinute] = useState(currentEpochMillis);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);

  const followNow = watch("followNow");
  const slots = watch("slots");
  const anchorIdx = watch("anchorIdx");
  const manualForm = watch(["anchorCountry", "anchorZone", "date", "time"]);
  const search = watch("pickerSearch");

  const filled = slots.filter((c): c is string => Boolean(c));
  const isActive = filled.length >= 2;
  const anchorCode = slots[anchorIdx] ?? filled[0] ?? "DE";
  const anchorEntry = countriesZones.countries[anchorCode];

  const applyAnchorDefaults = useCallback(
    (code: string) => {
      const defaults = buildDefaults(code);
      setValue("anchorCountry", defaults.anchorCountry, { shouldDirty: true });
      setValue("anchorZone", defaults.anchorZone, { shouldDirty: true });
      setValue("date", defaults.date, { shouldDirty: true });
      setValue("time", defaults.time, { shouldDirty: true });
      setValue("followNow", true, { shouldDirty: true });
    },
    [setValue],
  );

  useEffect(() => {
    if (!followNow) {
      return;
    }
    const id = window.setInterval(
      () => refreshLiveMinute(setLiveMinute),
      LIVE_TICK_MS,
    );
    return () => window.clearInterval(id);
  }, [followNow]);

  const form = useMemo(() => {
    const [anchorCountry, anchorZone, date, time] = manualForm;

    if (!followNow || !anchorEntry) {
      return { anchorCountry, anchorZone, date, time };
    }

    const snap = DateTime.fromMillis(liveMinute)
      .setZone(anchorEntry.defaultZone)
      .startOf("minute");

    return {
      anchorCountry: anchorCode,
      anchorZone: anchorEntry.defaultZone,
      date: snap.toFormat("yyyy-LL-dd"),
      time: snap.toFormat("HH:mm"),
    };
  }, [followNow, anchorEntry, anchorCode, manualForm, liveMinute]);

  const utcResult = useMemo(() => utcMillisFromWall(form), [form]);

  const summaryText = useMemo(() => {
    if (!utcResult.ok || filled.length < 2) {
      return null;
    }
    const other = filled.find((c) => c !== anchorCode);
    if (!other || !anchorEntry) {
      return null;
    }
    const otherEntry = countriesZones.countries[other];
    if (!otherEntry) {
      return null;
    }
    const instant = DateTime.fromMillis(utcResult.utcMillis);
    const fmtA = formatLuxonClock(
      instant.setZone(form.anchorZone).setLocale(locale),
      hour12,
    );
    const fmtB = formatLuxonClock(
      instant.setZone(otherEntry.defaultZone).setLocale(locale),
      hour12,
    );
    return t("summary", {
      timeA: fmtA,
      countryA: formatCountryRegion(anchorCode, locale),
      timeB: fmtB,
      countryB: formatCountryRegion(other, locale),
    });
  }, [
    utcResult,
    filled,
    anchorCode,
    anchorEntry,
    form.anchorZone,
    locale,
    hour12,
    t,
  ]);

  const allCodes = useMemo(() => listCountryCodesSorted(), []);

  const filteredPicker = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matchesSearch = (code: string) =>
      !q ||
      formatCountryRegion(code, locale).toLowerCase().includes(q) ||
      code.toLowerCase().includes(q);

    if (pickerTarget?.kind === "anchor") {
      return allCodes.filter(matchesSearch);
    }

    return allCodes.filter(
      (code) => !slots.includes(code) && matchesSearch(code),
    );
  }, [allCodes, locale, pickerTarget, search, slots]);

  const pickerTitle =
    pickerTarget?.kind === "anchor" ? t("anchorLabel") : t("addCountry");
  const pickerAriaLabel =
    pickerTarget?.kind === "anchor" ? t("anchorControls") : t("addCountry");

  const openPicker = useCallback(
    (target: PickerTarget) => {
      setPickerTarget(target);
      setValue("pickerSearch", "");
    },
    [setValue],
  );

  const closePicker = useCallback(() => {
    setPickerTarget(null);
  }, []);

  const setAsAnchor = useCallback(
    (idx: number) => {
      setValue("anchorIdx", idx, { shouldDirty: true });
      const code = slots[idx];
      if (code && countriesZones.countries[code]) {
        applyAnchorDefaults(code);
        refreshLiveMinute(setLiveMinute);
      }
    },
    [applyAnchorDefaults, setValue, slots],
  );

  const setSlot = useCallback(
    (idx: number, code: string) => {
      const next = getValues("slots").map((c, i) => (i === idx ? code : c));
      setValue("slots", next, { shouldDirty: true });
      setPickerTarget(null);
    },
    [getValues, setValue],
  );

  const setAnchorCountry = useCallback(
    (code: string) => {
      const currentSlots = getValues("slots");
      const currentAnchorIdx = getValues("anchorIdx");
      const idx = currentSlots.indexOf(code);
      if (idx >= 0) {
        setAsAnchor(idx);
      } else {
        const next = currentSlots.map((c, i) =>
          i === currentAnchorIdx ? code : c,
        );
        setValue("slots", next, { shouldDirty: true });
        applyAnchorDefaults(code);
        refreshLiveMinute(setLiveMinute);
      }
      setPickerTarget(null);
    },
    [applyAnchorDefaults, getValues, setAsAnchor, setValue],
  );

  const removeSlot = useCallback(
    (idx: number) => {
      const currentSlots = getValues("slots");
      const next = currentSlots.map((c, i) => (i === idx ? null : c));
      const currentAnchorIdx = getValues("anchorIdx");
      let nextAnchorIdx = currentAnchorIdx;

      if (idx === currentAnchorIdx) {
        const fallback = next.findIndex((c) => c !== null);
        if (fallback >= 0) {
          nextAnchorIdx = fallback;
        }
      }

      setValue("slots", next, { shouldDirty: true });
      setValue("anchorIdx", nextAnchorIdx, { shouldDirty: true });
    },
    [getValues, setValue],
  );

  const selectPickerCountry = useCallback(
    (code: string) => {
      if (!pickerTarget) {
        return;
      }
      if (pickerTarget.kind === "anchor") {
        setAnchorCountry(code);
        return;
      }
      setSlot(pickerTarget.idx, code);
    },
    [pickerTarget, setAnchorCountry, setSlot],
  );

  return {
    locale,
    t,
    slots,
    form,
    followNow,
    pickerTarget,
    filled,
    isActive,
    anchorCode,
    anchorIdx,
    utcResult,
    summaryText,
    filteredPicker,
    pickerTitle,
    pickerAriaLabel,
    openPicker,
    closePicker,
    setAsAnchor,
    removeSlot,
    selectPickerCountry,
  };
}

export type WorldComparatorState = ReturnType<typeof useWorldComparator>;
