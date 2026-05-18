/** Emoji de bandera regional a partir de código ISO 3166-1 alpha-2. */
export function flagEmoji(iso3166Upper: string): string {
  const code = iso3166Upper.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) {
    return "";
  }
  return [...code]
    .map((char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)))
    .join("");
}
