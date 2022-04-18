import type { PWALocaleConfig } from "./locales";

export * from "./locales";
export * from "./manifest";
export * from "./options";

declare global {
  const PWA_LOCALES: PWALocaleConfig;
  const SW_BASE_URL: string;
}
