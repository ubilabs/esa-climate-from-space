import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import Dimmer, { DimmerAnimationConfig } from "../dimmer/dimmer";
import { FireFlame } from "./fire-flame/fire-flame";
import {
  ENTERING_TEXT_OUTPUT,
  ENTERING_TEXT_OUTPUT_ABOVE,
  getDimmerConfig,
  TEXT_TO_REMAIN_OUTPUT,
  TEXT_TO_REMAIN_OUTPUT_ABOVE,
  TWO_TEXT_TIMING,
} from "../animation-timings";

import { useScreenInfo } from "../../../../../../../hooks/use-screen-info";

import styles from "./radiative-power-threshold.module.css";

const animationConfig = {
  scrollText1: {
    mobile: {
      input: TWO_TEXT_TIMING.first,
      output: ENTERING_TEXT_OUTPUT_ABOVE,
    },
    desktop: {
      input: TWO_TEXT_TIMING.first,
      output: ENTERING_TEXT_OUTPUT,
    },
  },
  scrollText2: {
    mobile: {
      input: TWO_TEXT_TIMING.second,
      output: TEXT_TO_REMAIN_OUTPUT_ABOVE,
    },
    desktop: {
      input: TWO_TEXT_TIMING.second,
      output: TEXT_TO_REMAIN_OUTPUT,
    },
  },
  flame: {
    expandedThreshold: 0.675,
  },
  dimmer: getDimmerConfig([TWO_TEXT_TIMING.first, TWO_TEXT_TIMING.second]),
} satisfies DimmerAnimationConfig;

export type RadiativePowerThresholdAnimationConfig = typeof animationConfig;

export default function RadiativePowerThresholdModule() {
  const { module, getRefCallback } = useModuleContent();
  const xFiresModule = module as StoryXFiresModule;

  const { isMobile } = useScreenInfo();

  const key = isMobile ? "mobile" : "desktop";

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <FireFlame />
        {isMobile && <Dimmer />}
        <ScrollText
          inlinePlacement="right"
          className={styles.scrollText}
          text={xFiresModule.content?.scrollText1 || ""}
          inputRange={animationConfig.scrollText1[key].input}
          outputRange={animationConfig.scrollText1[key].output}
        />
        <ScrollText
          inlinePlacement="right"
          className={styles.scrollText}
          text={xFiresModule.content?.scrollText2 || ""}
          inputRange={animationConfig.scrollText2[key].input}
          outputRange={animationConfig.scrollText2[key].output}
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
