import ScrollModule from "../base-scroll/module/scroll-module";
import Arrows from "./arrows/arrows";
import ScrollText from "../base-scroll/scroll-text/scroll-text";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

const animationConfig = {
  scrollText1: {
    input: [0, 0.1, 0.15, 0.25],
    output: ["100%", "100%", "0%", "-100%"],
  },
  downArrow: {
    input: [0.15, 0.4],
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
  scrollText2: {
    input: [0, 0.6, 0.8, 0.95],
    output: ["100%", "0%", "0%", "-100%" ],
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
