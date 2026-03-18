import ScrollModule from "../base-scroll/module/scroll-module";
import ScrollText from "../base-scroll/scroll-text/scroll-text";
import BoilCount from "./boil-count/boil-count";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import { StoryEEIModule } from "../../../../../../../types/story";

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
  const { module } = useModuleContent();
  const eeiModule = module as StoryEEIModule;

  if (!eeiModule.content) {
    console.warn("no content provided for ", module.type);
    return null;
  }

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={eeiModule.lengthFactor}
    >
      <ScrollModule.StickyContainer isGrid>
        <ScrollText
          text={eeiModule.content.scrollText1 || ""}
          inputRange={animationConfig.scrollText1.input}
          outputRange={animationConfig.scrollText1.output}
        />
        <BoilCount />
        <ScrollText
          text={eeiModule.content.scrollText3 || ""}
          inputRange={animationConfig.scrollText3.input}
          outputRange={animationConfig.scrollText3.output}
        />
        <ScrollText
          text={eeiModule.content.scrollText4 || ""}
          inputRange={animationConfig.scrollText4.input}
          outputRange={animationConfig.scrollText4.output}
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
