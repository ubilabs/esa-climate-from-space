import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import { useRef } from "react";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import GlobalFires from "./global-fires/global-fires";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";

import { useScreenInfo } from "../../../../../../../hooks/use-screen-info";

import styles from "./naming-the-beast.module.css";

import {
  ENTERING_TEXT_OUTPUT,
  THREE_TEXT_TIMING,
  VISIBLE_TEXT_OUTPUT,
  ENTERING_TEXT_OUTPUT_BELOW,
  VISIBLE_TEXT_OUTPUT_BElOW,
} from "../animation-timings";

const animationConfig = {
  spinStart: 0.2,
  spinEnd: 0.9,
  globeOpacity: {
    input: [0, 0.05, 0.1, 0.9, 1],
    output: [0, 0, 1, 1, 0],
  },
  scrollText1: {
    desktop: {
      input: THREE_TEXT_TIMING.firstVisible,
      output: VISIBLE_TEXT_OUTPUT,
    },
    mobile: {
      input: THREE_TEXT_TIMING.firstVisible,
      output: VISIBLE_TEXT_OUTPUT_BElOW,
    },
  },
  scrollText2: {
    desktop: {
      input: THREE_TEXT_TIMING.second,
      output: ENTERING_TEXT_OUTPUT,
    },
    mobile: {
      input: THREE_TEXT_TIMING.second,
      output: ENTERING_TEXT_OUTPUT_BELOW,
    },
  },
  scrollText3: {
    desktop: {
      input: THREE_TEXT_TIMING.third,
      output: ENTERING_TEXT_OUTPUT,
    },
    mobile: {
      input: THREE_TEXT_TIMING.third,
      output: ENTERING_TEXT_OUTPUT_BELOW,
    },
  },
};

export type NamingTheBeastConfig = typeof animationConfig;

export default function NamingTheBeast() {
  const { module, getRefCallback } = useModuleContent();
  const xFiresModule = module as StoryXFiresModule;
  const ref = useRef(null);

  const { isMobile } = useScreenInfo();

  const key = isMobile ? "mobile" : "desktop";

  return (
    <ScrollModule
      refTarget={ref}
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <GlobalFires />
        <ScrollText
          className={styles.beastScrollText}
          inlinePlacement="left"
          isHeadline
          text={xFiresModule.content?.scrollText1 || ""}
          inputRange={animationConfig.scrollText1[key].input}
          outputRange={animationConfig.scrollText1[key].output}
        />
        <ScrollText
          className={styles.beastScrollText}
          inlinePlacement="left"
          text={xFiresModule.content?.scrollText2 || ""}
          inputRange={animationConfig.scrollText2[key].input}
          outputRange={animationConfig.scrollText2[key].output}
        />
        <ScrollText
          className={styles.beastScrollText}
          inlinePlacement="left"
          text={xFiresModule.content?.scrollText3 || ""}
          inputRange={animationConfig.scrollText3[key].input}
          outputRange={animationConfig.scrollText3[key].output}
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
