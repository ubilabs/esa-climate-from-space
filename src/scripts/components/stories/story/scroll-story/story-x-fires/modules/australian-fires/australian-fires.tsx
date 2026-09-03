import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import ScrollImageSequence from "../../../modules/base-scroll/scroll-image-sequence/scroll-image-sequence";
import Dimmer, { DimmerAnimationConfig } from "../dimmer/dimmer";
import Credentials from "../../../modules/credentials/credentials";
import FadeWrapper from "../fade-wrapper/fade-wrapper";

import { ENTERING_TEXT_OUTPUT, TWO_TEXT_TIMING } from "../animation-timings";

const animationConfig = {
  imageSequence: {
    progressRange: [0, 1],
    input: [0, 0.95, 1],
    output: ["100%", "100%", "50%"],
  },
  scrollText1: {
    input: TWO_TEXT_TIMING.first,
    output: ENTERING_TEXT_OUTPUT,
  },
  scrollText2: {
    input: TWO_TEXT_TIMING.second,
    output: ENTERING_TEXT_OUTPUT,
  },
  dimmer: {
    input: [0.7, 0.8],
    output: [0.5, 0],
  },
} satisfies DimmerAnimationConfig;

export type AustralianFiresAnimationConfig = typeof animationConfig;

export default function AustralianFiresModule() {
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
      <FadeWrapper direction="fadeOut">
        <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
          <Credentials description={xFiresModule.legend?.description || ""}>
            {xFiresModule.credentials}
          </Credentials>
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
      </FadeWrapper>
    </ScrollModule>
  );
}
