import { routing } from "@/i18n/routing";

export const locales = routing.locales;
export type Locale = (typeof locales)[number];
export const defaultLocale = routing.defaultLocale;

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
