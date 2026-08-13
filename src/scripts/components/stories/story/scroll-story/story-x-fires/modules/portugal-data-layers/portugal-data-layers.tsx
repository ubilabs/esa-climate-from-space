import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";
import Dimmer, { DimmerAnimationConfig } from "../dimmer/dimmer";
import { DataLayer } from "./data-layer/data-layer";
import { Timeline } from "./timeline/timeline";

import styles from "./portugal-data-layers.module.css";

const animationConfig = {
  scrollText1: {
    input: [0.025, 0.05, 0.1, 0.125],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText2: {
    input: [0.175, 0.2, 0.25, 0.275],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText3: {
    input: [0.325, 0.35, 0.4, 0.425],
    output: ["100%", "0%", "0%", "-100%"],
  },
  layer1: {
    figure: {
      input: [0.125, 0.15],
      output: ["-100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.15,
    },
  },
  layer2: {
    figure: {
      input: [0.275, 0.3],
      output: ["-100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.3,
    },
  },
  layer3: {
    figure: {
      input: [0.425, 0.45],
      output: ["-100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.45,
    },
  },
  layer4: {
    figure: {
      input: [0.525, 0.55],
      output: ["-100vw", "0vw"],
    },
    label: {
      visibilityThreshold: 0.55,
    },
  },
  outro: {
    perspective: [0.875, 0.925],
    translate: [0.925, 0.95],
    scale: [0.875, 0.95],
  },
  dimmer: {
    input: [0.1, 0.125, 0.175, 0.2, 0.25, 0.275, 0.325, 0.35, 0.4, 0.425],
    output: [0.5, 0, 0, 0.5, 0.5, 0, 0, 0.5, 0.5, 0],
  },
  timeline: {
    visibilityThreshold: 0.575,
    timeThresholds: [
      0.625, 0.65, 0.675, 0.7, 0.725, 0.75, 0.775, 0.8, 0.825, 1,
    ],
  },
} satisfies DimmerAnimationConfig;

export type PortugalDataLayersAnimationConfig = typeof animationConfig;

export default function PortugalDataLayersModule() {
  const { module, getRefCallback } = useModuleContent();
  const xFiresModule = module as StoryXFiresModule;

  return (
    <ScrollModule
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <ScrollModule.StickyContainer
        className={styles.container}
        isGrid
        ref={getRefCallback(0, 0)}
      >
        <Timeline />

        <div className={styles.layers}>
          {([4, 3, 2, 1] as const).map((layerNumber) => (
            <DataLayer
              layerNumber={layerNumber}
              label={xFiresModule.content?.[`labelLayer${layerNumber}`] || ""}
            />
          ))}
        </div>
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
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
