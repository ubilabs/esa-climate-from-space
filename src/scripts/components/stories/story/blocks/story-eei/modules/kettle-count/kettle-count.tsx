import ScrollModule from "../base-scroll/module/scroll-module";
import ScrollText from "../base-scroll/scroll-text/scroll-text";
import BoilCount from "./boil-count/boil-count";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

const animationConfig = {
  scrollText1: {
    input: [0, 0.05, 0.15, 0.2],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText2: {
    input: [0, 0.2, 0.25, 0.35, 0.4],
    output: ["100%", "100%", "0%", "0%", "-100%"],
  },
  boilCount: {
    input: [0, 0.4, 0.45, 0.55, 0.6],
    output: ["100%", "100%", "0%", "0%", "-100%"],
  },
  scrollText3: {
    input: [0, 0.6, 0.65, 0.75, 0.8],
    output: ["100%", "100%", "0%", "0%", "-100%"],
  },
  scrollText4: {
    input: [0, 0.8, 0.85, 0.95, 1],
    output: ["100%", "100%", "0%", "0%", "-100%"],
  },
};

export type KettleCountConfig = typeof animationConfig;

export default function KettleCount() {
  const {
    module: { lengthFactor },
  } = useModuleContent();

  return (
    <ScrollModule config={animationConfig} lengthFactor={lengthFactor}>
      <ScrollModule.StickyContainer isGrid>
        <ScrollText
          text="And if you apply that increase to the entire surface of the Earth..."
          inputRange={animationConfig.scrollText1.input}
          outputRange={animationConfig.scrollText1.output}
        />
        <BoilCount />
        <ScrollText
          text="since you arrived on this page.\
          \
          This excess energy fuels the changes we are seeing in Earth’s climate. It is the engine behind stronger storms, floods, droughts, and rising seas."
          inputRange={animationConfig.scrollText3.input}
          outputRange={animationConfig.scrollText3.output}
        />
        <ScrollText
          text="ESA’s Climate Change Initiative is using satellite observations of the land, ocean, icecaps and atmosphere to measure individual components of Earth’s energy budget."
          inputRange={animationConfig.scrollText4.input}
          outputRange={animationConfig.scrollText4.output}
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
