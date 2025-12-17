import { FunctionComponent, useEffect, useState, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { useMatomo } from "@datapunt/matomo-tracker-react";

import type { CookieConsent } from "../../../types/cookie-consent";

import Button from "../button/button";

import { loadConsent } from "../../../libs/load-consent";
import { useConsent } from "../../../hooks/use-consent";

import styles from "./cookie-consent.module.css";

const CookieConsent: FunctionComponent = () => {
  const location = useLocation();
  const { trackPageView } = useMatomo();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const intl = useIntl();

  const { consent, saveConsent } = useConsent();
  const [showBanner, setShowBanner] = useState(!consent);
  const [showPreferences, setShowPreferences] = useState(false);
  const [openedExternally, setOpenedExternally] = useState(false);

  // Preferences state
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    consent?.analytics ?? false,
  );
  const [youTubeEnabled, setYouTubeEnabled] = useState(
    consent?.youTube ?? false,
  );

  // Listen for external requests to open privacy settings
  useEffect(() => {
    const handleOpenSettings = () => {
      setShowBanner(true);
      setShowPreferences(true);
      setOpenedExternally(true);
      // Update preferences state with current consent
      const currentConsent = loadConsent();
      setAnalyticsEnabled(currentConsent?.analytics ?? false);
      setYouTubeEnabled(currentConsent?.youTube ?? false);
    };

    window.addEventListener("openPrivacySettings", handleOpenSettings);
    return () =>
      window.removeEventListener("openPrivacySettings", handleOpenSettings);
  }, []);

  // Show/hide dialog based on banner state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (showBanner || showPreferences) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [showBanner, showPreferences]);

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, youTube: true });
    setShowBanner(false);
    setShowPreferences(false);
    setOpenedExternally(false);
  };

  const rejectOptional = () => {
    saveConsent({ necessary: true, analytics: false, youTube: false });
    setShowBanner(false);
    setShowPreferences(false);
    setOpenedExternally(false);
  };

  const savePreferences = () => {
    saveConsent({
      necessary: true,
      analytics: analyticsEnabled,
      youTube: youTubeEnabled,
    });
    setShowBanner(false);
    setShowPreferences(false);
    setOpenedExternally(false);
  };

  const openPreferences = () => {
    setShowPreferences(true);
  };

  // Track page views
  useEffect(() => {
    if (consent?.analytics) {
      trackPageView({
        href: `${window.location.origin}/#${location.pathname}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, consent?.analytics]);

  if (!showBanner && !showPreferences) {
    return null;
  }

  return (
    <dialog ref={dialogRef} className={styles.cookieConsent}>
      {showPreferences ? (
        <>
          <h2 className={styles.title}>
            <FormattedMessage id="cookieConsent.preferences.title" />
          </h2>
          <p className={styles.message}>
            <FormattedMessage id="cookieConsent.preferences.intro" />
          </p>

          <div className={styles.categories}>
            {/* Necessary Cookies */}
            <div className={styles.category}>
              <div className={styles.categoryHeader}>
                <h3 className={styles.categoryTitle}>
                  <FormattedMessage id="cookieConsent.category.necessary" />
                </h3>
                <div className={styles.toggle}>
                  <input type="checkbox" checked disabled />
                  <span className={styles.alwaysActive}>
                    <FormattedMessage id="cookieConsent.alwaysActive" />
                  </span>
                </div>
              </div>
              <p className={styles.categoryDescription}>
                <FormattedMessage id="cookieConsent.category.necessary.description" />
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className={styles.category}>
              <div className={styles.categoryHeader}>
                <h3 className={styles.categoryTitle}>
                  <FormattedMessage id="cookieConsent.category.analytics" />
                </h3>
                <label
                  className={styles.toggle}
                  aria-label={intl.formatMessage({
                    id: "cookieConsent.toggleAnalytics",
                  })}
                >
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
              <p className={styles.categoryDescription}>
                <FormattedMessage id="cookieConsent.category.analytics.description" />
              </p>
            </div>

            {/* Media Cookies */}
            <div className={styles.category}>
              <div className={styles.categoryHeader}>
                <h3 className={styles.categoryTitle}>
                  <FormattedMessage id="cookieConsent.category.media" />
                </h3>
                <label
                  className={styles.toggle}
                  aria-label={intl.formatMessage({
                    id: "cookieConsent.toggleMedia",
                  })}
                >
                  <input
                    type="checkbox"
                    checked={youTubeEnabled}
                    onChange={(e) => setYouTubeEnabled(e.target.checked)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
              <p className={styles.categoryDescription}>
                <FormattedMessage id="cookieConsent.category.media.description" />
              </p>
            </div>
          </div>

          <div className={styles.buttons}>
            <Button
              className={styles.cookieConsentSecondary}
              label="cookieConsent.back"
              onClick={() => {
                if (openedExternally) {
                  // Close dialog completely if opened from menu
                  setShowBanner(false);
                  setShowPreferences(false);
                  setOpenedExternally(false);
                } else {
                  // Go back to banner if opened from initial consent
                  setShowPreferences(false);
                }
              }}
            />
            <Button
              className={styles.cookieConsentPrimary}
              label="cookieConsent.savePreferences"
              onClick={savePreferences}
            />
          </div>
        </>
      ) : (
        <>
          <h2 className={styles.title}>
            <FormattedMessage id="cookieConsent.title" />
          </h2>
          <p className={styles.message}>
            <FormattedMessage id="cookieConsent.message" />
          </p>
          <p className={styles.details}>
            <FormattedMessage id="cookieConsent.details" />
          </p>
          <div className={styles.buttons}>
            <Button
              className={styles.cookieConsentPrimary}
              label="cookieConsent.acceptAll"
              onClick={acceptAll}
            />
            <Button
              className={styles.cookieConsentSecondary}
              label="cookieConsent.rejectOptional"
              onClick={rejectOptional}
            />
            <Button
              className={styles.cookieConsentTertiary}
              label="cookieConsent.managePreferences"
              onClick={openPreferences}
            />
          </div>
        </>
      )}
    </dialog>
  );
};

export default CookieConsent;
