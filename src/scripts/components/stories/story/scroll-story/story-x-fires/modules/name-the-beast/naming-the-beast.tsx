import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import { useRef } from "react";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import GlobalFires from "./global-fires/global-fires";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import FadeWrapper from "../fade-wrapper/fade-wrapper";
import {
  ENTERING_TEXT_OUTPUT,
  THREE_TEXT_TIMING,
  VISIBLE_TEXT_OUTPUT,
} from "../animation-timings";

const animationConfig = {
  spinStart: 0.2,
  spinEnd: 0.9,
  globeOpacity: {
    input: [0, 0.05, 0.1, 0.9, 1],
    output: [0, 0, 1, 1, 0],
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

export type NamingTheBeastConfig = typeof animationConfig;

export default function NamingTheBeast() {
  const { module, getRefCallback } = useModuleContent();
  const xFiresModule = module as StoryXFiresModule;
  const ref = useRef(null);

  return (
    <ScrollModule
      refTarget={ref}
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <FadeWrapper direction="fadeIn">
          <GlobalFires />
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
        </FadeWrapper>
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
