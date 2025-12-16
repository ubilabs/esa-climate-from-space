import { useEffect, useState } from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";

import type { CookieConsent } from "../types/cookie-consent";
import { loadConsent } from "../libs/load-consent";

export function useConsent() {
  const { pushInstruction } = useMatomo();
  const [consent, setConsent] = useState<CookieConsent | null>(loadConsent());
  // Tracks if requireConsentGiven instruction has initially been pushed
  const [requireConsentPushed, setRequireConsentPushed] = useState(false);
  // Tracks if forgetConsentGiven instruction has initially been pushed
  const [forgetConsentPushed, setForgetConsentPushed] = useState(false);

  useEffect(() => {
    if (consent?.analytics) {
      pushInstruction("rememberConsentGiven");
      pushInstruction("enableJSErrorTracking");
    } else if (!requireConsentPushed) {
      pushInstruction("requireConsent");
      setRequireConsentPushed(true);
    }

    if (consent && !consent.analytics && !forgetConsentPushed) {
      pushInstruction("forgetConsentGiven");
      setForgetConsentPushed(true);
    }
  }, [consent, pushInstruction, requireConsentPushed, forgetConsentPushed]);

  const saveConsent = (newConsent: CookieConsent) => {
    localStorage.setItem("cookieConsent", JSON.stringify(newConsent));
    setConsent(newConsent);

    // Apply Matomo settings
    if (newConsent.analytics) {
      pushInstruction("rememberConsentGiven");
      pushInstruction("enableJSErrorTracking");
    } else {
      pushInstruction("forgetConsentGiven");
    }
  };

  return { consent, saveConsent };
}
