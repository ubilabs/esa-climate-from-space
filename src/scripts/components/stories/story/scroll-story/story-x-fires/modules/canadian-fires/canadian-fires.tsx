import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import { useScreenInfo } from "../../../../../../../hooks/use-screen-info";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import ScrollImageSequence from "../../../modules/base-scroll/scroll-image-sequence/scroll-image-sequence";
import { DimmerAnimationConfig } from "../dimmer/dimmer";
import LegendFooter from "../legend-footer/legend-footer";
import Credentials from "../../../modules/credentials/credentials";

import {
  ENTERING_TEXT_OUTPUT,
  getDimmerConfig,
  TWO_TEXT_TIMING,
} from "../animation-timings";

import styles from "./canadian-fires.module.css";

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
  dimmer: getDimmerConfig([TWO_TEXT_TIMING.first, TWO_TEXT_TIMING.second]),
} satisfies DimmerAnimationConfig;

export type CanadianFiresAnimationConfig = typeof animationConfig;

export default function CanadianFiresModule() {
  const { storyId, module, getRefCallback } = useModuleContent();
  const { isMobile } = useScreenInfo();

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
      <ScrollModule.StickyContainer
        isGrid
        ref={getRefCallback(0, 0)}
        className={styles.container}
      >
        <Credentials description={xFiresModule.legend?.description || ""}>
          {xFiresModule.credentials}
        </Credentials>
        {isMobile ? (
          <>
            <div className={styles.mobileSequenceRegion}>
              <ScrollImageSequence
                className={styles.sequence}
                sequence={xFiresModule.imageSequence}
                mobileAspectRatio="720 / 551"
              />
            </div>
            <div className={styles.mobileTextRegion}>
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
            </div>
          </>
        ) : (
          <>
            <ScrollImageSequence
              className={styles.sequence}
              sequence={xFiresModule.imageSequence}
              mobileAspectRatio="720 / 551"
            />
            <ScrollText
              inlinePlacement="left"
              className={styles.scrollText}
              text={xFiresModule.content?.scrollText1 || ""}
              inputRange={animationConfig.scrollText1.input}
              outputRange={animationConfig.scrollText1.output}
            />
            <ScrollText
              inlinePlacement="left"
              className={styles.scrollText}
              text={xFiresModule.content?.scrollText2 || ""}
              inputRange={animationConfig.scrollText2.input}
              outputRange={animationConfig.scrollText2.output}
            />
          </>
        )}
        {xFiresModule.legend && (
          <LegendFooter storyId={storyId} legend={xFiresModule.legend} />
        )}
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
