import ScrollModule from "../base-scroll/module/scroll-module";
import BulbAnimation from "./bulb-animation/bulb-animation";
import KettleBox from "./kettle-box/kettle-box";
import KettleOverlay from "./kettle-overlay/kettle-overlay";
import { KettleAmountAnimationConfig } from "./kettle-amount-types";
import styles from "./kettle-amount.module.css";

export default function KettleAmountModule() {
  const moduleTotalLength = 5;

  const animationConfig: KettleAmountAnimationConfig = {
    initial: {
      scale: {
        input: [0, 0.05, 0.1, 0.2],
        output: [0.01, 0.05, 0.1, 1],
      },
      yPosition: {
        input: [0, 0.2],
        output: ["20%", "0%"],
      },
      bulbOpacity: {
        input: [0, 0.07, 0.09, 0.12],
        output: [0, 0, 0.8, 1],
      },
    },
    bulbExit: {
      input: [0.1, 0.2],
      output: ["0vh", "-100vh"],
    },
    squareMeterScale: {
      input: [0.2, 0.3],
      output: ["8", "1"],
    },
    satellite: {
      xPosition: {
        input: [0, 0.4, 0.56, 0.65],
        output: ["-25vw", "0vw", "0", "-25vw"],
      },
      opacity: {
        input: [0, 0.3, 0.4, 0.65, 0.67],
        output: ["0", "0", "1", "1", "0"],
      },
    },
    kettleRows: {
      rangeStart: 0.5,
      rangeEnd: 0.6,
      fadeIn: {
        input: [0.3, 0.33],
        output: [0, 1],
      },
    },
    yearSlider: {
      fadeIn: {
        input: [0.3, 0.33],
        output: ["0", "1"],
      },
      slide: {
        input: [0, 0.54, 0.64],
        output: ["-46%", "-46%", "0%"],
      },
    },
    overlays: [
      {
        inputRange: [0.33, 0.35, 0.38, 0.4],
        text: "But accumulated over a year, it's enough energy to boil 70 kettles of water.",
      },
      {
        inputRange: [0.4, 0.42, 0.48, 0.5],
        text: "Satellites have been measuring the solar energy reaching and leaving Earth since the start of the century.",
      },
      {
        inputRange: [0.54, 0.55, 0.64, 0.65],
        text: "Five years ago the energy imbalance was smaller.",
      },
    ],
  };

  return (
    <ScrollModule
      config={animationConfig}
      style={{ height: `calc(var(--story-height) * ${moduleTotalLength})` }}
      className={styles.kettleAmountWrapper}
    >
      <ScrollModule.Slide className={styles.container}>
        <BulbAnimation />
        <KettleBox />
        {animationConfig.overlays.map((overlay, index) => (
          <KettleOverlay key={index} {...overlay} />
        ))}
      </ScrollModule.Slide>
    </ScrollModule>
  );
}
