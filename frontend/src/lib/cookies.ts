export type ConsentValue = "accepted" | "declined";

const CONSENT_KEY = "apslock-cookie-consent";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(CONSENT_KEY) as ConsentValue) ?? null;
}

export function setConsent(value: ConsentValue): void {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(
    new StorageEvent("storage", { key: CONSENT_KEY, newValue: value })
  );
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === "accepted";
}

/**
 * Subscribe to consent changes (cross-tab aware).
 * Returns an unsubscribe function.
 *
 * Usage (once Google Analytics is added):
 *   onConsentChange((consent) => {
 *     if (consent === "accepted") initGoogleAnalytics();
 *   });
 */
export function onConsentChange(
  callback: (consent: ConsentValue | null) => void
): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === CONSENT_KEY) {
      callback(e.newValue as ConsentValue | null);
    }
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
