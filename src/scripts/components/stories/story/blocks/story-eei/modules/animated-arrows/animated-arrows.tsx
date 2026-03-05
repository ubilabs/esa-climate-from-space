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
  const moduleTotalLength = 8;

  return (
    <ScrollModule
      config={animationConfig}
      style={{ height: `calc(var(--story-height) * ${moduleTotalLength})` }}
      className={styles.animatedArrowsWrapper}
    >
      <ScrollModule.Slide className={styles.container}>
        <Arrows />

        <ScrollText
          text="Earth’s energy is out of balance."
          inputRange={[0.2, 0.4]}
          outputRange={["0vh", "-50vh"]}
        />

        <ScrollText
          text="More energy comes in from the Sun than we lose to space."
          inputRange={[0.2, 0.4]}
          outputRange={["0vh", "-50vh"]}
        />
      </ScrollModule.Slide>
    </ScrollModule>
  );
}
