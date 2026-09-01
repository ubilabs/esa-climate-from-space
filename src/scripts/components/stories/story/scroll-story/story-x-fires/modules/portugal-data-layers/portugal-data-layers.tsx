import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import { useScreenInfo } from "../../../../../../../hooks/use-screen-info";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import ScrollImageSequence from "../../../modules/base-scroll/scroll-image-sequence/scroll-image-sequence";
import { Layers } from "./layers/layers";
import { Timeline } from "./timeline/timeline";

import cx from "classnames";

import styles from "./portugal-data-layers.module.css";

const animationConfig = {
  scrollText1: {
    input: [0, 0.0197, 0.0789, 0.0986],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText2: {
    input: [0.1972, 0.2169, 0.276, 0.2958],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText3: {
    input: [0.3155, 0.3352, 0.5325, 0.5522],
    output: ["100%", "0%", "0%", "-100%"],
  },
  layer1: {
    figure: {
      input: [0, 0.0197],
      output: ["100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.0197,
    },
  },
  layer2: {
    figure: {
      input: [0.0197, 0.0395],
      output: ["100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.0395,
    },
  },
  layer3: {
    figure: {
      input: [0.1972, 0.2169],
      output: ["100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.2169,
    },
  },
  layer4: {
    figure: {
      input: [0.2169, 0.2366],
      output: ["100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.2366,
    },
  },
  layerStack: {
    input: [0, 0.5325, 0.5522],
    output: ["20vw", "20vw", "0vw"],
  },
  outro: {
    perspective: [0.5522, 0.5917],
    translate: [0.5917, 0.6114],
    scale: [0.5522, 0.6114],
    fadeOut: {
      input: [0.6311, 0.7378],
      output: ["100%", "0%"],
    },
  },
  timeline: {
    visibilityThreshold: 0.3352,
    timeThresholds: [
      0.3549, 0.3747, 0.3944, 0.4141, 0.4338, 0.4536, 0.4733, 0.493, 0.5128,
      0.5325,
    ],
  },
  imageSequence: {
    progressRange: [0.7738, 1],
    input: [0.6311, 0.7568],
    output: ["0%", "100%"],
  },
  scrollText4: {
    input: [0.5917, 0.6508, 0.6742, 0.7093, 0.7443],
    output: ["100%", "100%", "25%", "25%", "-100%"],
  },
  scrollText5: {
    input: [0.9246, 0.9497, 0.9749, 1],
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
