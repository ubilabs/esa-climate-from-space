import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import Dimmer, { DimmerAnimationConfig } from "../dimmer/dimmer";
import { FireRing } from "./fire-ring/fire-ring";

import styles from "./burned-area.module.css";

const animationConfig = {
  scrollText1: {
    input: [0, 0.05, 0.15, 0.2],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText2: {
    input: [0.4, 0.45, 0.55, 0.6],
    output: ["100%", "0%", "0%", "-100%"],
  },
  burnedArea: {
    visibleThreshold: 0.25,
    expandedThreshold: 0.65,
  },
  dimmer: {
    input: [0.1, 0.15, 0.15, 0.2, 0.4, 0.45, 0.55, 0.6, 0.95, 1],
    output: [1, 0.5, 0.5, 0, 0, 0.5, 0.5, 0, 0, 1],
  },
} satisfies DimmerAnimationConfig;

export type BurnedAreaAnimationConfig = typeof animationConfig;

export default function BurnedAreaModule() {
  const { module, getRefCallback } = useModuleContent();
  const xFiresModule = module as StoryXFiresModule;

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <FireRing />
        <Dimmer />
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
