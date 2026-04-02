import { FormattedMessage } from "react-intl";
import { useScreenInfo } from "../../../hooks/use-screen-info";

import { MouseIcon } from "../icons/mouse-icon";
import { ArrowKeysIcon } from "../icons/arrow-keys-icon";
import { SwipeVerticalIcon } from "../icons/swipe-vertical-icon";

import styles from "./initial-splash.module.css";

export default function InitialSplash() {
  const { isTouchDevice } = useScreenInfo();

  const icons = isTouchDevice ? (
    <SwipeVerticalIcon />
  ) : (
    <>
      <MouseIcon rounded />
      <ArrowKeysIcon />
    </>
  );

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

      <div className={styles.gestureIndicator}>
        <div className={styles.iconContainer}>{icons}</div>
        <span className={styles.info}>
          <FormattedMessage
            id={isTouchDevice ? "category.swipe" : "category.scrollOrArrow"}
          />
        </span>
      </div>
    </>
  );
}
