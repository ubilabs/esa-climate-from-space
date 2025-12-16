import { CookieConsent } from "../types/cookie-consent";

// Load consent from localStorage or use defaults
export const loadConsent = (): CookieConsent | null => {
  const stored = localStorage.getItem("cookieConsent");
  return stored ? JSON.parse(stored) : null;
};
