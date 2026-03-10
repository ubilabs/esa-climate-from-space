import ScrollModule from "../base-scroll/module/scroll-module";
import Arrows from "./arrows/arrows";
import ScrollText from "../base-scroll/scroll-text/scroll-text";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

const animationConfig = {
  downArrow: {
    input: [0.2, 0.4],
    output: [100, 0],
  },
  upArrow: {
    input: [0.3, 0.6],
    output: [100, 0],
  },
  opacity: {
    input: [0.8, 0.9],
    output: [1, 0],
  },
  scrollText1: {
    input: [0.2, 0.25, 0.4],
    output: ["40vh", "40vh", "-10vh"],
  },
  scrollText2: {
    input: [0, 0.6, 0.8, 0.9, 1],
    output: ["100vh", "100vh", "10vw", "6vw", "-50vh"],
  },
};

export type AnimatedArrowsConfig = typeof animationConfig;

export default function AnimatedArrowsModule() {
  const {
    module: { lengthFactor },
  } = useModuleContent();

  return (
    <ScrollModule lengthFactor={lengthFactor} config={animationConfig}>
      <ScrollModule.StickyContainer>
        <Arrows />

        <ScrollText
          text="Earth’s energy is out of balance."
          inputRange={animationConfig.scrollText1.input}
          outputRange={animationConfig.scrollText1.output}
        />

        <ScrollText
          text="More energy comes in from the Sun than we lose to space."
          inputRange={animationConfig.scrollText2.input}
          outputRange={animationConfig.scrollText2.output}
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
