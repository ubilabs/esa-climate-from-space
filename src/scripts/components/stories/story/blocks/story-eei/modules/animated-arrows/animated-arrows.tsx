import ScrollModule from "../base-scroll/module/scroll-module";
import Arrows from "./arrows/arrows";

import styles from "./animated-arrows.module.css";
import ScrollText from "../base-scroll/scroll-text/scroll-text";

const animationConfig = {
  initial: {
    yPosition: {
      input: [0, 0.2],
      output: ["20%", "0%"],
    },
  },
} as const;

export type AnimatedArrowsConfig = typeof animationConfig;

export default function AnimatedArrowsModule() {
  const moduleTotalLength = 5;

  return (
    <ScrollModule
      config={animationConfig}
      style={{ height: `calc(var(--story-height) * ${moduleTotalLength})` }}
      className={styles.animatedArrowsWrapper}
    >
      <ScrollModule.Slide className={styles.container}>
        <Arrows />

        <ScrollText
          text="test"
          inputRange={[0, 0.2]}
          outputRange={["0vw", "100vw"]}
        />
      </ScrollModule.Slide>
    </ScrollModule>
  );
}
