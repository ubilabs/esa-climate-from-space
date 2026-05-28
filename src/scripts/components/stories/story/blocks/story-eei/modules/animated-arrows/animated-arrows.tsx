import ScrollModule from "../base-scroll/module/scroll-module";
import Arrows from "./arrows/arrows";
import ScrollText from "../base-scroll/scroll-text/scroll-text";
import { StoryEEIModule } from "../../../../../../../types/story";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

const animationConfig = {
  scrollText1: {
    input: [0, 0.19, 0.29, 0.49],
    output: ["0%", "-40%", "-40%", "-100%"],
  },
  downArrow: {
    input: [0.065, 0.19, 0.39, 0.51, 0.52],
    output: [100, 0, 0, 0, 100],
  },
  upArrow: {
    input: [0.14, 0.29, 0.49, 0.51],
    output: [100, 0, 0.5, 100],
  },
  scrollText2: {
    input: [0.29, 0.32158, 0.39, 0.49, 0.5325],
    output: ["100%", "100%", "-40%", "-40%", "-100%"],
  },
  scrollText3: {
    input: [0.5, 0.7, 0.75, 1.1, 1.2],
    output: ["100%", "100%", "0%", "0%", "-100%"],
  },
};

export type AnimatedArrowsConfig = typeof animationConfig;

export default function AnimatedArrowsModule() {
  const { module, getRefCallback } = useModuleContent();
  const eeiModule = module as StoryEEIModule;

  return (
    <ScrollModule
      lengthFactor={eeiModule.lengthFactor}
      config={animationConfig}
    >
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <Arrows />

        <ScrollText
          text={eeiModule.content?.scrollText1 || ""}
          inputRange={animationConfig.scrollText1.input}
          outputRange={animationConfig.scrollText1.output}
        />

        <ScrollText
          text={eeiModule.content?.scrollText2 || ""}
          inputRange={animationConfig.scrollText2.input}
          outputRange={animationConfig.scrollText2.output}
        />
        <ScrollText
          text={eeiModule.content?.scrollText3 || ""}
          inputRange={animationConfig.scrollText3.input}
          outputRange={animationConfig.scrollText3.output}
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
