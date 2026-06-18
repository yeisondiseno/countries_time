/** AdSense slots stay off until publisher approval and explicit env opt-in. */
export const isAdsEnabled = (): boolean =>
  process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
