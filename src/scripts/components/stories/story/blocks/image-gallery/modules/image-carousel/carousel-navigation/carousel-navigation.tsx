import { FunctionComponent } from "react";
import { useScreenInfo } from "../../../../../../../../hooks/use-screen-info";
import { useIntl } from "react-intl";
import cx from "classnames";

import { NextIcon } from "../../../../../../../main/icons/next-icon";
import { PreviousIcon } from "../../../../../../../main/icons/previous-icon";

import styles from "./carousel-navigation.module.css";

interface Props {
  index: number;
  slides: unknown[];
  snapToIndex: (index: number) => void;
}

const CarouselNavigation: FunctionComponent<Props> = ({
  index,
  slides,
  snapToIndex,
}) => {
  const { isMobile } = useScreenInfo();
  const intl = useIntl();

  return (
    <>
      {isMobile ? (
        <div className={styles.navigation}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={cx(styles.bullet, i === index && styles.active)}
              onClick={() => snapToIndex(i)}
              aria-label={intl.formatMessage(
                { id: "slides.goTo" },
                { number: i + 1 },
              )}
            />
          ))}
        </div>
      ) : (
        <div className={styles.navigation}>
          <button
            className={styles.navButton}
            onClick={() => snapToIndex(index - 1)}
            disabled={index === 0}
            aria-label={intl.formatMessage({ id: "slides.previous" })}
          >
            <PreviousIcon />
          </button>
          <span className={styles.counter}>
            {index + 1}/{slides.length}
          </span>
          <button
            className={styles.navButton}
            onClick={() => snapToIndex(index + 1)}
            disabled={index === slides.length - 1}
            aria-label={intl.formatMessage({ id: "slides.next" })}
          >
            <NextIcon />
          </button>
        </div>
      )}
    </>
  );
};

export default CarouselNavigation;
