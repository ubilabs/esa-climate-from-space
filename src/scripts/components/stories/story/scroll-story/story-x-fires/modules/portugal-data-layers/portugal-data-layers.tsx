import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import ScrollImageSequence from "../../../modules/base-scroll/scroll-image-sequence/scroll-image-sequence";
import Dimmer, { DimmerAnimationConfig } from "../dimmer/dimmer";
import { Layers } from "./layers/layers";
import { Timeline } from "./timeline/timeline";

import styles from "./portugal-data-layers.module.css";

const animationConfig = {
  scrollText1: {
    input: [0, 0.0628, 0.0785],
    output: ["0%", "0%", "-100%"],
  },
  scrollText2: {
    input: [0.1099, 0.1256, 0.157, 0.1727],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText3: {
    input: [0.2041, 0.2198, 0.2512, 0.2669],
    output: ["100%", "0%", "0%", "-100%"],
  },
  layer1: {
    figure: {
      input: [0.0785, 0.0942],
      output: ["-100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.0942,
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
      input: [0.2669, 0.2826],
      output: ["-100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.2826,
    },
  },
  layer4: {
    figure: {
      input: [0.3297, 0.3453],
      output: ["-100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.7453,
    },
  },
  outro: {
    perspective: [0.5494, 0.5808],
    translate: [0.5808, 0.5965],
    scale: [0.5494, 0.5965],
    fadeOut: {
      input: [0.5651, 0.65],
      output: ["100%", "0%"],
    },
  },
  dimmer: {
    input: [
      0.0628, 0.0785, 0.1099, 0.1256, 0.157, 0.1727, 0.2041, 0.2198,
      0.2512, 0.2669, 0.8512, 0.8791,
    ],
    output: [0.5, 0, 0, 0.5, 0.5, 0, 0, 0.5, 0.5, 0, 0.5, 0],
  },
  timeline: {
    visibilityThreshold: 0.361,
    timeThresholds: [
      0.3924, 0.4081, 0.4238, 0.4395, 0.4552, 0.4709, 0.4866,
      0.5023, 0.518, 0.6279,
    ],
  },
  imageSequence: {
    progressRange: [0.7583, 1],
    input: [0.5651, 0.735],
    output: ["0%", "100%"],
  },
  scrollText4: {
    input: [0.6279, 0.6651, 0.6837, 0.7116, 0.7395],
    output: ["100%", "100%", "25%", "25%", "-100%"],
  },
  scrollText5: {
    input: [0.7581, 0.7767, 0.814, 0.8512],
    output: ["100%", "35%", "35%", "-100%"],
  },
} satisfies DimmerAnimationConfig;

export type PortugalDataLayersAnimationConfig = typeof animationConfig;

export default function PortugalDataLayersModule() {
  const { module, getRefCallback } = useModuleContent();
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
        <ScrollText
          className={styles.scrollText}
          text={xFiresModule.content?.scrollText3 || ""}
          inputRange={animationConfig.scrollText3.input}
          outputRange={animationConfig.scrollText3.output}
        />
        <ScrollText
          text={xFiresModule.content?.scrollText4 || ""}
          inputRange={animationConfig.scrollText4.input}
          outputRange={animationConfig.scrollText4.output}
        />
        <ScrollText
          text={xFiresModule.content?.scrollText5 || ""}
          inputRange={animationConfig.scrollText5.input}
          outputRange={animationConfig.scrollText5.output}
        />
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
