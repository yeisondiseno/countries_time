export type PickerTarget = { kind: "slot"; idx: number } | { kind: "anchor" };

export type CmpForm = {
  anchorCountry: string;
  anchorZone: string;
  date: string;
  time: string;
};

export type WorldComparatorFormValues = CmpForm & {
  followNow: boolean;
  pickerSearch: string;
  slots: (string | null)[];
  anchorIdx: number;
};

export type UtcResult = { ok: true; utcMillis: number } | { ok: false };

export const DEFAULT_SLOT_CODES = ["DE", "ES", "JP", "US"] as const;

export const LIVE_TICK_MS = 60_000;
