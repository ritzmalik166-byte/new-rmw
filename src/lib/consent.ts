export type CookieConsent = "all" | "essential";

export const CONSENT_STORAGE_KEY = "rmw-cookie-consent";
export const CONSENT_OPEN_EVENT = "rmw:cookie-settings";

export function readCookieConsent(): CookieConsent | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? "null");
    return saved?.choice === "all" || saved?.choice === "essential" ? saved.choice : null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(choice: CookieConsent) {
  try {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ choice, at: new Date().toISOString() }),
    );
  } catch {
    /* Private mode or storage disabled: the banner simply asks again next visit. */
  }
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
