import { FunctionComponent, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router-dom";
import { useMatomo } from "@datapunt/matomo-tracker-react";

import Button from "../button/button";

import styles from "./tracking.module.css";

const Tracking: FunctionComponent = () => {
  const location = useLocation();
  const { pushInstruction, trackPageView } = useMatomo();
  const [consentGiven, setConsentGiven] = useState(
    localStorage.getItem("matomoConsent") === "yes",
  );
  const [consentRejected, setConsentRejected] = useState(
    localStorage.getItem("matomoConsent") === "no",
  );
  const [requireConsentPushed, setRequireConsentPushed] = useState(false);
  const [forgetConsentPushed, setForgetConsentPushed] = useState(false);

  useEffect(() => {
    if (consentGiven) {
      pushInstruction("rememberConsentGiven");
      pushInstruction("enableJSErrorTracking");
    } else if (!requireConsentPushed) {
      pushInstruction("requireConsent");
      setRequireConsentPushed(true);
    }

    if (consentRejected && !forgetConsentPushed) {
      pushInstruction("forgetConsentGiven");
      setForgetConsentPushed(true);
    }
  }, [
    consentGiven,
    consentRejected,
    pushInstruction,
    requireConsentPushed,
    forgetConsentPushed,
  ]);

  useEffect(() => {
    trackPageView({
      href: `${window.location.origin}/#${location.pathname}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (consentGiven || consentRejected) {
    return null;
  }

  return (
    <div className={styles.tracking}>
      <p className={styles.message}>
        <FormattedMessage id={"tracking.message"} />
      </p>
      <div className={styles.buttons}>
        <Button
          className={styles.trackingNo}
          label="tracking.no"
          onClick={() => {
            setConsentRejected(true);
            localStorage.setItem("matomoConsent", "no");
          }}
        />
        <Button
          className={styles.trackingYes}
          label="tracking.yes"
          onClick={() => {
            setConsentGiven(true);
            localStorage.setItem("matomoConsent", "yes");
          }}
        />
      </div>
    </div>
  );
};

export default Tracking;
