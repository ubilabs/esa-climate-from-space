import { FunctionComponent } from "react";
import { motion, useTransform } from "motion/react";

import { useScreenInfo } from "../../../../../../hooks/use-screen-info";
import { useScrollModule } from "../../modules/base-scroll/use-scroll-module";
import { useIntl } from "react-intl";
import { useStory } from "../../../../../../providers/story/use-story";

import ScrollModule from "../../modules/base-scroll/module/scroll-module";
import { ArrowUpIcon } from "../../../../../main/icons/arrow-up-icon";
import { MouseIcon } from "../../../../../main/icons/mouse-icon";
import { ArrowDownIcon } from "../../../../../main/icons/arrow-down-icon";

import cx from "classnames";

import styles from "./splashscreen-x-fires.module.css";

const animationConfig = {
  gestureIndicator: {
    input: [0.5, 0.8],
    output: ["100%", "0%"],
  },
  title: {
    input: [0.5, 1],
    output: ["-10vh", "-50vh"],
  },
};

export type SplashAnimationConfig = typeof animationConfig;

const GestureIndicator = () => {
  const { isTouchDevice } = useScreenInfo();
  const intl = useIntl();
  const { scrollYProgress } = useScrollModule<SplashAnimationConfig>();

  return (
    <motion.div
      style={{
        opacity: useTransform(
          scrollYProgress,
          animationConfig.gestureIndicator.input,
          animationConfig.gestureIndicator.output,
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
};

const Header: FunctionComponent<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  const { scrollYProgress } = useScrollModule<SplashAnimationConfig>();
  return (
    <motion.header
      className={styles.header}
      style={{
        y: useTransform(
          scrollYProgress,
          animationConfig.title.input,
          animationConfig.title.output,
        ),
      }}
    >
      <p>{subtitle}</p>
      <h1>{title}</h1>
    </motion.header>
  );
};

export default function SplashScreenXFires() {
  const { story, setScrollAnchorRefs } = useStory();
  const splashConfig = story?.splashscreen;

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={splashConfig?.lengthFactor ?? 1}
    >
      <ScrollModule.StickyContainer
        className={styles.splashWrapper}
        isGrid
        ref={setScrollAnchorRefs("0-0-0")}
      >
        <Header
          title={splashConfig?.title ?? ""}
          subtitle={splashConfig?.subtitle ?? ""}
        />
        <GestureIndicator />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
