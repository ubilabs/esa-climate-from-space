import React, {FunctionComponent, useEffect, useState} from 'react';

import {useMatomo} from '@datapunt/matomo-tracker-react';

import styles from './tracking-toggle.styl';

const TrackingToggle: FunctionComponent = () => {
  const {pushInstruction} = useMatomo();
  const [consentGiven, setConsentGiven] = useState(
    localStorage.getItem('matomoConsent') === 'yes'
  );

  useEffect(() => {}, []);

  return (
    <input
      type="checkbox"
      className={styles.trackingToggle}
      onChange={event => {
        const checked = event.target.checked;

        if (checked) {
          localStorage.setItem('matomoConsent', 'yes');
          pushInstruction('rememberConsentGiven');
          pushInstruction('rememberCookieConsentGiven');
        } else {
          localStorage.setItem('matomoConsent', 'no');
          pushInstruction('forgetConsentGiven');
          pushInstruction('forgetCookieConsentGiven');
        }

        setConsentGiven(checked);
      }}
      checked={consentGiven}></input>
  );
};

export default TrackingToggle;
