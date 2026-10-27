import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollImageSequence from "../../../modules/base-scroll/scroll-image-sequence/scroll-image-sequence";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import { ENTERING_TEXT_OUTPUT, THREE_TEXT_TIMING } from "../animation-timings";

import styles from "./intro-module.module.css";

const animationConfig = {
  imageSequence: {
    progressRange: [0, 1],
    input: [0, 0.95, 1],
    output: ["100%", "100%", "50%"],
  },
  scrollText1: {
    input: THREE_TEXT_TIMING.first,
    output: ENTERING_TEXT_OUTPUT,
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

export type IntroAnimationConfig = typeof animationConfig;
type IntroModuleContent = StoryXFiresModule & {
  imageSequence: {
    path: string;
  };
};

export default function IntroModule() {
  const { module, getRefCallback } = useModuleContent();
  const xFiresModule = module as IntroModuleContent;

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <ScrollImageSequence
          sequence={xFiresModule.imageSequence}
          className={styles.scrollText}
        />
        <ScrollText
          className={styles.scrollText}
          text={xFiresModule.content?.scrollText1 || ""}
          inputRange={animationConfig.scrollText1.input}
          outputRange={animationConfig.scrollText1.output}
        />
        <ScrollText
          className={styles.scrollText}
          text={xFiresModule.content?.scrollText2 || ""}
          inputRange={animationConfig.scrollText2.input}
          outputRange={animationConfig.scrollText2.output}
        />
        <ScrollText
          className={styles.scrollText}
          text={xFiresModule.content?.scrollText3 || ""}
          inputRange={animationConfig.scrollText3.input}
          outputRange={animationConfig.scrollText3.output}
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
