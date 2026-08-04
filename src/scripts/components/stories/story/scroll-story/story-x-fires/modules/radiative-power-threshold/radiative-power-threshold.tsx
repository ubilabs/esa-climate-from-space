import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import Dimmer, { DimmerAnimationConfig } from "../dimmer/dimmer";
import { FireFlame } from "./fire-flame/fire-flame";

import styles from "./radiative-power-threshold.module.css";

const animationConfig = {
  scrollText1: {
    input: [0, 0.075, 0.225, 0.3],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText2: {
    input: [0.3, 0.375, 0.525, 0.6],
    output: ["100%", "0%", "0%", "-100%"],
  },
  flame: {
    expandedThreshold: 0.675,
  },
  dimmer: {
    input: [0.15, 0.225, 0.525, 0.6, 0.925, 1],
    output: [1, 0.5, 0.5, 0, 0, 1],
  },
} satisfies DimmerAnimationConfig;

export type RadiativePowerThresholdAnimationConfig = typeof animationConfig;

export default function RadiativePowerThresholdModule() {
  const { module, getRefCallback } = useModuleContent();
  const xFiresModule = module as StoryXFiresModule;

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <FireFlame />
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
