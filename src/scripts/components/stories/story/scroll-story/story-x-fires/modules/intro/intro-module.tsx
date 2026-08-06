import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";

import styles from "./intro-module.module.css";

import ScrollVideo from "../../../modules/base-scroll/scroll-video/scroll-video";

const animationConfig = {
  video: {
    playBack: [0.2, 0.8],
    input: [0, 0.9],
    output: ["100%", "100%"],
  },
  scrollText1: {
    input: [0, 0.075, 0.225, 0.3],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText2: {
    input: [0.3, 0.375, 0.525, 0.6],
    output: ["100%", "0%", "0%", "-100%"],
  },
};

export type IntroAnimationConfig = typeof animationConfig;
type IntroModuleContent = StoryXFiresModule;

export default function IntroModule() {
  const { module, getRefCallback } = useModuleContent();
  const xFiresModule = module as IntroModuleContent;

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <ScrollVideo src={module.videoSrc} className={styles.scrollText} />
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
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
