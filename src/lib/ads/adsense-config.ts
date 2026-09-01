/** AdSense configuration — only used after publisher approval. */
const CLIENT_ID_PATTERN = /^ca-pub-\d+$/;
const SLOT_ID_PATTERN = /^\d+$/;

export function getAdSenseClientId(): string | null {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
  if (!clientId || !CLIENT_ID_PATTERN.test(clientId)) {
    return null;
  }
  return clientId;
}

export function getAdSenseSlotId(
  variant: "leaderboard" | "inContent" | "sidebar",
): string | null {
  const envKey =
    variant === "leaderboard"
      ? "NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD"
      : variant === "sidebar"
        ? "NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR"
        : "NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT";

  const slotId = process.env[envKey]?.trim();
  if (!slotId || !SLOT_ID_PATTERN.test(slotId)) {
    return null;
  }
  return slotId;
}

export function isAdSenseConfigured(): boolean {
  return Boolean(getAdSenseClientId());
}
