import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import { useScreenInfo } from "../../../../../../../hooks/use-screen-info";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import ScrollImageSequence from "../../../modules/base-scroll/scroll-image-sequence/scroll-image-sequence";
import ProgressInfoPopover from "../progress-info-popover/progress-info-popover";
import { Layers } from "./layers/layers";
import { Timeline } from "./timeline/timeline";
import { ENTERING_TEXT_OUTPUT } from "../animation-timings";

import cx from "classnames";

import styles from "./portugal-data-layers.module.css";

const animationConfig = {
  scrollText1: {
    input: [0, 0.02, 0.06, 0.09, 0.12],
    output: ENTERING_TEXT_OUTPUT,
  },
  scrollText2: {
    input: [0.12, 0.145, 0.19, 0.22, 0.25],
    output: ENTERING_TEXT_OUTPUT,
  },
  scrollText3: {
    input: [0.25, 0.28, 0.42, 0.47, 0.52],
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
    progressRange: [0.75, 0.96],
    input: [0.625, 0.75],
    output: ["0%", "100%"],
  },
  progressInfoPopover: {
    startProgress: 0.9,
    endProgress: 0.92,
  },
  scrollText4: {
    input: [0.66, 0.7, 0.72, 0.78, 0.8],
    output: ["100%", "100%", "25%", "-20%", "-100%"],
  },
  scrollText5: {
    input: [0.78, 0.82, 1],
    output: ["100%", "25%", "25%"],
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
        <ProgressInfoPopover
          description={xFiresModule.infoContent?.description || "TEST"}
          infoContent={xFiresModule.infoContent?.description || "TEST"}
          className={styles.infoPopover}
          contentClassName={styles.infoContent}
        >
          {xFiresModule.credentials}
        </ProgressInfoPopover>
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
              ? ["100%", "100%", "0%", "-20%", "-100%"]
              : animationConfig.scrollText4.output
          }
        />
        <ScrollText
          className={cx(styles.scrollText, styles.rightScrollText)}
          text={xFiresModule.content?.scrollText5 || ""}
          inputRange={animationConfig.scrollText5.input}
          outputRange={
            isDesktop
              ? ["100%", "0%", "0%", "-20%", "-100%"]
              : animationConfig.scrollText5.output
          }
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
