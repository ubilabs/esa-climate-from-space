import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import ZoomToPortugal from "./zoom-to-portugal";
import {
  ENTERING_TEXT_OUTPUT,
  THREE_TEXT_TIMING,
  VISIBLE_TEXT_OUTPUT,
} from "../animation-timings";

const animationConfig = {
  globeLayerThreshold: 0.325,
  globeOpacity: {
    input: [0, 0.1, 0.9, 1],
    output: [0, 1, 1, 0],
  },
  scrollText1: {
    input: THREE_TEXT_TIMING.firstVisible,
    output: VISIBLE_TEXT_OUTPUT,
  },
  scrollText2: {
    input: THREE_TEXT_TIMING.second,
    output: ENTERING_TEXT_OUTPUT,
  },
  scrollText3: {
    input: THREE_TEXT_TIMING.third,
    output: ENTERING_TEXT_OUTPUT,
  },
};

export type ZoomToPortugalAnimationConfig = typeof animationConfig;

type ZoomToPortugalContent = StoryXFiresModule;

export default function ZoomToPortugalModule() {
  const { module, getRefCallback } = useModuleContent();
  const xFiresModule = module as ZoomToPortugalContent;

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <ZoomToPortugal />
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
        <ScrollText
          text={xFiresModule.content?.scrollText3 || ""}
          inputRange={animationConfig.scrollText3.input}
          outputRange={animationConfig.scrollText3.output}
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
