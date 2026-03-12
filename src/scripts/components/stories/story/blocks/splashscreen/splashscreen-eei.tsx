import { useStory } from "../../../../../providers/story/use-story";
import { StoryIcon } from "../../../../main/icons/story-icon";
import ScrollModule from "../story-eei/modules/base-scroll/module/scroll-module";
import styles from "./splashscreen-eei.module.css";

const animationConfig = {
  initial: {
    scale: {
      input: [0, 0.1, 0.4, 0.9, 1],
      output: [0.01, 0.1, 1, 1, 0.01],
    },
  },
};

export default function SplashscreenEei() {
  const { story } = useStory();
  const splashConfig = story?.splashscreen;
  console.log("🚀 ~ splashscreen-eei.tsx:17 → splashConfig:", splashConfig);

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={splashConfig?.lengthFactor ?? 1}
    >
      <ScrollModule.StickyContainer className={styles.splashWrapper}>
        <div className={styles.introIconContainer}>
          {<StoryIcon />}
          Story
        </div>
        <div

          className={styles.title}

        >{splashConfig?.title}</div>
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
