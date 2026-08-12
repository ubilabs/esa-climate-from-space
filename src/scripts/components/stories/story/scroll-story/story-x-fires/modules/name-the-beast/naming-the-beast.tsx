import { StoryXFiresModule } from "../../../../../../../types/story";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import { useInView } from "motion/react";
import { useRef } from "react";

import ScrollModule from "../../../modules/base-scroll/module/scroll-module";
import GlobalFires from "./global-fires/global-fires";
import ScrollText from "../../../modules/base-scroll/scroll-text/scroll-text";

import styles from "./naming-the-beast.module.css";

const animationConfig = {
  scrollText1: {
    input: [0, 0.075, 0.225, 0.3],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText2: {
    input: [0.3, 0.375, 0.525, 0.55],
    output: ["100%", "0%", "0%", "-100%"],
  },
  scrollText3: {
    input: [0.55, 0.675, 0.825, 0.9],
    output: ["100%", "0%", "0%", "-100%"],
  },
};

export type NamingTheBeastConfig = typeof animationConfig;

export default function NamingTheBeast() {
  const { module, getRefCallback } = useModuleContent();
  const xFiresModule = module as StoryXFiresModule;
  const ref = useRef(null);

  const isModuleInView = useInView(ref);

  return (
    <ScrollModule
      refTarget={ref}
      config={animationConfig}
      lengthFactor={xFiresModule.lengthFactor}
    >
      <ScrollModule.StickyContainer isGrid ref={getRefCallback(0, 0)}>
        {isModuleInView && <GlobalFires />}
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
