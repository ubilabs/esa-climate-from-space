import {  useMemo } from "react";
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

export default function KettleAmountModule() {
  const scrollYProgress = useMotionValue(0);
  const moduleTotalLength = 10;

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

  const scale = useTransform(scrollYProgress, [0.1, 0.2], [0.1, 1]);
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
          className={styles.bulbContainer}
        >
          <span>placeholder</span>
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
                scale: useTransform(scrollYProgress, [0.2, 0.3], ["7", "1"]),
              }}
            >
              1m2
            </motion.span>
            <motion.div
              className={styles.satellite}
              style={{
                x: useTransform(
                  scrollYProgress,
                  [0, 0.4, 0.45, 0.48, 0.65],
                  ["-10vw", "-10vw", "0", "0", "-10vw"],
                ),

                opacity: useTransform(
                  scrollYProgress,
                  [0, 0.4, 0.45, 0.63, 0.65],
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
