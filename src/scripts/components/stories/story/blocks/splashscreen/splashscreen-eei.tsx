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
          <div className={styles.sunContainer}>
            <svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMin slice">
              <defs>
                <radialGradient id="test" cx="50%" cy="0%" r="100%">
                  <stop
                    offset="0%"
                    stopColor="var(--story-eei-splashcolor)"
                    stopOpacity="0"
                  />
                  <stop
                    offset="50%"
                    stopColor="var(--story-eei-splashcolor)"
                    stopOpacity="0"
                  />
                  <stop
                    offset="70.9%"
                    stopColor="var(--atmosphere-color)"
                    stopOpacity="1"
                  />
                  <stop offset="71%" stopColor="white" stopOpacity="0.5" />
                  <stop offset="71.1%" stopColor="white" stopOpacity="0.5" />
                  <stop
                    offset="71.2%"
                    stopColor="var(--atmosphere-color)"
                    stopOpacity="0.55"
                  />
                  <stop
                    offset="80%"
                    stopColor="var(--neutral-esa-background)"
                    stopOpacity="0.25"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--neutral-esa-background)"
                    stopOpacity="1"
                  />
                </radialGradient>

                <radialGradient id="test2" cx="50%" cy="0%" r="100%">
                  <stop
                    offset="58%"
                    stopColor="var(--story-eei-splashcolor)"
                    stopOpacity="1"
                  />
                  <stop offset="100%" stopColor="transparent" stopOpacity="1" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#test)" />{" "}
            </svg>
          </div>
        </div>
        <div className={styles.title}>{splashConfig?.title}</div>
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
