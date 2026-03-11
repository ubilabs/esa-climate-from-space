import ScrollModule from "../base-scroll/module/scroll-module";
import Arrows from "./arrows/arrows";
import ScrollText from "../base-scroll/scroll-text/scroll-text";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

const animationConfig = {
  scrollText1: {
    input: [0, 0.19, 0.29, 0.49],
    output: ["0%", "-40%", "-40%", "-100%"],
  },
  downArrow: {
    input: [0.065, 0.19, 0.39],
    output: [100, 0, 0],
  },
  upArrow: {
    input: [0.14, 0.29, 0.49],
    output: [100, 0, 0.5],
  },
  opacity: {
    input: [0.29, 0.34, 0.44, 0.49],
    output: [1, 1, 1, 0],
  },
  scrollText2: {
    input: [0.29, 0.32158, 0.39, 0.49, 0.5325],
    output: ["100%", "100%", "-40%", "-40%", "-100%"],
  },
};

export type AnimatedArrowsConfig = typeof animationConfig;

export default function AnimatedArrowsModule() {
  const {
    module: { lengthFactor },
  } = useModuleContent();

  return (
    <ScrollModule lengthFactor={lengthFactor} config={animationConfig}>
      <ScrollModule.StickyContainer isGrid>
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
