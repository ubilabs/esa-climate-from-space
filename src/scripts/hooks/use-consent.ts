import { useCallback, useEffect, useRef, useState } from "react";
import { useMatomo } from "@streamr/matomo-tracker-react";

import type { CookieConsent } from "../types/cookie-consent";
import { loadConsent } from "../libs/load-consent";

export function useConsent() {

  const { pushInstruction } = useMatomo();
  const [consent, setConsent] = useState<CookieConsent | null>(loadConsent());
  // Tracks if requireConsentGiven instruction has initially been pushed
  const requireConsentPushed = useRef(false);
  // Tracks if forgetConsentGiven instruction has initially been pushed
  const forgetConsentPushed = useRef(false);

  const enableAnalytics = useCallback(() => {
    pushInstruction("rememberConsentGiven");
    pushInstruction("enableJSErrorTracking");
    pushInstruction("enableMediaAnalytics");
  }, [pushInstruction]);

  useEffect(() => {
    if (consent?.analytics) {
      enableAnalytics();
    } else if (!requireConsentPushed.current) {
      pushInstruction("requireConsent");
      requireConsentPushed.current = true;
    }

    if (consent && !consent.analytics && !forgetConsentPushed.current) {
      pushInstruction("forgetConsentGiven");
      forgetConsentPushed.current = true;
    }
  }, [consent, pushInstruction, enableAnalytics]);

  const saveConsent = (newConsent: CookieConsent) => {
    localStorage.setItem("cookieConsent", JSON.stringify(newConsent));
    setConsent(newConsent);

    // Apply Matomo settings
    if (newConsent.analytics) {
      enableAnalytics();
    } else {
      pushInstruction("forgetConsentGiven");
    }
  };

  return { consent, saveConsent };
}
