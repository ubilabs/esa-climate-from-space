import { FunctionComponent, useState } from "react";

import { useMatomo } from "@datapunt/matomo-tracker-react";

import styles from "./tracking-toggle.module.css";

const TrackingToggle: FunctionComponent = () => {
  const { pushInstruction } = useMatomo();
  const [consentGiven, setConsentGiven] = useState(
    localStorage.getItem("matomoConsent") === "yes",
  );

  return (
    <input
      type="checkbox"
      className={styles.trackingToggle}
      onChange={(event) => {
        const checked = event.target.checked;

        if (checked) {
          localStorage.setItem("matomoConsent", "yes");
          pushInstruction("rememberConsentGiven");
        } else {
          localStorage.setItem("matomoConsent", "no");
          pushInstruction("forgetConsentGiven");
        }

        setConsentGiven(checked);
      }}
      checked={consentGiven}
    ></input>
  );
};

export default TrackingToggle;
