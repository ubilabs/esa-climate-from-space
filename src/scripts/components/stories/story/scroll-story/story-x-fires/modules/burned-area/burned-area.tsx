import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import Dimmer, { DimmerAnimationConfig } from "../dimmer/dimmer";
import { FireRing } from "./fire-ring/fire-ring";
import {
  ENTERING_TEXT_OUTPUT,
  getDimmerConfig,
  TWO_TEXT_TIMING,
} from "../animation-timings";

import styles from "./burned-area.module.css";

const animationConfig = {
  scrollText1: {
    input: TWO_TEXT_TIMING.first,
    output: ENTERING_TEXT_OUTPUT,
  },
  scrollText2: {
    input: TWO_TEXT_TIMING.second,
    output: ENTERING_TEXT_OUTPUT,
  },
  burnedArea: {
    visibleThreshold: 0.25,
    expandedThreshold: 0.65,
  },
  dimmer: getDimmerConfig([TWO_TEXT_TIMING.first, TWO_TEXT_TIMING.second]),
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
