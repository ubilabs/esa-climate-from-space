import { FormattedMessage, useIntl } from "react-intl";
import styles from "./initial-splash.module.css";
import { useScreenInfo } from "../../../hooks/use-screen-info";

import cx from "classnames";

export default function InitialSplash() {
  const intl = useIntl();

  const { isTouchDevice } = useScreenInfo();

  return (
    <>
      <div className={styles.titleWrapper}>
        <h1 className={styles.welcomeTitle}>
          <FormattedMessage id="welcomeTitle" />
        </h1>
        <p className={styles.subTitle}>
          <FormattedMessage id="welcomeSubtitle" />
        </p>
      </div>
      <nav className={styles.chosenCategory}></nav>

      <div
        className={cx(
          styles["category-navigation"],
          styles["reveal-from-left"],
        )}
        aria-label="Circle Navigation"
      ></div>

      <span
        aria-hidden="true"
        className={styles.gestureIndicator}
        data-content={intl.formatMessage({
          id: `category.${isTouchDevice ? "scroll" : "scrollOrArrow"}`,
        })}
      ></span>
    </>
  );
}
