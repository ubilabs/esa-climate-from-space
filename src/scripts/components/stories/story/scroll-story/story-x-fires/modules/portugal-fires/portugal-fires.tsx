import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import ScrollImageSequence from "../../../modules/base-scroll/scroll-image-sequence/scroll-image-sequence";
import Dimmer, { DimmerAnimationConfig } from "../dimmer/dimmer";

const animationConfig = {
  imageSequence: {
    progressRange: [0.2, 1],
    input: [0, 0.05, 0.08, 0.2],
    output: ["0%", "0%", "20%", "100%"],
  },

  scrollText1: {
    input: [0, 0.1, 0.15, 0.225, 0.3],
    output: ["100%", "100%", "25%", "25%", "-100%"],
  },
  scrollText2: {
    input: [0.35, 0.4, 0.5, 0.6],
    output: ["100%", "35%", "35%", "-100%"],
  },
  dimmer: {
    input: [0.6, 0.675],
    output: [0.5, 0],
  },
} satisfies DimmerAnimationConfig;

export type PortugalFiresAnimationConfig = typeof animationConfig;

export default function PortugalFiresModule() {
  const { module, getRefCallback } = useModuleContent();

  const xFiresModule = module as StoryXFiresModule & {
    imageSequence: {
      path: string;
    };
  };

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <ScrollImageSequence sequence={xFiresModule.imageSequence} />
        <Dimmer />
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
