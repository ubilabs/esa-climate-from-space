import { motion, useTransform } from "motion/react";
import { useIntl } from "react-intl";
import cx from "classnames";

import { useScreenInfo } from "../../../../../../hooks/use-screen-info";

import { ArrowUpIcon } from "../../../../../main/icons/arrow-up-icon";
import { MouseIcon } from "../../../../../main/icons/mouse-icon";
import { ArrowDownIcon } from "../../../../../main/icons/arrow-down-icon";

import { useScrollModule } from "../../modules/base-scroll/use-scroll-module";

import styles from "./gesture-indicator.module.css";

const animationConfig = {
  input: [0.5, 0.8],
  output: ["100%", "0%"],
};

export default function GestureIndicator() {
  const { isTouchDevice } = useScreenInfo();
  const intl = useIntl();
  const { scrollYProgress } = useScrollModule<typeof animationConfig>();

  return (
    <motion.div
      style={{
        opacity: useTransform(
          scrollYProgress,
          animationConfig.input,
          animationConfig.output,
        ),
      }}
      aria-hidden="true"
      className={cx(
        // Make sure to show the gesture indicator depending on whether it is touch screen device
        styles.gestureIndicator,
        isTouchDevice ? styles.touch : styles.scroll,
      )}
      data-content={intl.formatMessage({
        id: `category.${isTouchDevice ? "swipe" : "scroll"}`,
      })}
    >
      <ArrowUpIcon />
      <MouseIcon />
      <ArrowDownIcon />
    </motion.div>
  );
}
