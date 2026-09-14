import { FunctionComponent, Ref } from "react";
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

interface Props {
  ref: Ref<HTMLElement> | undefined;
}

const Title: FunctionComponent<{ title: string }> = ({ title }) => {
  const { scrollYProgress } = useScrollModule<typeof animationConfig>();
  return (
    <motion.h1
      className={styles.title}
      style={{
        y: useTransform(
          scrollYProgress,
          animationConfig.input,
          animationConfig.output,
        ),
      }}
    >
      {title}
    </motion.h1>
  );
};

export default function SplashScreenXFires({ ref }: Props) {
  const { story, setScrollAnchorRefs } = useStory();
  const splashConfig = story?.splashscreen;

  return (
    <ScrollModule
      refTarget={ref}
      config={animationConfig}
      lengthFactor={splashConfig?.lengthFactor ?? 1}
    >
      <ScrollModule.StickyContainer
        className={styles.splashWrapper}
        isGrid
        ref={setScrollAnchorRefs("0-0-0")}
      >
        <Title title={splashConfig?.title ?? ""} />
        <GestureIndicator />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
