import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";

const animationConfig = {
  scrollText1: {
    input: [0, 0.075, 0.225, 0.3],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText2: {
    input: [0.3, 0.375, 0.525, 0.55],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText3: {
    input: [0.55, 0.675, 0.825, 0.9],
    output: ["100%", "0%", "0%", "-100%"],
  },
};

export type HurricanOpheliaConfig = typeof animationConfig;

export default function HurricanOphelia() {
  const { module, getRefCallback } = useModuleContent();
  const xFiresModule = module as StoryXFiresModule;

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <ScrollText
          text={xFiresModule.content?.scrollText1 || ""}
          inputRange={animationConfig.scrollText1.input}
          outputRange={animationConfig.scrollText1.output}
        />
        <ScrollText
          text={xFiresModule.content?.scrollText2 || ""}
          inputRange={animationConfig.scrollText2.input}
          outputRange={animationConfig.scrollText2.output}
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
