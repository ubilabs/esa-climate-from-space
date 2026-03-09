import ScrollModule from "../base-scroll/module/scroll-module";
import ScrollText from "../base-scroll/scroll-text/scroll-text";
import BoilCount from "./boil-count/boil-count";

import styles from "./kettle-count.module.css";

const animationConfig = {
  scrollText1: {
    input: [0.13, 0.2, 0.3],
    output: ["50vh", "50vh", "-50vh"],
  },
  scrollText2: {
    input: [0.4, 0.5, 0.6, 0.7],
    output: ["100vh", "20vh", "20vh", "-50vh"],
  },
  scrollText3: {
    input: [0.5, 0.6, 0.7, 0.8],
    output: ["100vh", "30vh", "30vh", "-50vh"],
  },
  scrollText4: {
    input: [0.75, 0.8, 0.9, 1],
    output: ["100vh", "20vh", "20vh", "-50vh"],
  },
};

export type KettleCountConfig = typeof animationConfig;

export default function KettleCount() {
  const MODULE_TOTAL_LENGTH = 20;

  return (
    <ScrollModule
      config={animationConfig}
      style={{ height: `calc(var(--story-height) * ${MODULE_TOTAL_LENGTH})` }}
      className={styles.kettleCountWrapper}
    >
      <ScrollModule.Slide className={styles.container}>
        <ScrollText
          text="And if you apply that increase to the entire surface of the Earth..."
          inputRange={animationConfig.scrollText1.input}
          outputRange={animationConfig.scrollText1.output}
        />
        <BoilCount />
        <ScrollText
          text="Since you arrived on this page, we have trapped enough heat to boil"
          inputRange={animationConfig.scrollText2.input}
          outputRange={animationConfig.scrollText2.output}
        />
        <ScrollText
          text="This excess energy fuels the changes we are seeing in Earth’s climate. It is the engine behind stronger storms, floods, droughts, and rising seas."
          inputRange={animationConfig.scrollText3.input}
          outputRange={animationConfig.scrollText3.output}
        />
        <ScrollText
          text="ESA’s Climate Change Initiative is using satellite observations of the land, ocean, atmosphere and icecaps to measure individual components of Earth’s energy budget."
          inputRange={animationConfig.scrollText4.input}
          outputRange={animationConfig.scrollText4.output}
        />
      </ScrollModule.Slide>
    </ScrollModule>
  );
}
