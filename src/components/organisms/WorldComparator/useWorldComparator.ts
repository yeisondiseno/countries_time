"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import { listCountryCodesSorted } from "@/lib/data/countries";
import { countriesZones } from "@/lib/data/countries";
import type { Locale } from "@/lib/i18n/config";
import { formatCountryRegion } from "@/lib/time/display";

import {
  DEFAULT_SLOT_CODES,
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
  const t = useTranslations("Compare");
  const { watch, setValue } = formMethods;

  const [slots, setSlots] = useState<(string | null)[]>([
    ...DEFAULT_SLOT_CODES,
  ]);
  const [anchorIdx, setAnchorIdx] = useState(0);
  const [liveMinute, setLiveMinute] = useState(currentEpochMillis);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);

  const followNow = watch("followNow");
  const manualForm = watch(["anchorCountry", "anchorZone", "date", "time"]);
  const search = watch("pickerSearch");

  const filled = slots.filter((c): c is string => Boolean(c));
  const isActive = filled.length >= 2;
  const anchorCode = slots[anchorIdx] ?? filled[0] ?? "DE";
  const anchorEntry = countriesZones.countries[anchorCode];

  const applyAnchorDefaults = useCallback(
    (code: string) => {
      const defaults = buildDefaults(code);
      setValue("anchorCountry", defaults.anchorCountry);
      setValue("anchorZone", defaults.anchorZone);
      setValue("date", defaults.date);
      setValue("time", defaults.time);
      setValue("followNow", true);
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
    const fmtA = instant
      .setZone(form.anchorZone)
      .setLocale(locale)
      .toFormat("HH:mm");
    const fmtB = instant
      .setZone(otherEntry.defaultZone)
      .setLocale(locale)
      .toFormat("HH:mm");
    return t("summary", {
      timeA: fmtA,
      countryA: formatCountryRegion(anchorCode, locale),
      timeB: fmtB,
      countryB: formatCountryRegion(other, locale),
    });
  }, [utcResult, filled, anchorCode, anchorEntry, form.anchorZone, locale, t]);

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
      setAnchorIdx(idx);
      const code = slots[idx];
      if (code && countriesZones.countries[code]) {
        applyAnchorDefaults(code);
        refreshLiveMinute(setLiveMinute);
      }
    },
    [applyAnchorDefaults, slots],
  );

  const setSlot = useCallback((idx: number, code: string) => {
    setSlots((prev) => prev.map((c, i) => (i === idx ? code : c)));
    setPickerTarget(null);
  }, []);

  const setAnchorCountry = useCallback(
    (code: string) => {
      const idx = slots.indexOf(code);
      if (idx >= 0) {
        setAsAnchor(idx);
      } else {
        setSlots((prev) => prev.map((c, i) => (i === anchorIdx ? code : c)));
        applyAnchorDefaults(code);
        refreshLiveMinute(setLiveMinute);
      }
      setPickerTarget(null);
    },
    [anchorIdx, applyAnchorDefaults, setAsAnchor, slots],
  );

  const removeSlot = useCallback((idx: number) => {
    setSlots((prev) => {
      const next = prev.map((c, i) => (i === idx ? null : c));
      setAnchorIdx((current) => {
        if (idx !== current) {
          return current;
        }
        const fallback = next.findIndex((c) => c !== null);
        return fallback >= 0 ? fallback : current;
      });
      return next;
    });
  }, []);

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
