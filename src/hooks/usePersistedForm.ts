"use client";

import { useEffect, useRef } from "react";

import {
  useForm,
  useWatch,
  type DefaultValues,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";

export type UsePersistedFormOptions<T extends FieldValues> = {
  storageKey: string;
  defaultValues: DefaultValues<T>;
  /** Campos efímeros que no se guardan ni restauran desde localStorage. */
  omitKeys?: readonly (keyof T)[];
  parseStored?: (raw: unknown, defaults: DefaultValues<T>) => DefaultValues<T>;
  formOptions?: Omit<UseFormProps<T>, "defaultValues">;
};

function readRaw(storageKey: string): unknown {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function mergeStored<T extends FieldValues>(
  storageKey: string,
  defaultValues: DefaultValues<T>,
  omitKeys: readonly (keyof T)[],
  parseStored?: UsePersistedFormOptions<T>["parseStored"],
): DefaultValues<T> {
  const raw = readRaw(storageKey);
  const parsed = parseStored
    ? parseStored(raw, defaultValues)
    : raw && typeof raw === "object"
      ? ({ ...defaultValues, ...(raw as Partial<T>) } as DefaultValues<T>)
      : defaultValues;

  for (const key of omitKeys) {
    (parsed as T)[key] = (defaultValues as T)[key];
  }

  return parsed;
}

function writeStored<T extends FieldValues>(
  storageKey: string,
  values: T,
  omitKeys: readonly (keyof T)[],
): void {
  const payload = { ...values };
  for (const key of omitKeys) {
    delete payload[key];
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  } catch {
    // localStorage no disponible (modo privado, cuota, etc.)
  }
}

/** `useForm` con hidratación y persistencia en `localStorage`. */
export function usePersistedForm<T extends FieldValues>({
  storageKey,
  defaultValues,
  omitKeys = [],
  parseStored,
  formOptions,
}: UsePersistedFormOptions<T>): UseFormReturn<T> {
  const formMethods = useForm<T>({
    defaultValues,
    ...formOptions,
  });

  const { reset, control } = formMethods;

  const hydratedKeyRef = useRef<string | null>(null);
  const readyToPersistRef = useRef(false);
  const lastWrittenRef = useRef<string | null>(null);

  const values = useWatch({ control }) as T;

  useEffect(() => {
    if (hydratedKeyRef.current === storageKey) {
      return;
    }

    hydratedKeyRef.current = storageKey;
    readyToPersistRef.current = false;

    const restored = mergeStored(
      storageKey,
      defaultValues,
      omitKeys,
      parseStored,
    );

    reset(restored);
    lastWrittenRef.current = JSON.stringify(restored);
    readyToPersistRef.current = true;
  }, [storageKey, defaultValues, omitKeys, parseStored, reset]);

  useEffect(() => {
    if (!readyToPersistRef.current || values === undefined) {
      return;
    }

    const serialized = JSON.stringify(values);
    if (serialized === lastWrittenRef.current) {
      return;
    }

    lastWrittenRef.current = serialized;
    writeStored(storageKey, values, omitKeys);
  }, [values, storageKey, omitKeys]);

  return formMethods;
}
