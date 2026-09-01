import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import { useScreenInfo } from "../../../../../../../hooks/use-screen-info";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import ScrollImageSequence from "../../../modules/base-scroll/scroll-image-sequence/scroll-image-sequence";
import { Layers } from "./layers/layers";
import { Timeline } from "./timeline/timeline";
import { ENTERING_TEXT_OUTPUT } from "../animation-timings";

import cx from "classnames";

import styles from "./portugal-data-layers.module.css";

const animationConfig = {
  scrollText1: {
    input: [0, 0.025, 0.075, 0.1],
    output: ENTERING_TEXT_OUTPUT,
  },
  scrollText2: {
    input: [0.15, 0.175, 0.225, 0.25],
    output: ENTERING_TEXT_OUTPUT,
  },
  scrollText3: {
    input: [0.275, 0.3, 0.5, 0.525],
    output: ENTERING_TEXT_OUTPUT,
  },
  layer1: {
    figure: {
      input: [0, 0.025],
      output: ["100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.025,
    },
  },
  layer2: {
    figure: {
      input: [0.025, 0.05],
      output: ["100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.05,
    },
  },
  layer3: {
    figure: {
      input: [0.15, 0.175],
      output: ["100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.175,
    },
  },
  layer4: {
    figure: {
      input: [0.175, 0.2],
      output: ["100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.2,
    },
  },
  layerStack: {
    input: [0, 0.5, 0.525],
    output: ["20vw", "20vw", "0vw"],
  },
  outro: {
    perspective: [0.525, 0.575],
    translate: [0.575, 0.6],
    scale: [0.525, 0.6],
    fadeOut: {
      input: [0.625, 0.725],
      output: ["100%", "0%"],
    },
  },
  timeline: {
    visibilityThreshold: 0.3,
    timeThresholds: [0.32, 0.34, 0.36, 0.38, 0.4, 0.42, 0.44, 0.46, 0.48, 0.5],
  },
  imageSequence: {
    progressRange: [0.75, 1],
    input: [0.625, 0.75],
    output: ["0%", "100%"],
  },
  scrollText4: {
    input: [0.575, 0.625, 0.65, 0.7, 0.725],
    output: ["100%", "100%", "25%", "25%", "-100%"],
  },
  scrollText5: {
    input: [0.875, 0.9, 0.95, 0.975],
    output: ["100%", "25%", "25%", "-100%"],
  },
};

export type PortugalDataLayersAnimationConfig = typeof animationConfig;

export default function PortugalDataLayersModule() {
  const { module, getRefCallback } = useModuleContent();
  const { isDesktop } = useScreenInfo();
  const xFiresModule = module as StoryXFiresModule & {
    imageSequence: { path: string };
  };

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <Layers content={xFiresModule.content} />
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        <ScrollImageSequence sequence={xFiresModule.imageSequence} />
        <Timeline />
        <ScrollText
          className={cx(
            styles.scrollText,
            styles.foregroundScrollText,
            styles.leftScrollText,
          )}
          text={xFiresModule.content?.scrollText1 || ""}
          inputRange={animationConfig.scrollText1.input}
          outputRange={animationConfig.scrollText1.output}
        />
        <ScrollText
          className={cx(
            styles.scrollText,
            styles.foregroundScrollText,
            styles.leftScrollText,
          )}
          text={xFiresModule.content?.scrollText2 || ""}
          inputRange={animationConfig.scrollText2.input}
          outputRange={animationConfig.scrollText2.output}
        />
        <ScrollText
          className={cx(
            styles.scrollText,
            styles.foregroundScrollText,
            styles.leftScrollText,
          )}
          text={xFiresModule.content?.scrollText3 || ""}
          inputRange={animationConfig.scrollText3.input}
          outputRange={animationConfig.scrollText3.output}
        />
        <ScrollText
          className={cx(styles.scrollText, styles.rightScrollText)}
          text={xFiresModule.content?.scrollText4 || ""}
          inputRange={animationConfig.scrollText4.input}
          outputRange={
            isDesktop
              ? ["100%", "100%", "0%", "0%", "-100%"]
              : animationConfig.scrollText4.output
          }
        />
        <ScrollText
          className={cx(styles.scrollText, styles.rightScrollText)}
          text={xFiresModule.content?.scrollText5 || ""}
          inputRange={animationConfig.scrollText5.input}
          outputRange={
            isDesktop
              ? ["100%", "0%", "0%", "-100%"]
              : animationConfig.scrollText5.output
          }
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
