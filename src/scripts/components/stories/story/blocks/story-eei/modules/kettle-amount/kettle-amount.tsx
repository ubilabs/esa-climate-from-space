<<<<<<< Updated upstream
import {  useMemo } from "react";
=======
import { useMemo } from "react";
>>>>>>> Stashed changes
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import ScrollModule from "../base-scroll/module/scroll-module";

import styles from "./kettle-amount.module.css";
import KettleRow from "./kettle-row/kettle-row";
import YearSlider from "./year-slider/year-slider";
import KettleOverlay from "./kettle-overlay/kettle-overlay";
import { SatelliteIcon } from "../../../../../../main/icons/satellite-icon";
import { StoryEEIBulb } from "../../../../../../main/icons/story-eei-bulb";

export default function KettleAmountModule() {
  const scrollYProgress = useMotionValue(0);
  const moduleTotalLength = 5;

  // get the motion values from the module wrapper
  const motionCallbacks = useMemo(
    () => ({
      updateScrollYProgress: (value: number) => scrollYProgress.set(value),
      updateScrollY: () => null,
    }),
    [scrollYProgress],
  );

  useMotionValueEvent(scrollYProgress, "change", (e: number) =>
    console.log("using progress value", e),
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.05, 0.1, 0.2],
    [0.01, 0.05, 0.1, 1],
  );
  const y = useTransform(scrollYProgress, [0, 0.2], ["20%", "0%"]);

  const kettleRowCounter = 8;

  return (
    <ScrollModule
      style={{ height: `calc(var(--story-height) * ${moduleTotalLength})` }}
      className={styles.kettleAmountWrapper}
      motionCallbacks={motionCallbacks}
    >
      <ScrollModule.Slide className={styles.container}>
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0.1, 0.2], ["0vh", "-100vh"]),
          }}
          className={styles.bulbInfoContaier}
        >
          <div className={styles.bulbContainer}>
            <motion.span
              style={{
                opacity: useTransform(
                  scrollYProgress,
                  [0, 0.07, 0.09, 0.12],
                  [0, 0, 0.8, 1],
                ),
              }}
            >
              <StoryEEIBulb isGlowing={true} />
            </motion.span>
            <motion.span>
              <StoryEEIBulb isGlowing={false} />
            </motion.span>
          </div>
          <span>Each square metre of Earth’s surface retains 1.4 Watts.</span>
        </motion.div>
        <div className={styles.boxContainer}>
          <motion.div className={styles.box} style={{ scale, y }}>
            {Array.from({ length: kettleRowCounter }).map((_, index) => (
              <KettleRow index={index} progress={scrollYProgress} />
            ))}
            <motion.span
              className={styles.squareMeter}
              style={{
                scale: useTransform(scrollYProgress, [0.2, 0.3], ["8", "1"]),
              }}
            >
              1m2
            </motion.span>
            <motion.div
              className={styles.satellite}
              initial={{ x: "-10vw" }}
              style={{
                x: useTransform(
                  scrollYProgress,
                  [0, 0.4, 0.56, 0.65],
                  ["-25vw", "0vw", "0", "-25vw"],
                ),

                opacity: useTransform(
                  scrollYProgress,
                  [0, 0.3, 0.4, 0.65, 0.67],
                  ["0", "0", "1", "1", "0"],
                ),
              }}
            >
              <SatelliteIcon />
            </motion.div>
          </motion.div>
          <YearSlider progress={scrollYProgress} />
        </div>

        <KettleOverlay
          progress={scrollYProgress}
          inpuRange={[0.33, 0.35, 0.38, 0.4]}
          text={
            "But accumulated over a year, it’s enough energy to boil 70 kettles of water."
          }
        />
        <KettleOverlay
          progress={scrollYProgress}
          inpuRange={[0.4, 0.42, 0.48, 0.5]}
          text={
            "Satellites have been measuring the solar energy reaching and leaving Earth since the start of the century."
          }
        />
        <KettleOverlay
          progress={scrollYProgress}
          inpuRange={[0.54, 0.55, 0.64, 0.65]}
          text={"Five years ago the energy imbalance was smaller."}
        />
      </ScrollModule.Slide>
    </ScrollModule>
  );
}
