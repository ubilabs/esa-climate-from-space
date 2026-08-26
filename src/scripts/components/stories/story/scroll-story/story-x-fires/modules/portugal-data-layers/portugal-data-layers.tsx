import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import { useScreenInfo } from "../../../../../../../hooks/use-screen-info";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import ScrollImageSequence from "../../../modules/base-scroll/scroll-image-sequence/scroll-image-sequence";
import Dimmer, { DimmerAnimationConfig } from "../dimmer/dimmer";
import { Layers } from "./layers/layers";
import { Timeline } from "./timeline/timeline";

import cx from "classnames";

import styles from "./portugal-data-layers.module.css";

const animationConfig = {
  scrollText1: {
    input: [0.2041, 0.2198, 0.2512, 0.2669],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText2: {
    input: [0.3767, 0.3924, 0.4238, 0.4395],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText3: {
    input: [0.4552, 0.4709, 0.5023, 0.518],
    output: ["100%", "0%", "0%", "-100%"],
  },
  layer1: {
    figure: {
      input: [0.0157, 0.03],
      output: ["-100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.03,
    },
  },
  layer2: {
    figure: {
      input: [0.1727, 0.1884],
      output: ["-100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.1884,
    },
  },
  layer3: {
    figure: {
      input: [0.2826, 0.2983],
      output: ["-100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.2983,
    },
  },
  layer4: {
    figure: {
      input: [0.3453, 0.361],
      output: ["-100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.361,
    },
  },
  layerStack: {
    input: [0, 0.518, 0.5337],
    output: ["20vw", "20vw", "0vw"],
  },
  outro: {
    perspective: [0.6907, 0.7221],
    translate: [0.7221, 0.7378],
    scale: [0.6907, 0.7378],
    fadeOut: {
      input: [0.7064, 0.7913],
      output: ["100%", "0%"],
    },
  },
  dimmer: {
    input: [
      0.2041, 0.2198, 0.2512, 0.2669, 0.3767, 0.3924, 0.4238, 0.4395, 0.4552,
      0.4709, 0.5023, 0.518, 0.98, 1,
    ],
    output: [0, 0.5, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0.5, 0.5, 0, 0.5, 0],
  },
  timeline: {
    visibilityThreshold: 0.5337,
    timeThresholds: [
      0.5494, 0.5651, 0.5808, 0.5965, 0.6122, 0.6279, 0.6436, 0.6593, 0.675,
      0.6907,
    ],
  },
  imageSequence: {
    progressRange: [0.82, 1],
    input: [0.7064, 0.8064],
    output: ["0%", "100%"],
  },
  scrollText4: {
    input: [0.675, 0.7221, 0.7407, 0.7686, 0.7965],
    output: ["100%", "100%", "25%", "25%", "-100%"],
  },
  scrollText5: {
    input: [0.94, 0.96, 0.98, 1],
    output: ["100%", "35%", "35%", "-100%"],
  },
} satisfies DimmerAnimationConfig;

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
        <Dimmer />
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
