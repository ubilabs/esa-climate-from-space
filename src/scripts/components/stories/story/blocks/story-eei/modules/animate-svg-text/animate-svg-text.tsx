import ScrollModule from "../base-scroll/module/scroll-module";
import styles from "./animate-svg-text.module.css";
import Arrows from "./arrows/arrows";

const animationConfig = {
  fadeIn: {
    input: [0, 0.2],
    output: [0, 1],
  },
  fadeOut: {
    input: [0.8, 1],
    output: [1, 0],
  },
  scale: {
    input: [0, 0.3, 0.7, 1],
    output: [0.5, 1, 1, 0.8],
  },
  yPosition: {
    input: [0, 0.5, 1],
    output: ["20%", "0%", "-20%"],
  },
  xPosition: {
    input: [0, 0.5, 1],
    output: ["0%", "0%", "0%"],
  },
} as const;

export type AnimateSVGTextConfig = typeof animationConfig;

export default function AnimateSVGTextModule() {
  const moduleTotalLength = 5;

  return (
    <ScrollModule
      config={animationConfig}
      style={{ height: `calc(var(--story-height) * ${moduleTotalLength})` }}
      className={styles.animateSVGTextWrapper}
    >
      <ScrollModule.Slide className={styles.container}>
        TEST
        <Arrows />
      </ScrollModule.Slide>
    </ScrollModule>
  );
}
