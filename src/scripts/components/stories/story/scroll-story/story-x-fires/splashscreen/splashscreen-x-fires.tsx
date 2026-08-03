import { FunctionComponent } from "react";
import { motion, useTransform } from "motion/react";

import { useScrollModule } from "../../modules/base-scroll/use-scroll-module";
import { useStory } from "../../../../../../providers/story/use-story";

import ScrollModule from "../../modules/base-scroll/module/scroll-module";
import GestureIndicator from "../../modules/gesture-indicator/gesture-indicator";

import styles from "./splashscreen-x-fires.module.css";

const animationConfig = {
  input: [0.5, 1],
  output: ["-10vh", "-50vh"],
};

const Header: FunctionComponent<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  const { scrollYProgress } = useScrollModule<typeof animationConfig>();
  return (
    <motion.header
      className={styles.header}
      style={{
        y: useTransform(
          scrollYProgress,
          animationConfig.input,
          animationConfig.output,
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
